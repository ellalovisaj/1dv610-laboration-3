export class VacationController {
  #vacationCalculator

  constructor(vacationCalculator) {
    this.#vacationCalculator = vacationCalculator
  }

  vacation(_req, res) {
    res.render('vacation/vacation', { result: {} })
  }

  vacationPost(req, res) {
    const result = {
      vacationDayCount: req.body['vacation-days-count'],
      startDate: req.body['vacation-start-date'],
      endDate: req.body['vacation-end-date'],
    }


    res.render('vacation/vacation', { result })
  }
}
