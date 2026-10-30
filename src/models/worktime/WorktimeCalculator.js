export class WorktimeCalculator {
  #holidayService

  constructor(holidayService) {
    this.#holidayService = holidayService
  }

  // Selected Range
  calculateSelectedRangeWorktime(input) {
    const workdays = this.#holidayService.workdaysBetween(input.startDate, input.endDate)
    const hours = this.#calculateWorktimeHours(workdays, input.percentage)

    if (this.#salaryInfoExists(input)) {
      const salary = this.#calculateSalary(hours, input.hourlyWage)
      return this.#compileWorktimeResult(workdays, hours, salary)
    }

    return this.#compileWorktimeResult(workdays, hours)
  }

  // Full month
  calculateMonthWorktime(input) {
    const monthDates = this.#getMonthDates(input.month)
    const workdays = this.#holidayService.workdaysBetween(monthDates.startDate, monthDates.endDate)
    const hours = this.#calculateWorktimeHours(workdays, input.percentage)

    if (this.#salaryInfoExists(input)) {
      const salary = this.#calculateSalary(hours, input.hourlyWage)
      return this.#compileWorktimeResult(workdays, hours, salary)
    }

    return this.#compileWorktimeResult(workdays, hours)
  }

  #calculateWorktimeHours(workdays, percentage) {
    const fullTimeFraction = this.#toFullTimeFraction(percentage)
    const hoursPerDay = this.#calculateHoursPerDay(fullTimeFraction)
    return this.#calculateWorktime(workdays, hoursPerDay)
  }

  #getMonthDates(month) {
    return {
      startDate: this.#getStartDate(month),
      endDate: this.#getEndDate(month),
    }
  }

  #getStartDate(month) {
    const startDate = new Date(month)
    console.log(startDate)
  }

  #getEndDate(month) {
    const monthIndex = new Date(month).getUTCMonth()
    const year = new Date(month).getUTCFullYear()

    return new Date(Date.UTC(year, monthIndex + 1, 0))
  }

  #toFullTimeFraction(percentage) {
    return Number(percentage) / 100
  }

  #calculateHoursPerDay(fullTimeFraction) {
    return 8 * fullTimeFraction
  }

  #calculateWorktime(workdays, hoursPerDay) {
    return workdays * hoursPerDay
  }

  #salaryInfoExists(input) {
    return input.hourlyWage ? true : false
  }

  #calculateSalary(hours, hourlyWage) {
    return hours * Number(hourlyWage)
  }

  #compileWorktimeResult(workdays, hours, salary) {
    return {
      workdays,
      hours,
      salary,
    }
  }
}
