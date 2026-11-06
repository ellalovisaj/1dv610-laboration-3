import { Employee } from './Employee.js'

/**
 * Stores enployees. Will be connected to database if/when it is created.
 * 
 * - Registers new employees: creates the id and the Employee, and stores it.
 * - Gets one employee or all employees.
 * - Clears all employees (needed for demo data)
 */
export class EmployeeRegistry {
  #employees = new Map()
  #bookingService

  constructor(bookingService) {
    this.#bookingService = bookingService
  }

  // GETTERS ########################

  getName(id) {
    return this.#getEmployee(id).getName()
  }

  getResource(id) {
    return this.#getEmployee(id).getResource()
  }

  getVacationDaysPerYear(id) {
    return this.#getEmployee(id).vacationDaysPerYear()
  }

  /**
   * @param {string} id 
   * @returns {{workdayStart: string, workdayEnd: string}} strings in 'HH:MM' format.
   */
  getWorkingHours(id) {
    return this.#getEmployee(id).getWorkingHours()
  }

  getEmployeesBookingsOnDate(id, date) {
    const employee = this.#getEmployee(id)
    return this.#bookingService.getBookingsForResourceOnDate(employee.getResource(), date)
  }

  // EDITORS AND REMOVERS ########################
  createEmployee(name, workdayStart, workdayEnd, vacationDaysPerYear) {
    const id = this.#createEmployeeId()
    const resource = this.#createResource(id, name)

    const employee = new Employee((resource, workdayStart, workdayEnd, vacationDaysPerYear))

    this.#addEmployeeToRegistry(id, employee)
  }

  editWorkinghours(id, newStartTime, newEndTime) {
    const employee = this.#getEmployee(id)

    if (newStartTime >= newEndTime) {
      throw new Error('Start time must be earlier than end time.')
    }

    employee.editWorkinghours(newStartTime, newEndTime)
  }

  editVacationDaysPerYear(id, newDayCount) {
    // TODO: day count validation in vacayPlanner to avoid changing to less than already used
    this.#getEmployee(id).editVacationDaysPerYear(newDayCount)
  }

  deleteEmployee(id) {
    this.#getEmployee(id)
    this.#employees.delete(id)
  }

  // PRIVATE METHODS ########################

  #getEmployee(id) {
    this.#validateEmployeeId(id)
    this.#employees.get(id)
  }

  #createEmployeeId() {
    return crypto.randomUUID()
  }

  #createResource(id, name) {
    return this.#bookingService.createResource(id, name)
  }

  #addEmployeeToRegistry(id, employee) {
    this.#employees.set(id, employee)
  }

  #validateEmployeeId(id) {
    if (!this.#isEmployeeId(id)) throw new Error('Employee ID is not in registry')
  }

  #isEmployeeId(id) {
    return this.#employees.has(id)
  }
}
