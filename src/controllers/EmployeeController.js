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
    const allEmployeeObjects = this.#employees.getAll()

    const allEmployees = []
    for (const employeeObject of allEmployeeObjects) {
      allEmployees.push({
        id: employeeObject.getId(),
        name: employeeObject.getName(),
        start: employeeObject.getWorkingHours().workdayStart,
        end: employeeObject.getWorkingHours().workdayEnd,
        vacation: employeeObject.getVacationDaysPerYear(),
      })
    }

    res.render('employee/list', { allEmployees })
  }

  // get
  showCreateForm(_req, res) {
    res.render('employee/create-form', {})
  }

  // post
  createNew(req, res) {
    const input = {
      name: req.body.name,
      start: req.body.workdayStart,
      end: req.body.workdayEnd,
      vacationDays: req.body.vacationDaysPerYear,
    }

    const employee = this.#employees.createEmployee(input.name, input.start, input.end, input.vacationDays)

    // TODO: Success flash

    res.redirect(`./${employee.getId()}`)
  }

  // get
  showProfile(req, res) {
    const employeeId = req.params.id
    const employeeObject = this.#employees.getById(employeeId)
    const bookings = this.#scheduler.getUpcomingBookingsFor(employeeId)

    // TODO: Shorten with spread? [...]
    const employee = {
      id: employeeObject.getId(),
      name: employeeObject.getName(),
      start: employeeObject.getWorkingHours().workdayStart,
      end: employeeObject.getWorkingHours().workdayEnd,
      vacation: employeeObject.getVacationDaysPerYear(),
    }

    res.render('employee/profile', { employee, bookings })
  }

  // get
  edit(req, res) {
    const employyeId = req.params.id
    const employeeObject = this.#employees.getById(employyeId)

    const employee = {
      id: employeeObject.getId(),
      name: employeeObject.getName(),
      start: employeeObject.getWorkingHours().workdayStart,
      end: employeeObject.getWorkingHours().workdayEnd,
      vacation: employeeObject.getVacationDaysPerYear(),
    }

    res.render('employee/edit-form', { employee })
  }

  // post
  editPost(req, res) {
    const input = {
      start: req.body.workdayStart,
      end: req.body.workdayEnd,
      vacationDays: req.body.vacationDaysPerYear,
    }

    const id = req.params.id

    this.#employees.editWorkinghours(id, input.start, input.end)
    this.#employees.editVacationDaysPerYear(id, input.vacationDays)

    res.redirect(`./${id}`)
  }

  resetDemo(_req, res) {
    this.#demoData.reset()
    res.redirect(`../`)
  }
}
