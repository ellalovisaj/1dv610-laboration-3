export class VacationCalculator {
  #holidayService

  constructor(holidayService) {
    this.#holidayService = holidayService
  }

  calculateVacationPeriod(input) {
    const firstDay = this.#getFirstDay(input.startDate)
    const vacationDays = Number(input.vacationDayCount)
    const lastDay = this.#getLastDay(firstDay, vacationDays)
    const backAtWork = this.#getBackAtWorkDate(lastDay)

    const vacationPeriod = {
      firstDay,
      lastDay,
      backAtWork,
    }

    return vacationPeriod
  }

  #getFirstDay(startDate) {
    if (this.#holidayService.isWorkday(startDate)) {
      return startDate
    }
    return this.#holidayService.addWorkdays(startDate, 1)
  }

  #getLastDay(firstDay, dayCount) {
    // addWorkdays will currently not count the startDate
    // If dayCount is 1, the first day is also the last
    if (dayCount === 1) {
      return firstDay
    }

    // calculate from daycount - 1 to not count the last day
    return this.#holidayService.addWorkdays(firstDay, dayCount - 1)
  }

  #getBackAtWorkDate(lastDay) {
    return this.#holidayService.addWorkdays(lastDay, 1)
  }

  calculateVacationDays(input) {
    // find number of workdays between the dates
  }
}
