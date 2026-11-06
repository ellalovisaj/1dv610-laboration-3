export class VacationController {
  #calculator

  constructor(vacationCalculator) {
    this.#calculator = vacationCalculator
  }

  showForm(_req, res) {
    res.render('vacation/vacation', { vacationPeriod: {} })
  }

  // Takes start date and number of workdays
  // Returns start and end date
  calculatePeriod(req, res) {
    const input = {
      vacationDayCount: req.body['vacation-days-count'],
      startDate: req.body['vacation-start-date'],
    }

    const vacationPeriod = this.#calculator.calculateVacationPeriod(input)

    res.render('vacation/vacation', { vacationPeriod })
  }


  // Takes start and end date
  // Returns how many vacation days needed
  calculateDays(req, res) {
    const vacationPeriod = {
      startDate: req.body['vacation-start-date'],
      endDate: req.body['vacation-end-date'],
    }

    res.render('vacation/vacation', { vacationPeriod })
  }
}
