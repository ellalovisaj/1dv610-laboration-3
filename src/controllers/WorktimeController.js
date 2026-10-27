/**
 *
 */
export class WorktimeController {
  #worktimeCalculator

  /**
   *
   * @param worktimeCalculator
   */
  constructor(worktimeCalculator) {
    this.#worktimeCalculator = worktimeCalculator
  }

  /**
   *
   * @param _req
   * @param res
   */
  worktime(_req, res) {
    res.render('worktime/mode-picker', { input: {} })
  }

  worktimeMonth(_req, res) {
    const input = {
      month: '',
      percentage: '',
      salary: '',
    }
    res.render('worktime/month-form', { input })
  }

  worktimeMonthPost(req, res) {
    const input = {
      month: req.body.month,
      percentage: req.body['month-percentage'],
      salary: req.body['month-salary'],
    }
    res.render('worktime/month-form', { input })
  }

  worktimeSelectedRange(_req, res) {
    res.render('worktime/selected-range-form', { input: {} })
  }

  worktimeSelectedRangePost(req, res) {
    const input = {
      startDate: req.body['start-date'],
      endDate: req.body['end-date'],
      percentage: req.body.percentage,
      salary: req.body.salary,
    }
    res.render('worktime/selected-range-form', { input })
  }
}
