import { BookingService } from '../../services/BookingService.js'

export class Employee {
  #resource
  #workdayStart
  #workdayEnd
  #vacationDaysPerYear
  #vacationDaysLeft

  constructor() {}

  /**
   * @param {number} id - Employee ID.
   * @param {string} name - Employee name.
   * @returns {Resource} - Employee Resource containing ID and name.
   */
  addEmployee(id, name) {
    const employee = new Resource(id, name)
    return employee
  }
}
