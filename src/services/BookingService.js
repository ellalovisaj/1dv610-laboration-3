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
    const bookingRecords = this.#bookingRegistry.getBookingsForEmployeeBetween(resource.getId(), startDate, endDate)

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

  /**
   * Public method for creating and saving a new booking.
   *
   * @param {Resource} - Employee resouce.
   *
   * @param {Object} bookingInfo
   * @param {string} bookingInfo.type - Booking type, 'apointment' or 'vacation'.
   * @param {string} bookingInfo.customerName - Customer's name, blank when vacation.
   * @param {string} bookingInfo.start - Start time in 'YYYY-MM-DDTHH:MM' format.
   * @param {string} bookingInfo.end - End time in 'YYYY-MM-DDTHH:MM' format.
   * @returns {string} - The ID of the new booking.
   */
  newBooking(resource, bookingInfo) {

    const id = this.#createBookingId()
    const record = {
      id,
      employeeId: resource.getId(),
      ...bookingInfo
    }

  
    // Create Booking object
    const booking = this.#toBooking(bookingInfo, resource)
    
    // Get start and end date for the calendar
    const dateStart = this.#removeTimeFrom(bookingInfo.start)
    const dateEnd = this.#removeTimeFrom(bookingInfo.end)

    // Build calendar for employee between start and end dates
    const calendar = this.#buildCalendar(resource, dateStart, dateEnd)
    
    this.#hasBookingConflict(calendar, booking)    

    // Add booking to the new calendar and save to registry
    this.#saveBooking(calendar, booking, bookingInfo)

    return booking.getId()
  }

  #saveBooking(calendar, booking, bookingInfo) {
    calendar.addBooking(booking)
    this.#bookingRegistry.saveBooking(bookingInfo)
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

  // Converts an array of TimeSlots from Array of date strings
  #toTimeRanges(TimeSlots) {
    const timeRanges = []

    for (const timeSlot of TimeSlots) {
      timeRanges.push(this.#toTimeRange(timeSlot))
    }
    return timeRanges
  }

  // Converts one TimeSlot object containing start and end date as strings
  #toTimeRange(timeSlot) {
    return {
      startTime: this.#toTimeString(timeSlot.getStartTime()),
      endTime: this.#toTimeString(timeSlot.getEndTime()),
    }
  }

  // Get date from dateTime string
  #removeTimeFrom(dateTime) {
    return dateTime.split('T')[0]
  }

  // Converts from Dates to strings
  #toTimeString(dateTime) {
    return dateTime.toLocaleTimeString('sv-SE', { hour: "2-digit", minute: "2-digit" })
  }

  #hasBookingConflict(calendar, booking) {
    return calendar.hasBookingConflict(booking)
  }

  getBookingsOnDate(resource, date) {
    const calendar = this.#buildCalendar(resource, date, date)
    return calendar.getBookingsForDate(date)
  }
  
  cancel(bookingId) {
    this.#bookingRegistry.deleteBooking(bookingId)
  }

  #createBookingId() {
    return crypto.randomUUID()
  }
}
