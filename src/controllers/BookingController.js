export class BookingController {
  #scheduler

  constructor(bookingScheduler) {
    this.#scheduler = bookingScheduler
  }

  showAll(_req, res) {
    const bookings = this.#scheduler.getAllBookings()

    res.render('booking/all-bookings', { bookings })
  }

  showAvailableSlots(req, res) {
    const employeeId = req.params.id
    const employeeInfo = this.#scheduler.getEmployeeInfo(employeeId)

    const date = req.query.date || this.#scheduler.getNextWorkdayFromToday()

    //TODO: Remove test duration
    const duration = 60

    if (req.query.date !== date) {
      res.redirect(this.#timeSlotsURL(res, employeeId, date))
    } else {
      const slots = this.#scheduler.getAvailableTimeSlots(employeeId, duration, date)

      res.render('booking/available-slots', {
        date,
        slots,
        employeeInfo,
        previousDayURL: this.#timeSlotsURL(res, employeeId, this.#scheduler.getNextWorkdayFromToday()),
        nextDayURL: this.#timeSlotsURL(res, employeeId, this.#scheduler.getNextWorkdayAfter(date)),
        backURL: `${res.locals.baseURL}employees/${employeeId}`,
      })
    }
  }

  #timeSlotsURL(res, employeeId, date) {
    const query = new URLSearchParams({ date })
    return `${res.locals.baseURL}employees/${employeeId}/booking/available-times?${query}`
  }

  showCreateForm(req, res) {
    const employeeId = req.params.id
    const employeeInfo = this.#scheduler.getEmployeeInfo(employeeId)

    res.render('booking/create-form', {
      employeeInfo,
      date: req.query.date || this.#scheduler.getNextWorkdayFromToday(),
      start: req.query.start || '',
      backURL: `${res.locals.baseURL}employees/${employeeId}`,
    })
  }

  createNew(req, res) {
    const input = {
      employeeId: req.params.id,
      customerName: req.body.customerName,
      date: req.body.date,
      start: req.body.start,
      duration: Number(req.body.duration),
    }

    const bookingId = this.#scheduler.addBooking(input)

    // TODO: Success flash

    res.redirect(`${res.locals.baseURL}employees/${input.employeeId}/booking/${bookingId}`)
  }

  showDetails(req, res) {
    const employeeId = req.params.id
    const bookingId = req.params.bookingId
    const booking = this.#scheduler.getBookingDetails(employeeId, bookingId)

    res.render('booking/details', { booking, backURL: `${res.locals.baseURL}employees/${employeeId}` })
  }

  edit(req, res) {
    const employeeId = req.params.id
    const bookingId = req.params.bookingId
    const booking = this.#scheduler.getBookingDetails(employeeId, bookingId)

    res.render('booking/edit-form', {
      booking,
      backURL: `${res.locals.baseURL}employees/${employeeId}/booking/${bookingId}`,
    })
  }

  editPost(req, res) {
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

    res.redirect(`${res.locals.baseURL}employees/${input.employeeId}/booking/${bookingId}`)
  }

  delete(req, res) {
    const bookingId = req.params.bookingId
    const employeeId = req.params.id

    this.#scheduler.deleteBooking(bookingId, employeeId)

    res.redirect(`${res.locals.baseURL}employees/${employeeId}`)
  }
}
