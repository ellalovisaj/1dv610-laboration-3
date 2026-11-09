import express from 'express'
import createError from 'http-errors'

export function createRouter(controllers) {
  const router = express.Router()

  router.get('/', (_req, res) => {
    res.redirect('./employees')
  })

  router.get('/worktime', (req, res) => controllers.worktime.worktime(req, res))
  router.get('/worktime/month', (req, res) => controllers.worktime.showMonthForm(req, res))
  router.post('/worktime/month', (req, res) => controllers.worktime.calculateMonth(req, res))

  router.get('/worktime/selected-range', (req, res) => controllers.worktime.showRangeForm(req, res))
  router.post('/worktime/selected-range', (req, res) => controllers.worktime.calculateRange(req, res))

  router.get('/vacation', (req, res) => controllers.vacation.showForm(req, res))
  router.post('/vacation/vacation-period', (req, res) => controllers.vacation.calculatePeriod(req, res))
  router.post('/vacation/vacation-day-count', (req, res) => controllers.vacation.calculateDays(req, res))

  router.get('/employees', (req, res) => controllers.employee.showList(req, res))
  router.get('/employee/new', (req, res) => controllers.employee.showForm(req, res))
  router.post('/employee/new', (req, res) => controllers.employee.addNew(req, res))
  
  router.get('/employees/:id', (req, res) => controllers.employee.showProfile(req, res))

  // Catch 404. Always last route in router
  router.use((_req, _res, next) => next(createError(404)))

  return router
}
