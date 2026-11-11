import express from 'express'

export function createEmployeeRouter(controller) {
  const router = express.Router()

  // Employees
  router.get('/', (req, res, next) => controller.showList(req, res, next))

  // Add new
  router.get('/new', (req, res, next) => controller.showNewEmployeeForm(req, res, next))
  router.post('/new', (req, res, next) => controller.addNew(req, res, next))

  // Show Profile
  router.get('/:id', (req, res, next) => controller.showProfile(req, res, next))
  router.get('/:id/edit', (req, res, next) => controller.edit(req, res, next))

  // Edit profile
  router.post('/:id', (req, res, next) => controller.editPost(req, res, next))

  return router
}
