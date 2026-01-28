import { parseAccountNumber, formatAccountNumber, isValidAccountNumber } from './accountParser'

describe('parseAccountNumber', () => {
  it('should parse account without prefix', () => {
    const result = parseAccountNumber('2717100083/0800')

    expect(result).toEqual({
      prefix: '',
      number: '2717100083',
      bankCode: '0800'
    })
  })

  it('should parse account with prefix', () => {
    const result = parseAccountNumber('86-7058470277/0100')

    expect(result).toEqual({
      prefix: '86',
      number: '7058470277',
      bankCode: '0100'
    })
  })

  it('should parse account with long prefix', () => {
    const result = parseAccountNumber('178124-4159/0710')

    expect(result).toEqual({
      prefix: '178124',
      number: '4159',
      bankCode: '0710'
    })
  })

  it('should handle whitespace', () => {
    const result = parseAccountNumber('  2717100083/0800  ')

    expect(result).toEqual({
      prefix: '',
      number: '2717100083',
      bankCode: '0800'
    })
  })

  it('should return null for empty string', () => {
    expect(parseAccountNumber('')).toBeNull()
  })

  it('should return null for null input', () => {
    expect(parseAccountNumber(null)).toBeNull()
  })

  it('should return null for undefined input', () => {
    expect(parseAccountNumber(undefined)).toBeNull()
  })

  it('should return null for invalid format - missing bank code', () => {
    expect(parseAccountNumber('2717100083')).toBeNull()
  })

  it('should return null for invalid format - wrong bank code length', () => {
    expect(parseAccountNumber('2717100083/080')).toBeNull()
  })

  it('should return null for invalid format - letters in account', () => {
    expect(parseAccountNumber('271710abc/0800')).toBeNull()
  })
})

describe('formatAccountNumber', () => {
  it('should format account without prefix', () => {
    const result = formatAccountNumber({
      prefix: '',
      number: '2717100083',
      bankCode: '0800'
    })

    expect(result).toBe('2717100083/0800')
  })

  it('should format account with prefix', () => {
    const result = formatAccountNumber({
      prefix: '86',
      number: '7058470277',
      bankCode: '0100'
    })

    expect(result).toBe('86-7058470277/0100')
  })

  it('should return empty string for null', () => {
    expect(formatAccountNumber(null)).toBe('')
  })

  it('should return empty string for undefined', () => {
    expect(formatAccountNumber(undefined)).toBe('')
  })
})

describe('isValidAccountNumber', () => {
  it('should return true for valid account without prefix', () => {
    expect(isValidAccountNumber('2717100083/0800')).toBe(true)
  })

  it('should return true for valid account with prefix', () => {
    expect(isValidAccountNumber('86-7058470277/0100')).toBe(true)
  })

  it('should return false for invalid account', () => {
    expect(isValidAccountNumber('invalid')).toBe(false)
  })

  it('should return false for empty string', () => {
    expect(isValidAccountNumber('')).toBe(false)
  })
})
