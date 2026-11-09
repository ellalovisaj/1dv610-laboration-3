export class EmployeeController {
  #employeeRegistry
  #demoData

  constructor(employeeRegistry, demoData) {
    this.#employeeRegistry = employeeRegistry
    this.#demoData = demoData
  }

  showList(_req, res) {
    // TODO: Render view
    res.render('.../...', {})
  }

  showProfile(_req, res) {
    // TODO: Render view
    res.render('.../...', {})
  }

  employeePost(_req, res) {
    // TODO: Get input here

    // TODO: Render view
    res.render('.../...', {})
  }
}
