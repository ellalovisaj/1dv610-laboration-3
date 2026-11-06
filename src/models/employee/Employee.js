export class Employee {
  #resource
  #workdayStart
  #workdayEnd
  #vacationDaysPerYear

  /**
   * @param {Resource} resource (contains id and name)
   * @param {number} workdayStart 
   * @param {number} workdayEnd 
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

  getVacationDaysPerYear() {
    return this.#vacationDaysPerYear
  }

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
