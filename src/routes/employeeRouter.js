import express from 'express'

export function createEmployeeRouter(controllers) {
  const router = express.Router()

  // Employees
  router.get('/employees', (req, res) => controllers.employee.showList(req, res))
  router.post('/demo/reset', (req, res) => controllers.employee.resetDemo(req, res))

  // Add new
  router.get('/employees/new', (req, res) => controllers.employee.showNewEmployeeForm(req, res))
  router.post('/employees/new', (req, res) => controllers.employee.addNew(req, res))

  // Show Profile
  router.get('/employees/:id', (req, res) => controllers.employee.showProfile(req, res))

  // Edit profile
  router.post('/employees/:id', (req, res) => controllers.employee.editPost(req, res))
  router.get('/employees/:id/edit', (req, res) => controllers.employee.edit(req, res))

  return router
}
