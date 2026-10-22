import express from 'express'
import createError from 'http-errors'

export function createRouter(calendarController) {
  const router = express.Router()

  router.get('/', (req, res) => calendarController.index(req, res))

  router.get('/test-form', (req, res) => calendarController.testForm(req, res))

  router.post('/test-form', (req, res, next) => calendarController.testFormPost(req, res, next))

  // Catch 404. Always last route in router
  router.use((_req, _res, next) => next(createError(404)))

  return router
}
