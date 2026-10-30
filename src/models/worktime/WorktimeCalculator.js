const HOURS_PER_FULL_TIME_DAY = 8

export class WorktimeCalculator {
  #holidayService
  

  constructor(holidayService) {
    this.#holidayService = holidayService
  }

  calculateSelectedRangeWorktime(input) {
    return this.#calculateWorktime(input)
  }

  calculateMonthWorktime(input) {
    return this.#calculateWorktime({ ...input, ...this.#getMonthDates(input.month) })
  }

  #calculateWorktime(input) {
    console.log(input)
    const workdays = this.#holidayService.workdaysBetween(input.startDate, input.endDate)
    const hours = this.#compileWorktimeHours(workdays, input.percentage)
    const salary = this.#calculateSalaryIfGiven(hours, input.hourlyWage)

    return { workdays, hours, salary }
  }

  #compileWorktimeHours(workdays, percentage) {
    const fullTimeFraction = this.#toFullTimeFraction(percentage)
    const hoursPerDay = this.#calculateHoursPerDay(fullTimeFraction)
    return this.#calculateWorktimeHours(workdays, hoursPerDay)
  }

  #getMonthDates(month) {
    return {
      startDate: this.#getFirstDayOfMonth(month),
      endDate: this.#getLastDayOfMonth(month),
    }
  }

  #getFirstDayOfMonth(month) {
    console.log(new Date(month).toISOString().split('T')[0])
    return new Date(month).toISOString().split('T')[0]
  }

  #getLastDayOfMonth(month) {
    const monthIndex = new Date(month).getUTCMonth()
    const year = new Date(month).getUTCFullYear()

    console.log(new Date(Date.UTC(year, monthIndex + 1, 0)).toISOString().split('T')[0])
    return new Date(Date.UTC(year, monthIndex + 1, 0)).toISOString().split('T')[0]
  }

  #toFullTimeFraction(percentage) {
    return Number(percentage) / 100
  }

  #calculateHoursPerDay(fullTimeFraction) {
    return HOURS_PER_FULL_TIME_DAY * fullTimeFraction
  }

  #calculateWorktimeHours(workdays, hoursPerDay) {
    return workdays * hoursPerDay
  }

  #calculateSalaryIfGiven(hours, hourlyWage) {
    return hourlyWage ? hours * hourlyWage : undefined
  }
}
