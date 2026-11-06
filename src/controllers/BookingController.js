export class BookingController {
  #scheduler

  constructor(bookingScheduler) {
    this.#scheduler = bookingScheduler
  }
}