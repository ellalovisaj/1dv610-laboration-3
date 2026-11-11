import express from 'express'

export function createVacationRouter(controller) {
  const router = express.Router()

  router.get('/vacation', (req, res) => controller.showForm(req, res))
  router.post('/vacation/vacation-period', (req, res) => controller.calculatePeriod(req, res))
  router.post('/vacation/vacation-day-count', (req, res) => controller.calculateDays(req, res))

  return router
}
