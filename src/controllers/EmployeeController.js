export class EmployeeController {
  #employees
  #demoData
  #scheduler

  constructor(employeeRegistry, scheduler, demoData) {
    this.#employees = employeeRegistry
    this.#scheduler = scheduler
    this.#demoData = demoData
    
  }

  // get
  showList(_req, res) {
    const allEmployees = this.#employees.getAll().map((employee) => this.#toEmployeeView(employee))

    res.render('employee/list', { allEmployees })
  }

  // get
  showCreateForm(_req, res) {
    res.render('employee/create-form', { backURL: `${res.locals.baseURL}employees` })
  }

  // post
  createNew(req, res) {
    const input = {
      name: req.body.name,
      start: req.body.workdayStart,
      end: req.body.workdayEnd,
      vacationDays: Number(req.body.vacationDaysPerYear),
    }

    const employee = this.#employees.createEmployee(input)

    // TODO: Success flash

    res.redirect(`${res.locals.baseURL}employees/${employee.getId()}`)
  }

  // get
  showProfile(req, res) {
    const employeeId = req.params.id
    const employee = this.#toEmployeeView(this.#employees.getById(employeeId))

    const date = req.query.date || this.#scheduler.getNextWorkdayFromToday()
    const bookings = this.#scheduler.getBookingsForEmployeeOnDate(employeeId, date)

    res.render('employee/profile', {
      date,
      employee,
      bookings,
      previousDayURL: this.#upcomingBookingsURL(res, employeeId, this.#scheduler.getPreviousWorkday(date)),
      nextDayURL: this.#upcomingBookingsURL(res, employeeId, this.#scheduler.getWorkdayAfter(date)),
      availableTimesURL: `${res.locals.baseURL}employees/${employeeId}/booking/available-times?date=${date}`,
      backURL: `${res.locals.baseURL}employees`
    })
  }

  #upcomingBookingsURL(res, employeeId, date) {
    const query = new URLSearchParams({ date })
    return `${res.locals.baseURL}employees/${employeeId}?${query}`
  }

  // get
  edit(req, res) {
    const employeeId = req.params.id
    const employee = this.#toEmployeeView(this.#employees.getById(employeeId))

    res.render('employee/edit-form', {
      employee,
      backURL: `${res.locals.baseURL}employees/${employeeId}`
    })
  }

  // post
  editPost(req, res) {
    const input = {
      start: req.body.workdayStart,
      end: req.body.workdayEnd,
      vacationDays: Number(req.body.vacationDaysPerYear),
    }

    const id = req.params.id

    this.#employees.editWorkinghours(id, input.start, input.end)
    this.#employees.editVacationDaysPerYear(id, input.vacationDays)

    res.redirect(`${res.locals.baseURL}employees/${id}`)
  }

  delete(req, res) {
    const employeeId = req.params.id
    // TODO: Ask before, especially if there are bookings

    this.#scheduler.deleteAllBookingsFor(employeeId)
    this.#employees.deleteEmployee(employeeId)
    
    res.redirect(`${res.locals.baseURL}employees`)
  }

  resetDemo(_req, res) {
    this.#demoData.reset()
    res.redirect(`${res.locals.baseURL}employees`)
  }

  #toEmployeeView(employee) {
    return {
      id: employee.getId(),
      name: employee.getName(),
      start: employee.getWorkingHours().workdayStart,
      end: employee.getWorkingHours().workdayEnd,
      vacation: employee.getVacationDaysPerYear(),
    }
  }
}
