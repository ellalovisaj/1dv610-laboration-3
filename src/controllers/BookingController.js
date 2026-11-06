export class BookingController {
  #scheduler

  constructor(bookingScheduler) {
    this.#scheduler = bookingScheduler
  }

  booking(_req, res) {

    // TODO: Render view
    res.render('.../...', {  })
  }

  bookingPost(_req, res) {
    // TODO: Get input and calc
    
    // TODO: Render view
    res.render('.../...', {  })
  }
}