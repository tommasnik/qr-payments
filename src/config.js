export const SCHOOL_ACCOUNT = {
  number: '123456789',
  bankCode: '0800',
  
  get full() {
    return `${this.number}/${this.bankCode}`
  }
}
