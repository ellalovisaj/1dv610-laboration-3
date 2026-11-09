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

  /**
   * @param {string} name - Employee's name.
   * @param {string} workdayStart - 'HH:MM' format.
   * @param {string} workdayEnd - 'HH:MM' format.
   * @param {number} vacationDaysPerYear - Number of vacation days.
   */
  addEmployee(name, workdayStart, workdayEnd, vacationDaysPerYear) {
    this.#employees.createEmployee(name, workdayStart, workdayEnd, vacationDaysPerYear)
  }

  /**
   * New bookings:
   * X Gets the employee's id and working hours.
   * - Gets form input data from user and passes it to BookingService.
   * - Compiles data and passes it to BookingService that actually books.
   */

  #getEmployeesWorkingHours(id) {
    return this.#employees.getWorkingHours(id)
  }

  // Booking in database will contain:
  // (id, { id, employeeId, type, customerName, start, end })

  #compileBookingInfo(formInput) {
    return {
      id: '',
      employeeId: formInput.employeeId,
      type: formInput.bookingType,
      customerName: formInput.customerName,
      start: formInput.bookingStart,
      end: formInput.bookingEnd,
      duration: formInput.bookingDuration,
    }
  }

  #getEmployeeResource(id) {
    return this.#employees.getResource(id)
  }

  // TODO: Edit to resemble addBooking and then move to VacationPlanner
  addVacation(formInput) {
    // Convert start and end to dates
    const startDate = bookingInfo.start.split('T')[0]
    const endDate = bookingInfo.end.split('T')[0]
  }

  addBooking(formInput) {
    // Compile input into bookingInfo

    const bookingInfo = this.#compileBookingInfo(formInput)
    const employee = this.#employees.getById(bookingInfo.employeeId)

    const resource = employee.getResource()

    const timeRange = this.#getTimeRange(bookingInfo.start, bookingInfo.end)

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
    const workingHours = this.#getEmployeesWorkingHours(employeeId)
    const resource = this.#getEmployeeResource(employeeId)

    return this.#bookingService.getAvailableTimeSlots(resource, workingHours, date, duration)
  }

  convertToString(date) {
    return date.toISOString().split('T')[0]
  }

  #removeTimeFrom(dateTime) {
    return dateTime.split('T')[0]
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
