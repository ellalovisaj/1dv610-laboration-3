import express from 'express'

export function createVacationRouter(controller) {
  const router = express.Router()

  router.get('/', (req, res, next) => controller.showForm(req, res, next))
  router.post('/vacation-period', (req, res, next) => controller.calculatePeriod(req, res, next))
  router.post('/vacation-day-count', (req, res, next) => controller.calculateDays(req, res, next))

  return router
}
