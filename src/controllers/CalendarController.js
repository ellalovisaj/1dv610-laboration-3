/**
 *
 */
export class CalendarController {
  /**
   * Renders home page.
   *
   * @param {object} _req - Express request object.
   * @param {object} res - Express response object.
   * @param {object} _next - Express next middleware function.
   */
  async index(_req, res, _next) {
    res.render('home/index')
  }

  async testForm(_req, res, _next) {
    res.render('calendar/form', {  })
  }

  async testFormPost(req, res, _next) {
    const date = req.body.date
    res.render('calendar/form', { date })
  }
}
