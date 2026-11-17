import express from 'express'

export function createBookingRouter(controller) {
  const router = express.Router({ mergeParams: true })

  // path baseURL/employee/:id/booking

  router.get('/', (_req, res) => {
    res.redirect('../')
  })

  router.get('/new', (req, res, next) => controller.showCreateForm(req, res, next))
  router.post('/new', (req, res, next) => controller.createNew(req, res, next))


  router.get('/:bookingId/edit', (req, res, next) => controller.edit(req, res, next))
  router.get('/:bookingId/delete', (req, res, next) => controller.delete(req, res, next))

  router.post('/:bookingId', (req, res, next) => controller.editPost(req, res, next))
  router.get('/:bookingId', (req, res, next) => controller.showDetails(req, res, next))

  return router
}
