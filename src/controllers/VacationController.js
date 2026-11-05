export class VacationController {
  #vacationCalculator

  constructor(vacationCalculator) {
    this.#vacationCalculator = vacationCalculator
  }

  showForm(_req, res) {
    res.render('vacation/vacation', { result: {} })
  }

  calculatePeriod(req, res) {
    const result = {
      vacationDayCount: req.body['vacation-days-count'],
      startDate: req.body['vacation-start-date'],
    }

    res.render('vacation/vacation', { result })
  }


  calculateDays(req, res) {
    const result = {
      startDate: req.body['vacation-start-date'],
      endDate: req.body['vacation-end-date'],
    }

    res.render('vacation/vacation', { result })
  }
}
