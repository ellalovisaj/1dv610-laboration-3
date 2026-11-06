import { Booking, BookingCalendar, TimeSlot, Resource } from 'booking-module'

export class BookingService {
  #bookingCalendar = new BookingCalendar()

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
   * @returns {Array<TimeSlot>} The available appointment times in given workday.
   */
  getAvailableTimeSlots(resource, workingHours, date, minutes) {
    // Create time slot
    const workday = this.#createWorkdayTimeSlot(date, workingHours)

    return this.#bookingCalendar.getAvailableTimeSlots(resource, workday, minutes)
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
    this.#bookingCalendar().addBooking(new Booking(id, resource, timeSlot))
  }

  getBookingById(bookingId) {
    return this.#bookingCalendar.getBookingById(bookingId)
  }

  getAllBookingsForResource(resource) {
    return this.#bookingCalendar.getBookingsForResource(resource)
  }

  getAllBookingsOnDate(date) {
    return this.#bookingCalendar.getBookingsForDate(date)
  }

  getBookingsForResourceOnDate(resource, date) {
    const allBookingsOnDate = this.getAllBookingsOnDate(date)

    // TODO: find a way to get bookings of resource and date
    // booking-module offers methods for finding bookings by Resources and
    // by Date but not both at the same time.
  }
}
