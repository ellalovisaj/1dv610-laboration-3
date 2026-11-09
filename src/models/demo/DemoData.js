export class DemoData {
  #today = new Date()
  #holidayService
  #bookingService
  #employeeRegistry
  #bookingRegistry

  constructor(holidayService, bookingService, employeeRegistry, bookingRegistry) {
    this.#holidayService = holidayService
    this.#bookingService = bookingService
    this.#employeeRegistry = employeeRegistry
    this.#bookingRegistry = bookingRegistry
  }

  addData() {
    // Employees
    const emil = this.#createEmployee('Emil', '07:00', '16:00', 25)
    const ella = this.#createEmployee('Ella', '13:00', '21:00', 20)
    const arvid = this.#createEmployee('Arvid', '05:00', '12:00', 2)
    const christopher = this.#createEmployee('Christopher', '07:00', '16:00', 45)

    // Next workday
    const nextWorkday = this.#nextWorkday()

    this.#createBooking(christopher, nextWorkday, 'Anders Eriksson', '12:30', '13:00')
    this.#createBooking(emil, nextWorkday, 'Kalle Karlsson', '08:30', '09:30')
    this.#createBooking(ella, nextWorkday, 'Anna Svensson', '15:00', '16:00')
    this.#createBooking(arvid, nextWorkday, 'Erik Larsson', '10:00', '10:30')
  }

  #createEmployee(name, workdayStart, workdayEnd, vacationDaysPerYear) {
    return this.#employeeRegistry.createEmployee(name, workdayStart, workdayEnd, vacationDaysPerYear)
  }

  #nextWorkday() {
    return this.#holidayService.addWorkdays(this.#today, 1)
  }

  #createBooking(employee, customerName, date, start, end) {
    this.#bookingService.newBooking(employee.getResource(), {
      id: '',
      employeeID: employee.getId(),
      type: 'appointment',
      customerName,
      start: `${date}T${start}`,
      end: `${date}T${end}`
    })
  }

  reset() {
    this.#bookingRegistry.deleteAllBookings()
    this.#employeeRegistry.deleteAllEmployees()
  }
}
