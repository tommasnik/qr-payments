export const SCHOOL_ACCOUNT = {
  prefix: '',
  number: '123456789',
  bankCode: '0800',
  
  get full() {
    const prefixPart = this.prefix ? `${this.prefix}-` : ''
    return `${prefixPart}${this.number}/${this.bankCode}`
  }
}
