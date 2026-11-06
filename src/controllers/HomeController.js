/**
 *
 */
export class HomeController {
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
}
