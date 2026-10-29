/**
 *
 */
export class WorktimeController {
  #worktimeCalculator

  constructor(worktimeCalculator) {
    this.#worktimeCalculator = worktimeCalculator
  }

  worktime(_req, res) {
    res.render('worktime/mode-picker', { input: {} })
  }

  worktimeMonth(_req, res) {
    res.render('worktime/month-form', { input: {} })
  }

  worktimeMonthPost(req, res) {
    const input = {
      month: req.body.month,
      percentage: req.body['month-percentage'],
      salary: req.body['month-salary'],
    }

    // TODO: Validate

    // TODO: Calculate

    // Render
    res.render('worktime/month-form', { input })
  }

  worktimeSelectedRange(_req, res) {
    res.render('worktime/selected-range-form', { input: {} })
  }

  worktimeSelectedRangePost(req, res) {
    const input = {
      startDate: req.body['start-date'],
      endDate: req.body['end-date'],
      percentage: req.body['selected-range-percentage'],
      salary: req.body['selected-range-salary'],
    }

    // TODO: Validate

    // TODO: Calculate

    // Render
    res.render('worktime/selected-range-form', { input })
  }
}
