export class BookingController {
  #scheduler

  constructor(bookingScheduler) {
    this.#scheduler = bookingScheduler
  }

  showAll(_req, res) {
    const bookings = this.#scheduler.getAllBookings()

    res.render('booking/all-bookings', { bookings })
  }

  #createNewURL(res, employeeId, date, duration) {
    const query = new URLSearchParams({ date, duration })
    return `${res.locals.baseURL}employees/${employeeId}/booking/new?${query}`
  }

  showCreateForm(req, res) {
    const employeeId = req.params.id
    const employeeInfo = this.#scheduler.getEmployeeInfo(employeeId)

    const date = req.query.date || this.#scheduler.getNextWorkdayFromToday()
    const duration = Number(req.query.duration) || 30

    // There's only date in query parameters when user has searched. Only get availble
    // slots if that is true.
    const hasSearched = req.query.date ? true : false
    const slots = hasSearched ? this.#scheduler.getAvailableTimeSlots(employeeId, duration, date) : []

    res.render('booking/create-form', {
      date,
      slots,
      hasSearched,
      duration,
      employeeInfo,
      previousDayURL: this.#createNewURL(res, employeeId, this.#scheduler.getPreviousWorkday(date), duration),
      nextDayURL: this.#createNewURL(res, employeeId, this.#scheduler.getWorkdayAfter(date), duration),
      backURL: `${res.locals.baseURL}employees/${employeeId}`,
    })
  }

  createNew(req, res) {
    try {
      const input = {
        employeeId: req.params.id,
        customerName: req.body.customerName,
        date: req.body.date,
        start: req.body.start,
        duration: Number(req.body.duration),
      }

      const bookingId = this.#scheduler.addBooking(input)

      req.session.flash = {
        message: 'Booking saved!',
        type: 'success',
      }

      res.redirect(`${res.locals.baseURL}employees/${input.employeeId}/booking/${bookingId}`)
    } catch (error) {
      req.session.flash = {
        message: error.message,
        type: 'error',
      }

      const query = new URLSearchParams({ date: req.body.date, start: req.body.start, duration: req.body.duration })

      res.redirect(`${res.locals.baseURL}employees/${req.params.id}/booking/new?${query}`)
    }
  }

  showDetails(req, res) {
    const employeeId = req.params.id
    const bookingId = req.params.bookingId
    const booking = this.#scheduler.getBookingDetails(employeeId, bookingId)

    res.render('booking/details', { booking, backURL: `${res.locals.baseURL}employees/${employeeId}` })
  }

  edit(req, res) {
    const employeeId = req.params.id
    const employeeInfo = this.#scheduler.getEmployeeInfo(employeeId)

    const bookingId = req.params.bookingId
    const booking = this.#scheduler.getBookingDetails(employeeId, bookingId)

    const date = req.query.date || booking.date ||this.#scheduler.getNextWorkdayFromToday()
    const duration = Number(req.query.duration) || booking.duration || 30

    // There's only date in query parameters when user has searched. Only get availble
    // slots if that is true.
    const hasSearched = req.query.date ? true : false
    const slots = hasSearched ? this.#scheduler.getAvailableTimeSlots(employeeId, duration, booking.date) : []

    res.render('booking/edit-form', {
      slots,
      hasSearched,
      bookingId,
      date,
      duration,
      customerName: booking.customerName,
      employeeInfo,
      previousDayURL: this.#createEditURL(res, employeeId, bookingId, this.#scheduler.getPreviousWorkday(date), duration),
      nextDayURL: this.#createEditURL(res, employeeId, bookingId, this.#scheduler.getWorkdayAfter(date), duration),
      backURL: `${res.locals.baseURL}employees/${employeeId}/booking/${bookingId}`,
    })
  }

  #createEditURL(res, employeeId, bookingId, date, duration) {
    const query = new URLSearchParams({ date, duration })
    return `${res.locals.baseURL}employees/${employeeId}/booking/${bookingId}/edit?${query}`
  }

  editPost(req, res) {
    try {
      const input = {
        id: req.params.bookingId,
        employeeId: req.params.id,
        type: 'appointment',
        customerName: req.body.customerName,
        date: req.body.date,
        start: req.body.start,
        duration: Number(req.body.duration),
      }

      const bookingId = this.#scheduler.editBooking(input)

      req.session.flash = {
        message: 'Booking saved!',
        type: 'success',
      }

      res.redirect(`${res.locals.baseURL}employees/${input.employeeId}/booking/${bookingId}`)
    } catch (error) {
      req.session.flash = {
        message: error.message,
        type: 'error',
      }

      res.redirect(`${res.locals.baseURL}employees/${req.params.id}/booking/${req.params.bookingId}/edit`)
    }
  }

  delete(req, res) {
    const bookingId = req.params.bookingId
    const employeeId = req.params.id

    this.#scheduler.deleteBooking(bookingId, employeeId)

    req.session.flash = {
      message: 'Booking deleted!',
      type: 'success',
    }

    res.redirect(`${res.locals.baseURL}employees/${employeeId}`)
  }
}
