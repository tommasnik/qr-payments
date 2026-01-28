import { useState } from 'react'

export function PaymentForm({ onGenerate, disabled }) {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) return
    onGenerate({ amount: parsedAmount, note: note.trim() })
  }

  const isValid = amount && parseFloat(amount) > 0

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <h2 className="text-xl font-semibold mb-4 text-emerald-400">Nová platba</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Částka (Kč)</label>
          <input
            type="number"
            placeholder="např. 1500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            step="1"
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                       placeholder-slate-500 transition-all text-2xl font-semibold"
          />
        </div>
        
        <div>
          <label className="block text-sm text-slate-400 mb-2">Poznámka k platbě</label>
          <input
            type="text"
            placeholder="např. Výjezd leden"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                       placeholder-slate-500 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={!isValid || disabled}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 
                     hover:from-emerald-500 hover:to-cyan-500 
                     disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed 
                     rounded-xl font-semibold text-lg transition-all transform hover:scale-[1.02]
                     active:scale-[0.98] shadow-lg shadow-emerald-500/20"
        >
          Vygenerovat QR kódy
        </button>
      </form>
    </div>
  )
}
