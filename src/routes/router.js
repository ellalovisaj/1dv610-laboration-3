import express from 'express'
import createError from 'http-errors'

export function createRouter(controllers) {
  const router = express.Router()

  router.get('/', (req, res) => controllers.home.index(req, res))

  router.get('/test-form', (req, res) => controllers.home.testForm(req, res))

  router.post('/test-form', (req, res) => controllers.home.testFormPost(req, res))

  router.get('/worktime', (req, res) => controllers.worktime.worktime(req, res))

  router.get('/worktime/month', (req, res) => controllers.worktime.showMonthForm(req, res))
  
  router.post('/worktime/month', (req, res) => controllers.worktime.calculateMonth(req, res))

  router.get('/worktime/selected-range', (req, res) => controllers.worktime.showRangeForm(req, res))
  
  router.post('/worktime/selected-range', (req, res) => controllers.worktime.calculateRange(req, res))

  // Catch 404. Always last route in router
  router.use((_req, _res, next) => next(createError(404)))

  return router
}
