import express from 'express'
import createError from 'http-errors'

export function createRouter(controllers) {
  const router = express.Router()

  // home page -> emloyees
  router.get('/', (_req, res) => {
    res.redirect('./employees')
  })

  // worktime
  router.get('/worktime', (req, res) => controllers.worktime.worktime(req, res))
  router.get('/worktime/month', (req, res) => controllers.worktime.showMonthForm(req, res))
  router.post('/worktime/month', (req, res) => controllers.worktime.calculateMonth(req, res))
  router.get('/worktime/selected-range', (req, res) => controllers.worktime.showRangeForm(req, res))
  router.post('/worktime/selected-range', (req, res) => controllers.worktime.calculateRange(req, res))

  // Vacation
  router.get('/vacation', (req, res) => controllers.vacation.showForm(req, res))
  router.post('/vacation/vacation-period', (req, res) => controllers.vacation.calculatePeriod(req, res))
  router.post('/vacation/vacation-day-count', (req, res) => controllers.vacation.calculateDays(req, res))

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

  // Catch 404. Always last route in router
  router.use((_req, _res, next) => next(createError(404)))

  return router
}
