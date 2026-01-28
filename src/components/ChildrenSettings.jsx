import { useState } from 'react'

export function ChildrenSettings({ children, onChildrenChange }) {
  const [name, setName] = useState('')
  const [variableSymbol, setVariableSymbol] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim() || !variableSymbol.trim()) return
    
    const newChild = {
      id: crypto.randomUUID(),
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

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <h2 className="text-xl font-semibold mb-4 text-cyan-400">Nastavení dětí</h2>
      
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
