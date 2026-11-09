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
  #bookingRegistry

  constructor(bookingRegistry) {
    this.#bookingRegistry = bookingRegistry
  }
  
  /**
   * @param {string} id - Employee ID
   * @param {string} name - Employee name
   * @returns {Resource} - Resource object containing id and name.
   */
  createResource(id, name) {
    return new Resource(id, name)
  }

  #createBooking(id, resource, timeSlot) {
    return new Booking(id, resource, timeSlot)
  }

  #addBooking(booking, bookingInfo) {
    const calendar = this.#buildCalendar()
    calendar.addBooking(booking)
    this.#bookingRegistry.saveBooking(bookingInfo)
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
    const calendar = this.#buildCalendar(resource)
    // Create time slot
    const workday = this.#createWorkdayTimeSlot(date, workingHours)

    // get available time slots
    const availableSlots = calendar.getAvailableTimeSlots(resource, workday, duration)

    // return as array of time ranges
    return this.#toTimeRanges(availableSlots)
  }

  // TODO: FIX METHOD ACCORDING TO COMMENTS
  #buildCalendar(employeeResource) {
    // Get all saved bookings of employee and save in array:
    const bookingData = []

    // Create BookingCalendar
    const calendar = new BookingCalendar()

    // For every booking in bookingData
    for (const booking of bookingData) {
      // 1. Create new Booking object (will need employee resource?)
      // 2. Add Booking to BookingCalendar -> calendar.addBooking(bookingObject)
    }

    // return calendar
  }

  #createWorkdayTimeSlot(date, workingHours) {
    return new TimeSlot(
      this.#toDateTime(date, workingHours.workdayStart),
      this.#toDateTime(date, workingHours.workdayEnd)
    )
  }

  /**
   * Public method for creating and saving a new booking.
   *
   * @param {Resource} - Employee resouce.
   *
   * @param {Object} bookingInfo
   * @param {string} bookingInfo.id - Booking ID
   * @param {string} bookingInfo.employeeId - Employee ID
   * @param {string} bookingInfo.type - Booking type, 'apointment' or 'vacation'.
   * @param {string} bookingInfo.customerName - Customer's name, blank when vacation.
   * @param {string} bookingInfo.start - Start time in 'YYYY-MM-DDTHH:MM' format.
   * @param {string} bookingInfo.end - End time in 'YYYY-MM-DDTHH:MM' format.
   * @param {number} bookingInfo.duration - Duration of booking in minutes
   *
   * @returns {string} - The ID of the new booking.
   */
  newBooking(resource, bookingInfo) {
    bookingInfo.id = this.#createBookingId()

    const timeSlot = new TimeSlot(new Date(bookingInfo.start), new Date(bookingInfo.end))
    
    const booking = this.#createBooking(bookingInfo.id, resource, timeSlot)
    this.#addBooking(booking, bookingInfo)
    return booking.getId()
  }

  /**
   * @param {string} date - Start time in 'YYYY-MM-DD' format.
   * @param {{startTime: string, endTime: string}} timeRange - start and
   * end times in 'HH:MM' format of the available time slots.
   * @returns {TimeSlot} Vacation TimeSlot
   */
  #createBookingTimeSlot(date, timeRange) {
    return new TimeSlot(this.#toDateTime(date, timeRange.startTime), this.#toDateTime(date, timeRange.endTime))
  }

  /**
   * @param {string} start - Start time in 'YYYY-MM-DDTHH:MM' format.
   * @param {string} end - End time in 'YYYY-MM-DDTHH:MM' format.
   * @returns {TimeSlot} Vacation TimeSlot
   */
  #createVacationTimeSlot(start, end) {
    // Convert to date strings without time
    const startDateString = start.split('T')[0]
    const endDateString = end.split('T')[0]

    // Convert to Date objects without time (midnight to midnight)
    const startDate = new Date(startDateString)
    const endDate = new Date(endDateString)

    // Return Vacation TimeSlot
    return new TimeSlot(startDate, endDate)
  }

  #getTimeRange(startTime, endTime) {
    return {
      startTime,
      endTime,
    }
  }

  #toDate(dateTime) {
    return new Date(dateTime)
  }

  #toDateTime(date, time) {
    return new Date(`${date}T${time}`)
  }

  // Converts from Dates to strings
  #toTimeRanges(TimeSlots) {
    const timeRanges = []

    for (const timeSlot of TimeSlots) {
      timeRanges.push(this.#toTimeRange(timeSlot))
    }
    return timeRanges
  }

  // Converts from Dates to strings
  #toTimeRange(timeSlot) {
    return {
      startTime: this.#toTimeString(timeSlot.startTime),
      endTime: this.#toTimeString(timeSlot.endTime),
    }
  }

  // Converts from Dates to strings
  #toTimeString(dateTime) {
    return dateTime.toLocaleTimeString('sv-SE')
  }

  getBookingById(bookingId) {
    const calendar = this.#buildCalendar()
    return calendar.getBookingById(bookingId)
  }

  getAllBookingsForResource(resource) {
    const calendar = this.#buildCalendar()
    return calendar.getBookingsForResource(resource)
  }

  getAllBookingsOnDate(date) {
    const calendar = this.#buildCalendar()
    return calendar.getBookingsForDate(date)
  }

  getBookingsForResourceOnDate(resource, date) {
    const calendar = this.#buildCalendar()
    const allBookingsOnDate = this.getAllBookingsOnDate(date)

    // TODO: find a way to get bookings of resource and date
    // booking-module offers methods for finding bookings by Resources and
    // by Date but not both at the same time.
  }

  hasBookingConflict(resource, timeSlot) {
    // TODO: issue when adding booking to "wrong" cal?
    const booking = this.#createBooking(resource, timeSlot)
    const calendar = this.#buildCalendar()
    return calendar.hasBookingConflict(booking)
  }

  #createBookingId() {
    return crypto.randomUUID()
  }
}
