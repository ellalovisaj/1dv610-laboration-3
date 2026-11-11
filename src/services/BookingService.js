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

  /**
   * Get available times for appointments on given date with given employee.
   *
   * @param {Resource} resource - Employee to book for.
   * @param {{workdayStart: string, workdayEnd: string}} workingHours - 'HH:MM' format.
   * @param {string} date - 'YYYY-MM-DD' format
   * @param {number} duration - Desired appointment duration in minutes.
   * @returns {{startTime: string, endTime: string}[]} start and end times in 'HH:MM' format
   * of the available time slots.
   */
  getAvailableTimeSlots(resource, workingHours, date, duration) {
    const calendar = this.#buildCalendar(resource, date, date)
    // Create time slot
    const workday = this.#createWorkdayTimeSlot(date, workingHours)

    // get available time slots
    const availableSlots = calendar.getAvailableTimeSlots(resource, workday, duration)

    // return as array of time ranges
    return this.#toTimeRanges(availableSlots)
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

  #getBookingDates(date, startTime, duration) {
    const start = this.#toDateTime(date, startTime)
    const end = this.#addMinutes(start, Number(duration))
    return { start, end }
  }

  /**
   * @param {Date} date - Date object with both date and time.
   * @param {number} minutes - Minutes to add.
   * @returns {Date} The date and time with given minutes added.
   */
  #addMinutes(date, minutes) {
    return new Date(date.getTime() + Number(minutes) * 60000)
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

  // Converts one TimeSlot object containing start and end date as strings
  #toTimeRange(timeSlot) {
    return {
      startTime: this.#toTimeString(timeSlot.getStartTime()),
      endTime: this.#toTimeString(timeSlot.getEndTime()),
    }
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

    // Create Booking object
    const booking = this.#toBooking(record, resource)

    // Add booking to the new calendar and save to registry

    return this.#saveIfNoConflict(booking, record, resource, appointment.date)
  }

  editBooking(resource, id, bookingInfo) {
    const oldBooking = this.#registry.getBooking(id)
    const employeeId = resource.getId()

    if (oldBooking.employeeId !== employeeId) {
      throw new Error("Booking doesn't match the Employee.")
    }

    const record = {
      id,
      ...bookingInfo,
    }

    const booking = this.#toBooking(record, resource)

    const calendar = this.#buildCalendar(resource, record.date, record.date)

    calendar.cancelBooking(oldBooking.id)

    // Update booking in registry
    return this.#saveIfNoConflict(booking, record, resource, record.date)
  }

  #saveIfNoConflict(booking, record, resource, date) {
    const calendar = this.#buildCalendar(resource, date, date)
    if (this.#hasBookingConflict(calendar, booking)) {
      throw new Error('The time is already booked.')
    }
    return this.#saveBooking(calendar, booking, record)
  }

  #saveBooking(calendar, booking, record) {
    calendar.addBooking(booking)
    return this.#registry.saveBooking(record)
  }

  // Converts an array of TimeSlots from Array of date strings
  #toTimeRanges(TimeSlots) {
    const timeRanges = []

    for (const timeSlot of TimeSlots) {
      timeRanges.push(this.#toTimeRange(timeSlot))
    }
    return timeRanges
  }

  // Get date from dateTime string
  #removeTimeFrom(dateTime) {
    return dateTime.split('T')[0]
  }

  // Converts from Dates to strings
  #toTimeString(dateTime) {
    return dateTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
  }

  #hasBookingConflict(calendar, booking) {
    return calendar.hasBookingConflict(booking)
  }

  getBooking(id) {
    return this.#registry.getBooking(id)
  }

  getBookingsOnDate(resource, date) {
    const calendar = this.#buildCalendar(resource, date, date)
    return calendar.getBookingsForDate(date)
  }

  cancel(bookingId) {
    this.#registry.deleteBooking(bookingId)
  }

  #createBookingId() {
    return crypto.randomUUID()
  }
}
