import express from 'express'
import createError from 'http-errors'
import { CalendarController } from '../controllers/CalendarController.js'

export const router = express.Router()

const controller = new CalendarController()

router.get('/', (req, res) => controller.index(req, res))

router.get('/test-form', (req, res) => controller.testForm(req, res))

router.post('/test-form', (req, res, next) => controller.testFormPost(req, res, next))

// Catch 404. Always last route in router
router.use((_req, _res, next) => next(createError(404)))
