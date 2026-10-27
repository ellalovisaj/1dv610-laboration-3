import express from 'express'
import createError from 'http-errors'

export function createRouter(controllers) {
  const router = express.Router()

  router.get('/', (req, res) => controllers.home.index(req, res))

  router.get('/test-form', (req, res) => controllers.home.testForm(req, res))

  router.post('/test-form', (req, res) => controllers.home.testFormPost(req, res))

  router.get('/worktime', (req, res) => controllers.worktime.worktime(req, res))

  router.get('/worktime/month', (req, res) => controllers.worktime.worktimeMonth(req, res))
  
  router.post('/worktime/month', (req, res) => controllers.worktime.worktimeMonthPost(req, res))

  router.get('/worktime/selected-range', (req, res) => controllers.worktime.worktimeSelectedRange(req, res))
  
  router.post('/worktime/selected-range', (req, res) => controllers.worktime.worktimeSelectedRangePost(req, res))

  // Catch 404. Always last route in router
  router.use((_req, _res, next) => next(createError(404)))

  return router
}
