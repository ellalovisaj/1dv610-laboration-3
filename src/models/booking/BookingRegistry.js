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

  /**
   * Checks if booking id is already in use and saves the booking
   * if not.
   *
   * @param {Object} booking - Object containing info about booking.
   */
  saveBooking(booking) {
    if (!this.#isBookingId(booking.id)) {
      this.#bookings.set(booking.id, booking)
    } else {
      throw new Error('Booking is already saved.')
    }
  }

  getBooking(id) {
    this.#validateBookingId(id)
    return this.#bookings.get(id)
  }

  /**
   * Returns all bookings of given employee within given date range.
   * 
   * @param {string} employeeId
   * @param {string} from - 'YYYY-MM-DD' format
   * @param {string} to  - 'YYYY-MM-DD' format
   * @returns
   */
  getBookingsForEmployeeBetween(employeeId, from, to) {
    const periodStart = `${from}T00:00`
    const periodEnd = `${to}T00:00`

    const result = [...this.#bookings.values()].filter((booking) => 
      booking.employeeId === employeeId &&
      booking.start <= periodEnd &&
      booking.end > periodStart
    )

    return result
  }

  deleteBooking(id) {
    this.#validateBookingId(id)
    this.#bookings.delete(id)
    return id
  }

  #validateBookingId(id) {
    if (!this.#isBookingId(id)) {
      throw new Error('Booking ID is not in registry')
    }
  }

  #isBookingId(id) {
    return this.#bookings.has(id)
  }

  deleteAllBookings() {
    this.#bookings.clear()
  }
}
