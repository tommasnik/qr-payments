import { parseAccountNumber, formatAccountNumber } from './accountParser'

export function calculateCzechIBAN(prefix, accountNumber, bankCode) {
  const paddedPrefix = prefix.padStart(6, '0')
  const paddedAccount = accountNumber.padStart(10, '0')
  const bban = bankCode + paddedPrefix + paddedAccount
  
  const numericIBAN = bban + '123500'
  
  let remainder = 0
  for (const char of numericIBAN) {
    remainder = (remainder * 10 + parseInt(char, 10)) % 97
  }
  const checkDigits = String(98 - remainder).padStart(2, '0')
  
  return `CZ${checkDigits}${bban}`
}

export function generateSPD({ account, amount, variableSymbol, message }) {
  const iban = calculateCzechIBAN(
    account.prefix || '',
    account.number,
    account.bankCode
  )
  
  const parts = [
    'SPD*1.0',
    `ACC:${iban}`,
    `AM:${amount.toFixed(2)}`,
    'CC:CZK',
    `X-VS:${variableSymbol}`,
  ]
  
  if (message) {
    const sanitizedMessage = message.replace(/\*/g, '').substring(0, 60)
    parts.push(`MSG:${sanitizedMessage}`)
  }
  
  return parts.join('*')
}

export function createPaymentDetails({ child, amount, note, accountNumber }) {
  const message = note ? `${note} - ${child.name}` : child.name
  const account = parseAccountNumber(accountNumber)
  
  if (!account) {
    throw new Error('Invalid account number')
  }
  
  return {
    child,
    amount,
    variableSymbol: child.variableSymbol,
    message,
    account: formatAccountNumber(account),
    spdString: generateSPD({
      account,
      amount,
      variableSymbol: child.variableSymbol,
      message
    })
  }
}
