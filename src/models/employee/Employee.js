/**
 * An employee's information.
 *
 * - Holds the Resource, which carries the id and the name.
 * - Holds the working hours and the vacation days per year.
 */
export class Employee {
  #resource
  #workdayStart
  #workdayEnd
  #vacationDaysPerYear

  /**
   * @param {Resource} resource (contains id and name)
   * @param {string} workdayStart 
   * @param {string} workdayEnd 
   * @param {number} vacationDaysPerYear 
   */
  constructor(resource, workdayStart, workdayEnd, vacationDaysPerYear) {
    this.#resource = resource
    this.#workdayStart = workdayStart
    this.#workdayEnd = workdayEnd
    this.#vacationDaysPerYear = vacationDaysPerYear
  }

  getName() {
    return this.#resource.getName()
  }

  // TODO: Use case?
  getId() {
    return this.#resource.getId()
  }

  getResource() {
    return this.#resource
  }

  getVacationDaysPerYear() {
    return this.#vacationDaysPerYear
  }

  /**
   * @returns {{workdayStart: string, workdayEnd: string}} strings in 'HH:MM' format.
   */
  getWorkingHours() {
    return { 
      workdayStart: this.#workdayStart,
      workdayEnd: this.#workdayEnd
    }
  }

  editWorkinghours(newStartTime, newEndTime) {
    this.#workdayStart = newStartTime
    this.#workdayEnd = newEndTime
  }

  editVacationDaysPerYear(newDayCount) {
    this.#vacationDaysPerYear = newDayCount
  }
}
