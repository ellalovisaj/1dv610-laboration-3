/**
 *
 */
export class CalendarController {
  #holidayService

  constructor(holidayService) {
    this.#holidayService = holidayService
  }
  /**
   * Renders home page.
   *
   * @param {object} _req - Express request object.
   * @param {object} res - Express response object.
   */
  index(_req, res) {
    res.render('home/index')
  }

  testForm(_req, res) {
    res.render('calendar/form', { date: '', holiday: false })
  }

  testFormPost(req, res) {
    const date = req.body.date
    const holiday = this.#holidayService.isHoliday(date)
    console.log(holiday)
    res.render('calendar/form', { date, holiday } )
  }
}
