export class BookingController {
  #scheduler

  constructor(bookingScheduler) {
    this.#scheduler = bookingScheduler
  }

  showAll(_req, res) {
    const bookings = this.#scheduler.getAllBookings()

    res.render('booking/all-bookings', { bookings })
  }

  showCreateForm(req, res) {
    const employeeId = req.params.id
    const employeeInfo = this.#scheduler.getEmployeeInfo(employeeId)
    const nextWorkday = this.#scheduler.getNextWorkday()

    res.render('booking/create-form', { employeeInfo, nextWorkday, backURL: `${res.locals.baseURL}employees/${employeeId}`})
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

    res.render('booking/edit-form', { booking, backURL: `${res.locals.baseURL}employees/${employeeId}/booking/${bookingId}` })
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
