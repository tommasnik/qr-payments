import { calculateCzechIBAN } from './spdGenerator'

describe('calculateCzechIBAN', () => {
  it('should calculate IBAN for account 19-2000145399/0800', () => {
    const result = calculateCzechIBAN('19', '2000145399', '0800')

    expect(result).toBe('CZ6508000000192000145399')
  })

  it('should calculate IBAN for account 178124-4159/0710', () => {
    const result = calculateCzechIBAN('178124', '4159', '0710')

    expect(result).toBe('CZ6907101781240000004159')
  })

  it('should calculate IBAN for account without prefix 123456789/0800', () => {
    const result = calculateCzechIBAN('', '123456789', '0800')

    expect(result).toHaveLength(24)
    expect(result).toMatch(/^CZ\d{22}$/)
  })
})
