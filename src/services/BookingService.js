import { Booking, BookingCalendar, TimeSlot, Resource } from 'booking-module'

/**
 * Responsibilities:
 *
 * - Handles all communication with 'booking-module'. Nothing from
 *  the module (except Resource) is used outside this class.
 *
 * - Create Resource objects for new employees
 * - Create and convert TimeSlots that are used to search in module
 *
 * - Build BookingCalendars that gets saved bookings from
 *  BookingRegistry
 *
 * - Create booking ID:s
 * - Create Booking objects
 * - Convert Booking to and from generic objects.
 * - Send Bookings to BookingRegistry that saves them
 * - Get available times, bookings on a date and conflicts for a
 *  period.
 * - Cancel bookings.
 */
export class BookingService {
  #registry

  constructor(bookingRegistry) {
    this.#registry = bookingRegistry
  }

  /**
   * @param {string} id - Employee ID
   * @param {string} name - Employee name
   * @returns {Resource} - Resource object containing id and name.
   */
  createResource(id, name) {
    return new Resource(id, name)
  }

  /**
   * Get available times for appointments on given date with given employee.
   *
   * @param {Resource} resource - Employee to book for.
   * @param {{workdayStart: string, workdayEnd: string}} workingHours - 'HH:MM' format.
   * @param {string} date - 'YYYY-MM-DD' format
   * @param {number} duration - Length of an appointment in minutes.
   * @returns {{startTime: string, endTime: string}[]} start and end times in 'HH:MM' format
   * of the available time slots.
   */
  getAvailableTimeSlots(resource, workingHours, date, duration) {
    const calendar = this.#buildCalendar(resource, date, date)
    const workday = this.#createWorkdayTimeSlot(date, workingHours)

    // available time slots as in an array of TimeSlot objects
    const availableSlots = calendar.getAvailableTimeSlots(resource, workday, duration)

    // Convert all time slots into time ranges and return an array of them
    return availableSlots.map((timeSlot) => this.#toTimeRange(timeSlot))
  }
  /**
   *
   * @param {Resource} resource - The employees resource.
   * @param {string} date - 'YYYY-MM-DD' format.
   * @returns {object[]} - The bookings in an array of plain objects
   */
  getBookingsOnDate(resource, date) {
    const bookings = this.#registry.getBookingsForEmployeeBetween(resource.getId(), date, date)

    // TODO: sort bookings
    return bookings
  }

  /**
   * @returns 
   * id, 
   * employeeId, 
   * type, 
   * customerName, 
   * date, 
   * startTime, 
   * endTime
   */
  getBookingSummary(resource, bookingId) {
    const record = this.#getEmployeesRecord(resource, bookingId)
    const summary = this.#toBookingSummary(record)

    return summary
  }

  /**
   * Public method for creating and saving a new booking.
   *
   * @param {Resource} resource - Employee resouce.
   *
   * @param {Object} appointment
   * @param {string} appointment.customerName - Customer's name, blank when vacation.
   * @param {string} appointment.date - 'YYYY-MM-DD' format.
   * @param {string} appointment.start - 'HH:MM' format.
   * @param {string} appointment.duration - Duration in minutes as a string.
   * @returns {string} - The ID of the new booking.
   */
  bookAppointment(resource, appointment) {
    const startTime = this.#toDateTime(appointment.date, appointment.start)
    const endTime = this.#addMinutes(startTime, appointment.duration)

    const record = {
      id: this.#createBookingId(),
      employeeId: resource.getId(),
      type: 'appointment',
      customerName: appointment.customerName,
      start: this.#toDateTimeString(startTime),
      end: this.#toDateTimeString(endTime),
    }

    const calendar = this.#buildCalendar(resource, appointment.date, appointment.date)

    // Add booking to the new calendar and save to registry

    this.#validateNoConflict(calendar, record, resource)
    return this.#registry.saveBooking(record)
  }

  editAppointment(resource, id, updatedAppointment) {
    // 1. Get previous records of appointment
    // 2. Update name
    // 3. Calculate new start and end
    const record = {
      ...this.#getEmployeesRecord(resource, id),
      customerName: updatedAppointment.customerName,
      ...this.#calculateStartAndEnd(updatedAppointment)
    }

    const calendar = this.#buildCalendar(resource, updatedAppointment.date, updatedAppointment.date)
    this.#removeFromCalendar(calendar, id)

    // Update booking in registry
    this.#validateNoConflict(calendar, record, resource)
    return this.#registry.editBooking(record)
  }

  cancel(bookingId) {
    this.#registry.deleteBooking(bookingId)
  }

  #removeFromCalendar(calendar, id) {
    if (calendar.getBookingById(id)) {
      calendar.cancelBooking(id)
    }
  }

  #buildCalendar(resource, startDate, endDate) {
    // Get all saved bookings of employee and save in array:
    const bookingRecords = this.#registry.getBookingsForEmployeeBetween(resource.getId(), startDate, endDate)

    // Create new BookingCalendar
    const calendar = new BookingCalendar()

    // For every bookingInfo in bookingRecords
    for (const bookingInfo of bookingRecords) {
      // 1. Create new Booking object
      const bookingObject = this.#toBooking(bookingInfo, resource)

      // 2. Add Booking to BookingCalendar -> calendar.addBooking(bookingObject)
      calendar.addBooking(bookingObject)
    }

    // Return calendar with all bookings for given employee
    return calendar
  }

  /**
   * @param {string} date - The date to create a TimeSlot in.
   * @param {{workdayStart: string, workdayEnd: string}} workingHours - 'HH:MM' format.
   * @returns {TimeSlot}
   */
  #createWorkdayTimeSlot(date, workingHours) {
    return new TimeSlot(
      this.#toDateTime(date, workingHours.workdayStart),
      this.#toDateTime(date, workingHours.workdayEnd)
    )
  }

  #calculateStartAndEnd(appointment) {
    const startTime = this.#toDateTime(appointment.date, appointment.startTime)
    const endTime = this.#addMinutes(startTime, appointment.durationInMinutes)

    return {
      start: this.#toDateTimeString(startTime),
      end: this.#toDateTimeString(endTime),
    }
  }

  /**
   * Creates a TimeSlot from start and end date in bookingInfo.
   * Returns a Booking object.
   *
   * @param {object} bookingInfo
   * @param {Resource} resource
   * @returns {Booking} A Booking object
   */
  #toBooking(bookingInfo, resource) {
    const timeSlot = new TimeSlot(new Date(bookingInfo.start), new Date(bookingInfo.end))
    return new Booking(bookingInfo.id, resource, timeSlot)
  }

  #getEmployeesRecord(resource, bookingId) {
    const record = this.#registry.getBooking(bookingId)
    this.#validateEmployeesRecord(record, resource)

    return record
  }

  #validateEmployeesRecord(record, resource) {
    if (record.employeeId !== resource.getId()) {
      throw new Error('Booking does not match employee ID')
    }
  }

  #validateNoConflict(calendar, record, resource) {
    if (calendar.hasBookingConflict(this.#toBooking(record, resource))) {
      throw new Error('Booking time is not available')
    }
  }

  /**
   * @returns An object of:
   * id
   * employeeId
   * type
   * customerName
   * date
   * start
   * end
   */
  #toBookingSummary(record) {
    const duration = this.#minutesBetween(record.start, record.end) 
    const [date, start] = record.start.split('T')
    const end = record.end.split('T').pop()
    

    return {
      id: record.id,
      employeeId: record.employeeId,
      type: record.type,
      customerName: record.customerName,
      date,
      start,
      end,
      duration
    }
  }

  #minutesBetween(start, end) {
    const millisecondsBetween = new Date(end) - new Date(start)
    return millisecondsBetween / 60000
  }

  // Converts one TimeSlot object containing start and end date as strings
  #toTimeRange(timeSlot) {
    return {
      startTime: this.#toTimeString(timeSlot.getStartTime()),
      endTime: this.#toTimeString(timeSlot.getEndTime()),
    }
  }

  /**
   * Converts date and time strings into one Date object that contains
   * both date and time.
   *
   * @param {string} date - 'YYYY-MM-DD' format
   * @param {string} time - 'HH:MM' format.
   * @returns {Date} Date object containing both date and time.
   */
  #toDateTime(date, time) {
    return new Date(`${date}T${time}`)
  }

  /**
   *
   * @param {Date} dateTime
   * @returns {string} date time string in 'YYYY-MM-DDTHH:MM' format
   */
  #toDateTimeString(dateTime) {
    return `${dateTime.toLocaleDateString('sv-SE')}T${this.#toTimeString(dateTime)}`
  }

  /**
   * @param {Date} date - Date object with both date and time.
   * @param {number} minutes - Minutes to add.
   * @returns {Date} The date and time with given minutes added.
   */
  #addMinutes(date, minutes) {
    return new Date(date.getTime() + Number(minutes) * 60000)
  }

  // Converts from Dates to strings
  #toTimeString(dateTime) {
    return dateTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
  }

  #createBookingId() {
    return crypto.randomUUID()
  }
}
