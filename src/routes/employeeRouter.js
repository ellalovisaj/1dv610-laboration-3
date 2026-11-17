import express from 'express'

export function createEmployeeRouter(controller) {
  const router = express.Router()

  router.get('/', (req, res, next) => controller.showList(req, res, next))

  router.get('/new', (req, res, next) => controller.showCreateForm(req, res, next))
  router.post('/new', (req, res, next) => controller.createNew(req, res, next))

  router.get('/:id', (req, res, next) => controller.showProfile(req, res, next))
  router.get('/:id/edit', (req, res, next) => controller.edit(req, res, next))

  router.post('/:id', (req, res, next) => controller.editPost(req, res, next))
  router.post('/:id/delete', (req, res, next) => controller.delete(req, res, next))

  return router
}
