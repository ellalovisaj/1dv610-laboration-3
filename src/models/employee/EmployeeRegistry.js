import { Employee } from './Employee.js'

export class EmployeeRegistry {
  #employees = new Map()
  #bookingService

  constructor(bookingService) {
    this.#bookingService = bookingService
  }

  createEmployee(name, workdayStart, workdayEnd, vacationDaysPerYear) {
    const id = this.#createEmployeeId()
    const resource = this.#createResource(id, name)

    const employee = new Employee((resource, workdayStart, workdayEnd, vacationDaysPerYear))

    this.#addEmployeeToRegistry(id, employee)
  }

  getName(id) {
    return this.#getEmployee(id).getName()
  }

  getVacationDaysPerYear(id) {
    return this.#getEmployee(id).vacationDaysPerYear()
  }

  getWorkingHours(id) {
    return this.#getEmployee(id).getWorkingHours()
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

  deleteEmployee(id) {
    this.#getEmployee(id)
    this.#employees.delete(id)
  }

  #validateEmployeeId(id) {
    if (!this.#isEmployeeId(id)) throw new Error('Employee ID is not in registry')
  }

  #isEmployeeId(id) {
    return this.#employees.has(id)
  }
}
