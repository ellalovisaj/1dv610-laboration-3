export class BookingController {
  #scheduler

  constructor(bookingScheduler) {
    this.#scheduler = bookingScheduler
  }

  showList(_req, res) {}

  showDetails(_req, res) {}

  showCreateForm(_req, res) {
    res.render('booking/create-form', {})
  }

  createNew(req, res) {
    const input = {
      employeeId: req.params.id,
      customerName: req.body.customerName,
      start: req.body.bookingStart,
      end: req.body.bookingEnd,
    }

    const bookingId = this.#scheduler.addBooking(input)

    // TODO: Success flash

    res.redirect(`./${bookingId}`)
  }

  edit(req, res) {
    
  }

  editPost(req, res) {
    const input = {
      id: req.params.bookingId,
      employeeId: req.params.id,
      customerName: req.body.customerName,
      date: req.body.date,
      start: req.body.bookingStart,
      end: req.body.bookingEnd,
    }
    res.redirect(`./${input.id}`)

  }

  booking(_req, res) {
    // TODO: Render view
    res.render('booking/details', {})
  }
}
