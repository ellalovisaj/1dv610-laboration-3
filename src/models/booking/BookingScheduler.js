/**
 * Applies the application's rules for appointments, then lets
 * BookingService do the booking.
 *
 * Responsibilities:
 *
 * Validate:
 * - Employee must be in EmployeeRegistry
 * - Date must be a workday
 * - Date cannot in the past
 * - Date cannot be further ahead than the booking limit
 * - The time must be within the employee's working hours
 *
 * New bookings:
 * - Gets the employee's id and working hours.
 * - Gets form input data from user and passes it to BookingService.
 * - Compiles data and passes it to BookingService that actually books.
 */
export class BookingScheduler {
  #holidayService
  #bookingService
  #employees

  constructor(holidayService, bookingService, employeeRegistry) {
    this.#holidayService = holidayService
    this.#bookingService = bookingService
    this.#employees = employeeRegistry
  }

  // Booking in database will contain:
  // (id, { id, employeeId, type, customerName, start, end })

  #compileBookingInfo(formInput) {
    return {
      employeeId: formInput.employeeId,
      type: 'appointment',
      customerName: formInput.customerName,
      date: formInput.date,
      start: formInput.bookingStart,
      end: formInput.bookingEnd,
    }
  }

  /**
   * Compiles formInput, validates input, call BookingService
   * to add new booking.
   */
  addBooking(formInput) {
    // Compile input into bookingInfo that contains:
    // employeeId
    // type
    // customerName
    // date
    // start
    // end

    const bookingInfo = this.#compileBookingInfo(formInput)

    // get resource
    const employee = this.#employees.getById(bookingInfo.employeeId)
    const resource = employee.getResource()

    // TODO: validate if date is:
    // - a workday (and if it's valid, in holiday-calendar)
    // - not earlier than today
    // - not later than limit set

    // TODO: validate if time is:
    // - within workingHours
    // - time is one of the available slots of the day
    // - tiden finns bland de lediga tiderna för dagen

    // Create and save booking in BookingService
    return this.#bookingService.newBooking(resource, bookingInfo)
  }

  editBooking(formInput) {
    const employee = this.#employees.getById(formInput.employeeId)

    // TODO: validate if date is:
    // - a workday (and if it's valid, in holiday-calendar)
    // - not earlier than today
    // - not later than limit set

    // TODO: validate if time is:
    // - within workingHours
    // - time is one of the available slots of the day
    // - tiden finns bland de lediga tiderna för dagen

    const bookingInfo = this.#compileBookingInfo(formInput)
    
    return this.#bookingService.editBooking(
      employee.getResource(),
      formInput.id,
      bookingInfo
    )
  }

  // TODO:
  hasBookingConflict() {}

  /**
   *
   * @param {string} employeeId - ID
   * @param {number} duration - Desired duration in minutes.
   * @param {string} date - 'YYYY-MM-DD' format
   *
   * @returns {{startTime: string, endTime: string}[]} start and end times
   * in 'HH:MM' format of the available time slots.
   */
  getAvailableTimeSlots(employeeId, duration, date) {
    const employee = this.#employees.getById(employeeId)

    const workingHours = employee.getWorkingHours()
    const resource = employee.getResource()

    return this.#bookingService.getAvailableTimeSlots(resource, workingHours, date, duration)
  }

  // TODO: Time zone issue?
  convertToString(date) {
    return date.toISOString().split('T')[0]
  }

  #validateDate(date) {
    if (!this.#isWorkday(date)) {
      throw new Error(`${date} is not a workday`)
    }
  }

  #isWorkday(dateString) {
    return this.#holidayService.isWorkday(dateString)
  }
}
