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

  getId() {
    return this.#resource.getId()
  }

  getWorkingHours() {
    return { 
      workdayStart: this.#workdayStart,
      workdayEnd: this.#workdayEnd
    }
  }

  getVacationDaysPerYear() {
    return this.#vacationDaysPerYear
  }

  changeWorkinghours(newStartTime, newEndTime) {
    this.#workdayStart = newStartTime
    this.#workdayEnd = newEndTime
  }

  // TODO: Move calculations outside of Employee
  // changeVacationDaysPerYear(newDayCount) {
  //   if (newDayCount < this.#vacationDaysSpentThisYear) {
  //     throw new Error(`User has already spent too many vacation days. The new count must be greater than ${ this.#vacationDaysSpentThisYear }. `)
  //   }
  //   this.#vacationDaysPerYear = newDayCount - vacationDaysSpentThisYear

  // }
}
