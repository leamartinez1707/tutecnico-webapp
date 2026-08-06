import { describe, it, expect } from 'vitest'
import { capitalizeFirstLetter } from '@/utils'

describe('capitalizeFirstLetter', () => {
  it('capitaliza primera letra', () => {
    expect(capitalizeFirstLetter('hola')).toBe('Hola')
  })

  it('no cambia si ya está capitalizado', () => {
    expect(capitalizeFirstLetter('Hola')).toBe('Hola')
  })

  it('maneja string vacío', () => {
    expect(capitalizeFirstLetter('')).toBe('')
  })
})
