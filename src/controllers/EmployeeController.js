export class EmployeeController {
  #employees
  #demoData

  constructor(employeeRegistry, demoData) {
    this.#employees = employeeRegistry
    this.#demoData = demoData
  }

  // get
  showList(_req, res) {
    const allEmployees = this.#employees.getAll()

    res.render('employee/list', { allEmployees })
  }

  // get
  showNewEmployeeForm(_req, res) {
    res.render('employee/create-form', {})
  }

  // post
  addNew(req, res) {
    const employeeInfo = req.body
    const newEmployee = this.employeeRegistry.createEmployee(employeeInfo)

    // TODO: Sucess flash

    // TODO: Render view
    res.render('employee/profile', { newEmployee })
  }

  // get
  showProfile(req, res) {
    const employyeId = req.params.id
    const employee = this.#employees.getById(employyeId)

    res.render('employee/profile', { employee })
  }

  // get
  edit(req, res) {
    const employyeId = req.params.id
    const employee = this.#employees.getById(employyeId)

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
    const employee = this.#employees.getById(id)

    this.#employees.editWorkinghours(id, input.start, input.end)
    this.#employees.editVacationDaysPerYear(id, input.vacationDays)

    res.render('employee/profile', { employee })
  }
}
