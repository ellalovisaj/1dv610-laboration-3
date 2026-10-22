import express from 'express'
import createError from 'http-errors'

export function createRouter(controllers) {
  const router = express.Router()

  router.get('/', (req, res) => controllers.home.index(req, res))

  router.get('/test-form', (req, res) => controllers.home.testForm(req, res))

  router.post('/test-form', (req, res, next) => controllers.home.testFormPost(req, res, next))

  router.get('/worktime', (req, res) => controllers.worktime.worktime(req, res))

  router.post('/worktime', (req, res, next) => controllers.worktime.worktimePost(req, res, next))

  // Catch 404. Always last route in router
  router.use((_req, _res, next) => next(createError(404)))

  return router
}
