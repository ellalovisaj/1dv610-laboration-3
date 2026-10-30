import { HolidayCalendar } from "Holiday-Calendar"

export class HolidayService {
  isHoliday(date) {
    return this.#createCalendar(this.#getYear(date)).isHoliday(date)
  }

  workdaysBetween(startDate, endDate) {
    return this.#createCalendar(this.#getYear(startDate)).workdaysBetween(startDate, endDate)
  }

  #getYear(date) {
    return Number(date.slice(0, 4))
  }

  #createCalendar(year) {
    return new HolidayCalendar(year)
  }  
}
