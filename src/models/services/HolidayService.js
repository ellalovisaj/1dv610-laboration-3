import { MultiYearCalendar } from 'Holiday-Calendar'

export class HolidayService {
  #calendar

  constructor() {
    this.#calendar = new MultiYearCalendar()
  }

  /**
   * @param {string} date - String 'YYYY-MM-DD'
   */
  isHoliday(date) {
    return this.#calendar.isHoliday(date)
  }

  /**
   * @param {string} date - String 'YYYY-MM-DD'
   */
  isWorkday(date) {
    return this.#calendar.isWorkday(date)
  }

  /**
   * @param {string} date - String 'YYYY-MM-DD'
   */
  nextHolidayFrom(date) {
    return this.#calendar.nextHolidayFrom(date)
  }

  /**
   * @param {string} startDate - String 'YYYY-MM-DD'
   * @param {string} endDate - String 'YYYY-MM-DD'
   */
  workdaysInPeriod(startDate, endDate) {
    return this.#calendar.workdaysInPeriod(startDate, endDate)
  }

  /**
   * @param {string} startDate - String 'YYYY-MM-DD'
   * @param {string} endDate - String 'YYYY-MM-DD'
   */
  workdaysAfterUntil(startDate, endDate) {
    return this.#calendar.workdaysAfterUntil(startDate, endDate)
  }

  /**
   * @param {string} date - String 'YYYY-MM-DD'
   * @param {number} workdays
   */
  addWorkdays(date, workdays) {
    return this.#calendar.addWorkdays(date, workdays)
  }
}
