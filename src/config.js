export const SCHOOL_ACCOUNT = {
  prefix: '',
  number: '2401685636',
  bankCode: '2010',
  
  get full() {
    const prefixPart = this.prefix ? `${this.prefix}-` : ''
    return `${prefixPart}${this.number}/${this.bankCode}`
  }
}
