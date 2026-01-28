export function useUrlPayment() {
  const getUrlPayment = () => {
    const params = new URLSearchParams(window.location.search)
    const amountStr = params.get('amount')
    const note = params.get('note')

    if (!amountStr) {
      return null
    }

    const amount = parseFloat(amountStr)
    if (isNaN(amount) || amount <= 0) {
      return null
    }

    return { amount, note: note || '' }
  }

  const setUrlPayment = (amount, note) => {
    const url = new URL(window.location.href)
    url.searchParams.set('amount', amount.toString())
    if (note) {
      url.searchParams.set('note', note)
    } else {
      url.searchParams.delete('note')
    }
    window.history.replaceState({}, '', url.toString())
  }

  const clearUrlPayment = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete('amount')
    url.searchParams.delete('note')
    window.history.replaceState({}, '', url.toString())
  }

  return { getUrlPayment, setUrlPayment, clearUrlPayment }
}
