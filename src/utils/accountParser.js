export function parseAccountNumber(accountString) {
  if (!accountString || typeof accountString !== 'string') {
    return null
  }

  const trimmed = accountString.trim()
  const match = trimmed.match(/^(?:(\d+)-)?(\d+)\/(\d{4})$/)
  
  if (!match) {
    return null
  }

  const [, prefix, number, bankCode] = match
  
  return {
    prefix: prefix || '',
    number,
    bankCode
  }
}

export function formatAccountNumber(account) {
  if (!account) {
    return ''
  }
  
  const prefixPart = account.prefix ? `${account.prefix}-` : ''
  return `${prefixPart}${account.number}/${account.bankCode}`
}

export function isValidAccountNumber(accountString) {
  return parseAccountNumber(accountString) !== null
}
