import express from 'express'
import createError from 'http-errors'

import { createEmployeeRouter } from './employeeRouter.js'
import { createVacationRouter } from './vacationRouter.js'
import { createBookingRouter } from './bookingRouter.js'

export function createRouter(controllers) {
  const router = express.Router()

  // home page -> emloyees
  router.get('/', (_req, res) => {
    res.redirect('./employees')
  })

  router.use('/employees', createEmployeeRouter(controllers.employee))
  router.use('/employees/:id/booking', createBookingRouter(controllers.booking))
  router.use('/vacation', createVacationRouter(controllers.vacation))

  router.get('/booking/all', (req, res, next) => controllers.booking.showAll(req, res, next))
  router.post('/demo/reset', (req, res, next) => controllers.employee.resetDemo(req, res, next))


  // Catch 404. Always last route in router
  router.use((_req, _res, next) => next(createError(404)))

  return router
}
