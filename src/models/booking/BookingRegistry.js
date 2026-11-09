/**
 * Stores bookings in Map:
 * (id, { id, employeeId, type, customerName, start, end })
 * 
 * Will be connected to bookings schema when/if database is introduced.
 * Does not recognize the 'booking-module' or any of its objects.
 *
 * Responsibilities:
 * - Adds, gets and removes bookings.
 * - Finds an employee's bookings of a given period.
 * - Clears all bookings when needed.
 */
export class BookingRegistry {
  #bookings = new Map()

  constructor(bookings) {
    this.#bookings = bookings
  }

  saveBooking(employeeId, booking) {
    // Check if booking is already saved by bookingId
    if (this.#isBookingId(booking.id))

    // Save to bookings
    this.#bookings.set(employeeId, booking)
  }

  getBooking(id) {
    this.#validateBookingId(id)
    this.#bookings.get(id)
  }

  getBookingsForEmployeeBetween(resource, from, to) {
    // TODO:
    // Get bookings for a specific employee
    // Only bookings between the dates given

    // return array of bookings
  }

  deleteBooking(id) {
    this.#validateBookingId(id)
    this.#bookings.delete(id)
  }

  #validateBookingId(id) {
    if (!this.#isBookingId(id)) throw new Error('Booking ID is not in registry')
  }

  #isBookingId(id) {
    return this.#bookings.has(id)
  }
}
