import express from 'express'

export function createBookingRouter(controller) {
  const router = express.Router()

  // path baseURL/employee/:id/booking

  // Employees
  router.get('/', (req, res, next) => controller.showList(req, res, next))

  // Add new
  router.get('/new', (req, res, next) => controller.showCreateForm(req, res, next))
  router.post('/new', (req, res, next) => controller.createNew(req, res, next))

  // Show Profile
  router.get('/:id', (req, res, next) => controller.showDetails(req, res, next))

  // Edit profile
  router.get('/:id/edit', (req, res, next) => controller.edit(req, res, next))
  router.post('/:id', (req, res, next) => controller.editPost(req, res, next))

  return router
}
