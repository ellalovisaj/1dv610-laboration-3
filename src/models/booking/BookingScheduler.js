/**
 * Applies the application's rules for appointments, then lets
 * BookingService do the booking.
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
   *
   * @param {number} id
   * @param {string} name
   * @returns {Resource} ID and name
   */
  addEmployee(id, name) {
    if (this.#employees.has(id)) {
      throw new Error('Employee ID is already in use')
    }

    const employee = this.#bookingService.createEmployee(id, name)
    this.#employees.set(employee.id, employee)

    return employee
  }

  addAppointmentFor(employee, appointmentStart, duration) {
    if (!this.#isWorkday(appointmentStart)) {
      // TODO: Handle with flash instead
      throw new Error('Is not a workday')
    }
  }

  /**
   * 
   * @param {string} employeeId - ID
   * @param {number} minutes - Desired duration of time slot
   * @param {string} date - 'YYYY-MM-DD' format
   */
  getAvailableTimeSlots(employeeId, minutes, date) {
    // resource, start, end, minutes
    const workingHours = this.#employees.getWorkingHours(employeeId)
    const resource = this.#employees.getResource(employeeId)

    this.#bookingService.getAvailableTimeSlots(resource, workingHours, date, minutes)
  }

  convertToString(date) {
    return date.toISOString().split('T')[0]
  }

  #isWorkday(dateString) {
    return this.#holidayService.isWorkday(dateString)
  }
}
