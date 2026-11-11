export class BookingController {
  #scheduler

  constructor(bookingScheduler) {
    this.#scheduler = bookingScheduler
  }

  showList(req, res) {
    const employeeId = req.params.id

    // TODO: Add date as query in view
    // const date = req.query.date
    const date = '2027-01-05'
    const bookings = this.#scheduler.getBookingsForEmployeeOnDate(employeeId, date)

    res.render('booking/list', { bookings })
  }

  showCreateForm(req, res) {
    const employeeId = req.params.id
    const employeeInfo = this.#scheduler.getEmployeeInfo(employeeId)

    res.render('booking/create-form', { employeeInfo })
  }

  createNew(req, res) {
    const input = {
      employeeId: req.params.id,
      customerName: req.body.customerName,
      date: req.body.date,
      start: req.body.bookingStart,
      end: req.body.bookingEnd,
    }

    const bookingId = this.#scheduler.addBooking(input)

    // TODO: Success flash

    res.redirect(`./${bookingId}`)
  }

  showDetails(req, res) {
    const bookingId = req.params.bookingId
    const bookingData = this.#scheduler.getBooking(bookingId)

    res.render('booking/details', { bookingData })
  }

  edit(req, res) {
    const employeeId = req.params.id
    const bookingId = req.params.bookingId
    const bookingObject = this.#scheduler.getBooking(bookingId)

    const booking = {
      id: bookingId,
      employeeId,
      customerName: bookingObject.customerName,
      date: bookingObject.date,
      start: bookingObject.start,
      end: bookingObject.end,
    }

    res.render('booking/edit-form', { booking })
  }

  editPost(req, res) {
    const input = {
      id: req.params.bookingId,
      employeeId: req.params.id,
      type: 'appointment',
      customerName: req.body.customerName,
      date: req.body.date,
      start: req.body.bookingStart,
      end: req.body.bookingEnd,
    }

    const bookingId = this.#scheduler.editBooking(input)

    res.redirect(`./${bookingId}`)
  }
}
