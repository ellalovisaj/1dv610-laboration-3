import { Booking, BookingCalendar, TimeSlot } from 'booking-module'

export class BookingService {
  #bookingCalendar = new BookingCalendar()

  constructor() {}

  

  /**
   * Takes date objects!
   *
   * @param {Date} startTime
   * @param {Date} endTime
   */
  addTimeSlot(startTime, endTime) {
    return new TimeSlot(startTime, endTime)
  }

  addBooking(id, resource, timeSlot) {
    return new Booking(id, resource, timeSlot)
  }

  getBookingById(bookingId) {
    return this.#bookingCalendar.getBookingById(bookingId)
  }

  getAllBookingsForEmployee(employee) {
    return this.#bookingCalendar.getBookingsForResource(employee)
  }
  getAllBookingsOnDate(date) {
    return this.#bookingCalendar.getBookingsForDate(date)
  }

  getEmployeesBookingsOnDate(employee, date) {
    // TODO: find all bookings of X employee in X day
  }

  /**
   * Get available times for appointments on given date with given employee.
   *
   * @param {Resource} employee - Employee to book for.
   * @param {TimeSlot} workingHoursOfDate - Full workday (TimeSlot containing date
   * objects with both start and end time).
   * @param {number} minutes - Desired appointment duration.
   * @returns {Array<TimeSlot>} The available appointment times in given workday.
   */
  getAvailableTimeSlots(employee, workingHoursOfDate, minutes) {
    return this.#bookingCalendar.getAvailableTimeSlots(employee, workingHoursOfDate, minutes)
  }
}
