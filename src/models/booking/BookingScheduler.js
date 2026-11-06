import { HolidayService } from '../../services/HolidayService.js'
import { BookingService } from '../../services/BookingService.js'
import { EmployeeRegistry } from '../employee/EmployeeRegistry.js'

export class BookingScheduler {
  #employees = new Map()
  #bookingService = new BookingService()
  #holidayService = new HolidayService()

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

  convertToString(date) {
    return date.toISOString().split('T')[0]
  }

  #isWorkday(dateString) {
    return this.#holidayService.isWorkday(dateString)
  }
}
