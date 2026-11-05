import { MultiYearCalendar } from 'Holiday-Calendar'

export class HolidayService {
  #calendar

  constructor() {
    this.#calendar = new MultiYearCalendar()
  }

  isHoliday(date) {
    return this.#calendar.isHoliday(date)
  }

  isWorkdays(date) {
    return this.#calendar.isWorkday(date)
  }

  nextHolidayFrom(date) {
    return this.#calendar.nextHolidayFrom(date)
  }

  workdaysInPeriod(startDate, endDate) {
    return this.#calendar.workdaysInPeriod(startDate, endDate)
  }

  workdaysAfterUntil(startDate, endDate) {
    return this.#calendar.workdaysAfterUntil(startDate, endDate)
  }

  addWorkdays(date, workdays) {
    return this.#calendar.addWorkdays(date, workdays)
  }
}
