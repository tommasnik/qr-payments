import { useState, useEffect } from 'react'
import { isValidAccountNumber } from '../utils/accountParser'

export function ChildrenSettings({ 
  children, 
  onChildrenChange,
  accountNumber,
  onAccountNumberChange 
}) {
  const [name, setName] = useState('')
  const [variableSymbol, setVariableSymbol] = useState('')
  const [editedAccountNumber, setEditedAccountNumber] = useState(accountNumber)

  useEffect(() => {
    setEditedAccountNumber(accountNumber)
  }, [accountNumber])

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim() || !variableSymbol.trim()) return
    
    const newChild = {
      // randomUUID exists only in a secure context (HTTPS or localhost).
      id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: name.trim(),
      variableSymbol: variableSymbol.trim()
    }
    
    onChildrenChange([...children, newChild])
    setName('')
    setVariableSymbol('')
  }

  const handleRemove = (id) => {
    onChildrenChange(children.filter(child => child.id !== id))
  }

  const isAccountValid = isValidAccountNumber(editedAccountNumber)
  const hasAccountChanged = editedAccountNumber !== accountNumber
  const canSaveAccount = hasAccountChanged && isAccountValid

  const handleSaveAccount = () => {
    if (canSaveAccount) {
      onAccountNumberChange(editedAccountNumber)
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <h2 className="text-xl font-semibold mb-2 text-cyan-400">Nastavení</h2>
      <p className="text-sm text-slate-500 mb-4">
        Všechna data jsou uložena pouze lokálně ve vašem prohlížeči a nikam se neodesílají.
      </p>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Číslo účtu školy
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="např. 2717100083/0800 nebo 86-7058470277/0100"
            value={editedAccountNumber}
            onChange={(e) => setEditedAccountNumber(e.target.value)}
            className={`flex-1 px-4 py-3 bg-slate-900/50 border rounded-xl 
                       focus:outline-none focus:ring-2 focus:border-transparent
                       placeholder-slate-500 transition-all ${
                         editedAccountNumber && !isAccountValid
                           ? 'border-red-500 focus:ring-red-500'
                           : 'border-slate-600 focus:ring-cyan-500'
                       }`}
          />
          <button
            type="button"
            onClick={handleSaveAccount}
            disabled={!canSaveAccount}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 
                       disabled:cursor-not-allowed rounded-xl font-medium transition-colors
                       whitespace-nowrap"
          >
            Uložit
          </button>
        </div>
        {editedAccountNumber && !isAccountValid && (
          <p className="mt-2 text-sm text-red-400">
            Neplatný formát. Použijte formát: číslo/kód nebo prefix-číslo/kód
          </p>
        )}
      </div>

      <h3 className="text-lg font-medium mb-3 text-slate-300">Děti</h3>
      
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Jméno dítěte"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                     placeholder-slate-500 transition-all"
        />
        <input
          type="text"
          placeholder="Variabilní symbol"
          value={variableSymbol}
          onChange={(e) => setVariableSymbol(e.target.value)}
          className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                     placeholder-slate-500 transition-all"
        />
        <button
          type="submit"
          disabled={!name.trim() || !variableSymbol.trim()}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 
                     disabled:cursor-not-allowed rounded-xl font-medium transition-colors
                     whitespace-nowrap"
        >
          Přidat
        </button>
      </form>

      {children.length === 0 ? (
        <p className="text-slate-500 text-center py-4">
          Zatím nemáte přidané žádné děti
        </p>
      ) : (
        <ul className="space-y-2">
          {children.map((child) => (
            <li
              key={child.id}
              className="flex items-center justify-between p-4 bg-slate-900/30 
                         rounded-xl border border-slate-700/30"
            >
              <div>
                <span className="font-medium">{child.name}</span>
                <span className="text-slate-400 ml-3">VS: {child.variableSymbol}</span>
              </div>
              <button
                onClick={() => handleRemove(child.id)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 
                           rounded-lg transition-colors"
                aria-label={`Odebrat ${child.name}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
