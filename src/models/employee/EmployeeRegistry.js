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

  getAll() {
    return [...this.#employees.values()]
  }

  getName(id) {
    return this.#getEmployee(id).getName()
  }

  getResource(id) {
    return this.#getEmployee(id).getResource()
  }

  getVacationDaysPerYear(id) {
    return this.#getEmployee(id).getVacationDaysPerYear()
  }

  getById(id) {
    return this.#getEmployee(id)
  }

  /**
   * @param {string} id 
   * @returns {{workdayStart: string, workdayEnd: string}} strings in 'HH:MM' format.
   */
  getWorkingHours(id) {
    return this.#getEmployee(id).getWorkingHours()
  }

  // EDITORS AND REMOVERS ########################
  /**
   * @param {string} input.name 
   * @param {string} input.workdayStart - 'HH:MM' format.
   * @param {string} input.workdayEnd - 'HH:MM' format.
   * @param {number} input.vacationDaysPerYear - vacation days per year.
   */
  createEmployee(input) {
    this.#validateInput(input)

    const id = this.#createEmployeeId()
    const resource = this.#createResource(id, input.name)

    const employee = new Employee(resource, input.workdayStart, input.workdayEnd, input.vacationDaysPerYear)

    this.#addEmployeeToRegistry(id, employee)

    return employee
  }

  editWorkinghours(id, newStartTime, newEndTime) {
    const employee = this.#getEmployee(id)
    this.#validateWorkingHours(newStartTime, newEndTime)

    employee.editWorkinghours(newStartTime, newEndTime)
  }

  editVacationDaysPerYear(id, newDayCount) {
    // TODO: day count validation in vacayPlanner to avoid changing to less than already used
    
    this.#validateVacationDays(newDayCount)
    this.#getEmployee(id).editVacationDaysPerYear(newDayCount)
  }

  deleteEmployee(id) {
    this.#getEmployee(id)
    this.#employees.delete(id)
  }

  deleteAllEmployees() {
    this.#employees.clear()
  }

  // PRIVATE METHODS ########################

  #getEmployee(id) {
    this.#validateEmployeeId(id)
    return this.#employees.get(id)
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

  #isEmployeeId(id) {
    return this.#employees.has(id)
  }

  #validateInput(input) {
    this.#validateEmployeeName(input.name)
    this.#validateWorkingHours(input.start, input.end)
    this.#validateVacationDays(input.vacationDays)
  }

  #validateEmployeeName(name) {
    if (name.length < 3) {
      throw new Error('Employee name must be at least three characters')
    }
  }

  #validateWorkingHours(start, end) {
    if (start > end) {
      throw new Error('Start time must come before end time')
    }
  }

  #validateVacationDays(vacationDays) {
    if (vacationDays < 3) {
      throw new Error('Employee name must be at least three characters')
    }
  }

  #validateEmployeeId(id) {
    if (!this.#isEmployeeId(id)) throw new Error('Employee ID is not in registry')
  }
}