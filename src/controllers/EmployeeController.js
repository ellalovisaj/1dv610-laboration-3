export class EmployeeController {
  #employees
  #demoData

  constructor(employeeRegistry, demoData) {
    this.#employees = employeeRegistry
    this.#demoData = demoData
  }

  showList(_req, res) {
    const allEmployees = this.#employees.getAll()

    res.render('employee/employee-list', { allEmployees })
  }

  showProfile(_req, res) {
    // TODO: Render view
    res.render('employee/profile', {})
  }

  showNewEmployeeForm(_req, res) {
    res.render('employee/new-employee', {})
  }

  addNew(_req, res) {
    // TODO: Get input here

    // TODO: Render view
    res.render('employee/employee-list', {})
  }
}
