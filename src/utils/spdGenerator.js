import { SCHOOL_ACCOUNT } from '../config'

function calculateCzechIBAN(accountNumber, bankCode) {
  const paddedAccount = accountNumber.padStart(16, '0')
  const bban = bankCode + paddedAccount
  
  const numericIBAN = bban + '123500'
  
  let remainder = 0
  for (const char of numericIBAN) {
    remainder = (remainder * 10 + parseInt(char, 10)) % 97
  }
  const checkDigits = String(98 - remainder).padStart(2, '0')
  
  return `CZ${checkDigits}${bban}`
}

export function generateSPD({ amount, variableSymbol, message }) {
  const iban = calculateCzechIBAN(SCHOOL_ACCOUNT.number, SCHOOL_ACCOUNT.bankCode)
  
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

export function createPaymentDetails({ child, amount, note }) {
  const message = note ? `${note} - ${child.name}` : child.name
  
  return {
    child,
    amount,
    variableSymbol: child.variableSymbol,
    message,
    account: SCHOOL_ACCOUNT.full,
    spdString: generateSPD({
      amount,
      variableSymbol: child.variableSymbol,
      message
    })
  }
}
