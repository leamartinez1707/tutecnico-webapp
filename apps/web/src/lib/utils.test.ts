import { describe, it, expect } from 'vitest'
import { averageRating, formatDate } from '@/lib/utils'
import type { Review } from '@/types'

describe('averageRating', () => {
  const makeReview = (rating: number): Review => ({
    id: 1,
    rating,
    comment: 'test',
    date: '2026-01-01',
    user: {} as Review['user'],
    technician: {} as Review['technician'],
  })

  it('devuelve 0 cuando no hay reviews', () => {
    expect(averageRating([])).toBe(0)
  })

  it('devuelve el rating cuando hay una sola review', () => {
    expect(averageRating([makeReview(4)])).toBe(4)
  })

  it('calcula promedio con un decimal (ej: 4.3)', () => {
    expect(averageRating([makeReview(5), makeReview(4), makeReview(4)])).toBe(4.3)
  })

  it('devuelve 0 si recibe null', () => {
    expect(averageRating(null as unknown as Review[])).toBe(0)
  })

  it('devuelve 0 si recibe undefined', () => {
    expect(averageRating(undefined as unknown as Review[])).toBe(0)
  })

  it('promedio de [5, 5, 5, 4] = 4.8', () => {
    expect(averageRating([makeReview(5), makeReview(5), makeReview(5), makeReview(4)])).toBe(4.8)
  })
})

describe('formatDate', () => {
  it('formatea fecha ISO a español', () => {
    const result = formatDate('2026-01-15T10:00:00.000Z')
    expect(result).toContain('2026')
    expect(result).toContain('15')
  })

  it('maneja string vacío', () => {
    expect(formatDate('')).toContain('Invalid')
  })
})

