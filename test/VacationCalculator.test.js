import { describe, test, expect } from 'vitest'
import { VacationCalculator } from '../src/models/vacation/VacationCalculator.js'
import { HolidayService } from '../src/models/calendar/HolidayService.js'

describe('VacationCalculator', () => {
  const calculator = new VacationCalculator(new HolidayService())

  describe('calculateVacationPeriod', () => {
    test('should count the start date when it is a workday', () => {
      const result = calculator.calculateVacationPeriod({ startDate: '2026-11-05', vacationDayCount: 2 })

      expect(result.lastDay).toBe('2026-11-06')
      expect(result.backAtWork).toBe('2026-11-09')
    })

    test('should start on the next workday when the start date is a weekend', () => {
      const result = calculator.calculateVacationPeriod({ startDate: '2026-11-07', vacationDayCount: 2 })

      expect(result.lastDay).toBe('2026-11-10')
      expect(result.backAtWork).toBe('2026-11-11')
    })

    test('should start on the next workday when the start date is a holiday', () => {
      const result = calculator.calculateVacationPeriod({ startDate: '2026-06-06', vacationDayCount: 1 })

      expect(result.lastDay).toBe('2026-06-08')
      expect(result.backAtWork).toBe('2026-06-09')
    })

    test('should return the start date as the last day for one vacation day', () => {
      const result = calculator.calculateVacationPeriod({ startDate: '2026-11-05', vacationDayCount: 1 })

      expect(result.lastDay).toBe('2026-11-05')
      expect(result.backAtWork).toBe('2026-11-06')
    })

    test('should skip weekends in the middle of the vacation', () => {
      const result = calculator.calculateVacationPeriod({ startDate: '2026-11-02', vacationDayCount: 10 })

      expect(result.lastDay).toBe('2026-11-13')
      expect(result.backAtWork).toBe('2026-11-16')
    })

    test('should skip holidays in the middle of the vacation', () => {
      const result = calculator.calculateVacationPeriod({ startDate: '2026-12-23', vacationDayCount: 3 })

      expect(result.lastDay).toBe('2026-12-28')
      expect(result.backAtWork).toBe('2026-12-29')
    })

    test('should skip a holiday on the day after the vacation', () => {
      const result = calculator.calculateVacationPeriod({ startDate: '2026-12-23', vacationDayCount: 2 })

      expect(result.lastDay).toBe('2026-12-24')
      expect(result.backAtWork).toBe('2026-12-28')
    })

    test('should handle a vacation into the next year', () => {
      const result = calculator.calculateVacationPeriod({ startDate: '2026-12-28', vacationDayCount: 5 })

      expect(result.lastDay).toBe('2027-01-04')
      expect(result.backAtWork).toBe('2027-01-05')
    })

    test('should handle a full summer vacation of 25 days', () => {
      const result = calculator.calculateVacationPeriod({ startDate: '2026-06-29', vacationDayCount: 25 })

      expect(result.lastDay).toBe('2026-07-31')
      expect(result.backAtWork).toBe('2026-08-03')
    })

    test('should return the given start date unchanged', () => {
      const result = calculator.calculateVacationPeriod({ startDate: '2026-11-07', vacationDayCount: 2 })

      expect(result.startDate).toBe('2026-11-07')
    })

    test('should throw error when the number of vacation days is 0', () => {
      expect(() => calculator.calculateVacationPeriod({ startDate: '2026-11-05', vacationDayCount: 0 })).toThrow()
    })

    test('should throw error when the start date is invalid', () => {
      expect(() => calculator.calculateVacationPeriod({ startDate: '2026-02-30', vacationDayCount: 2 })).toThrow()
    })
  })
})