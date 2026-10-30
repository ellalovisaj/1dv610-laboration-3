/**
 *
 */
export class WorktimeController {
  #worktimeCalculator

  constructor(worktimeCalculator) {
    this.#worktimeCalculator = worktimeCalculator
  }

  worktime(_req, res) {
    res.render('worktime/mode-picker')
  }

  showMonthForm(_req, res) {
    res.render('worktime/month-form', { result: {} })
  }

  calculateMonth(req, res) {
    const input = {
      month: req.body.month,
      percentage: req.body['month-percentage'],
      hourlyWage: req.body['month-salary'],
    }

    // TODO: Validate

    const result = this.#worktimeCalculator.calculateMonthWorktime(input)
    res.render('worktime/month-form', { result })
  }

  showRangeForm(_req, res) {
    res.render('worktime/selected-range-form', { result: {} })
  }

  calculateRange(req, res) {
    const input = {
      startDate: req.body['start-date'],
      endDate: req.body['end-date'],
      percentage: req.body['selected-range-percentage'],
      hourlyWage: req.body['selected-range-salary'],
    }

    // TODO: Validate

    const result = this.#worktimeCalculator.calculateSelectedRangeWorktime(input)
    res.render('worktime/selected-range-form', { result })
  }
}
