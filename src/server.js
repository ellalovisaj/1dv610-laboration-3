import 'dotenv/config'
import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import helmet from 'helmet'
import morgan from 'morgan'

import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { HolidayService } from './models/calendar/HolidayService.js'
import { HomeController } from './controllers/HomeController.js'
import { createRouter } from './routes/router.js'
import { WorktimeCalculator } from './models/worktime/WorktimeCalculator.js'
import { WorktimeController } from './controllers/WorktimeController.js'

try {
  const app = express()

  app.use(helmet())
  app.use(morgan('dev'))

  const fullDirectoryName = dirname(fileURLToPath(import.meta.url))
  const baseURL = process.env.BASE_URL || '/'
  const port = process.env.PORT || 3000

  // view engine
  app.set('view engine', 'ejs')
  app.set('views', join(fullDirectoryName, 'views'))
  app.use(expressLayouts)
  app.set('layout', join(fullDirectoryName, 'views', 'layouts', 'default'))

  // parse requests
  app.use(express.urlencoded({ extended: false }))

  // makes it possible to use public folder (css etc) in browser
  app.use(express.static(join(fullDirectoryName, '..', 'public')))

  // Specify middleware to be executed before the routes
  app.use((_req, res, next) => {
    // Pass the base URL to the views.
    res.locals.baseURL = baseURL
    next()
  })

  // Add services and register router with services
  const holidayService = new HolidayService()

  const controllers = {
    home: new HomeController(holidayService),
    worktime: new WorktimeController(holidayService),
  }
  const router = createRouter(controllers)
  app.use('/', router)

  // Error handle
  app.use((err, req, res, _next) => {
    // If Status code is 404, send 404.html.
    if (err.status === 404) {
      return res.status(404).sendFile(join(fullDirectoryName, 'views', 'errors', '404.html'))
    }

    console.error(err)

    // If not 404 and not in development, send 500.html (without details).
    if (req.app.get('env') !== 'development') {
      return res.status(500).sendFile(join(fullDirectoryName, 'views', 'errors', '500.html'))
    }

    // If in development, render the error page (with details).
    return res.status(err.status || 500).render('errors/error', { error: err })
  })

  // Start the HTTP server
  app.listen(port, (error) => {
    if (error) {
      console.error(error)
      process.exitCode = 1
      return
    }
    console.log(`Server running at http://localhost:${port}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
