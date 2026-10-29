/**
 *
 */
export class WorktimeCalculator {
  #holidayService

  constructor(holidayService) {
    this.#holidayService = holidayService
  }

  // Selected Range
  calculateSelectedRange(input) {
    // get workdays
    const workdays = this.#holidayService.workdaysBetween(input.startDate, input.endDate)

    // get work hours
    const fullTimeFraction = this.#toFullTimeFraction(input.percentage)
    const hoursPerDay = this.#calculateHoursPerDay(fullTimeFraction)
    const hours = this.#calculateWorktime(workdays, hoursPerDay)

    // get salary
    if (this.#salaryInfoExists(input)) {
      const salary = this.#calculateSalary(hours, input.salaryPerHour)
      return this.#compileWorktimeResult(workdays, hours, salary)
    }
    

    return this.#compileWorktimeResult(workdays, hours)
  }

  // convert percentage string to fraction of full time
  #toFullTimeFraction(percentage) {
    return Number(percentage) / 100
  }

  // calculate work hours per day
  #calculateHoursPerDay(fullTimeFraction) {
    return 8 * fullTimeFraction
  }

  // work hours for full period
  #calculateWorktime(workdays, hoursPerDay) {
    return workdays * hoursPerDay
  }

  #salaryInfoExists(input) {
    return input.salaryPerHour ? true : false
  }

  #calculateSalary(hours, salaryPerHour) {
    return hours * Number(salaryPerHour)
  }

  #compileWorktimeResult(workdays, hours, salary) {
    return {
      workdays,
      hours,
      salary
    } 
  }
}
