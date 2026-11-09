import 'dotenv/config'
import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import helmet from 'helmet'
import morgan from 'morgan'

import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { createRouter } from './routes/router.js'

// controllers
import { HomeController } from './controllers/HomeController.js'
import { VacationController } from './controllers/VacationController.js'
import { WorktimeController } from './controllers/WorktimeController.js'
import { BookingController } from './controllers/BookingController.js'

// helpers
import { WorktimeCalculator } from './models/worktime/WorktimeCalculator.js'
import { VacationCalculator } from './models/vacation/VacationCalculator.js'
// TODO: import { VacationPlanner } from './models/vacation/VacationPlanner.js'
import { BookingScheduler } from './models/booking/BookingScheduler.js'
import { EmployeeRegistry } from './models/employee/EmployeeRegistry.js'
import { BookingRegistry } from './models/booking/BookingRegistry.js'

// service layers
import { HolidayService } from './services/HolidayService.js'
import { BookingService } from './services/BookingService.js'

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

  // Services and storage
  const bookingRegistry = new BookingRegistry()
  const holidayService = new HolidayService()
  const bookingService = new BookingService(bookingRegistry)
  const employeeRegistry = new EmployeeRegistry(bookingService)
  
  // Helpers
  const worktimeCalculator = new WorktimeCalculator(holidayService)
  const vacationCalculator = new VacationCalculator(holidayService)

  // TODO: Uncomment and pass planner to VacationController
  // TODO: When it's done
  // const vacationPlanner = new VacationPlanner(holidayService, bookingService, vacationCalculator, employeeRegistry)
  const bookingScheduler = new BookingScheduler(holidayService, bookingService, employeeRegistry)

  // Controllers
  const controllers = {
    home: new HomeController(holidayService),
    worktime: new WorktimeController(worktimeCalculator),
    vacation: new VacationController(vacationCalculator),
    booking: new BookingController(bookingScheduler),
  }

  // Router
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
