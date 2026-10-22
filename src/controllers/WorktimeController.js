export class WorktimeController {
  #holidayService

  constructor(holidayService) {
    this.#holidayService = holidayService
  }

  worktime(_req, res) {
    res.render('worktime/worktime-form')
  }

  worktimePost(req, res) {
    // TODO: Remove tests
    // const startDate = req.body['start-date']
    // const endDate = req.body['end-date']
    // const month = req.body.month
    // const percentage = req.body.percentage
    // const salary = req.body.salary

    // console.log(month, percentage, salary)
    res.render('worktime/worktime-form')
  }
}
