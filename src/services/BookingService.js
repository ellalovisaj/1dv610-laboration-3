import { Booking, BookingCalendar, TimeSlot, Resource } from 'booking-module'

export class BookingService {
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
   * @param {number} minutes - Desired appointment duration.
   * @returns {{startTime: string, endTime: string}[]} start and end times in 'HH:MM' format
   * of the available time slots.
   */
  getAvailableTimeSlots(resource, workingHours, date, minutes) {
    const calendar = this.#buildCalendar()
    // Create time slot
    const workday = this.#createWorkdayTimeSlot(date, workingHours)

    // get available time slots
    const availableSlots = calendar.getAvailableTimeSlots(resource, workday, minutes)

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

  #toDateTime(date, time) {
    return new Date(`${date}T${time}`)
  }

  #toTimeRanges(TimeSlots) {
    const timeRanges = []

    for (const timeSlot of TimeSlots) {
      timeRanges.push(this.#toTimeRange(timeSlot))
    }
    return timeRanges
  }

  #toTimeRange(timeSlot) {
    return {
      startTime: this.#toTimeString(timeSlot.startTime),
      endTime: this.#toTimeString(timeSlot.endTime),
    }
  }
  
  #toTimeString(dateTime) {
    return dateTime.toLocaleTimeString('sv-SE')
  }

  /**
   * Takes date objects!
   *
   * @param {Date} startTime
   * @param {Date} endTime
   * @returns {TimeSlot} TimeSlot object containing two Date objects.
   */
  #createTimeSlot(startTime, endTime) {
    return new TimeSlot(startTime, endTime)
  }

  addBooking(id, resource, timeSlot) {
    const calendar = this.#buildCalendar()
    calendar.addBooking(new Booking(id, resource, timeSlot))
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
}
