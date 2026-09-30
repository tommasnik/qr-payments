import { useState, useEffect } from 'react'
import { useAppConfig } from './hooks/useAppConfig'
import { useUrlPayment } from './hooks/useUrlPayment'
import { ChildrenSettings } from './components/ChildrenSettings'
import { PaymentForm } from './components/PaymentForm'
import { QRCodeCard } from './components/QRCodeCard'
import { createPaymentDetails } from './utils/spdGenerator'
import { isValidAccountNumber } from './utils/accountParser'
import { filterChildrenByNames } from './utils/childrenFilter'

export default function App() {
  const { children, setChildren, accountNumber, setAccountNumber } = useAppConfig()
  const [payments, setPayments] = useState([])
  const [showSettings, setShowSettings] = useState(false)
  const [unmatchedNames, setUnmatchedNames] = useState([])
  const { getUrlPayment, setUrlPayment, clearUrlPayment } = useUrlPayment()

  const generatePayments = (amount, note, addChildName, payingChildren = children) => {
    const newPayments = payingChildren.map((child) => 
      createPaymentDetails({ child, amount, note, accountNumber, addChildName })
    )
    setPayments(newPayments)
  }

  const handleGenerate = ({ amount, note, addChildName }) => {
    setUnmatchedNames([])
    generatePayments(amount, note, addChildName)
    setUrlPayment(amount, note)
  }

  const handleClear = () => {
    setPayments([])
    setUnmatchedNames([])
    clearUrlPayment()
  }

  useEffect(() => {
    if (children.length === 0) return
    
    const urlPayment = getUrlPayment()
    if (urlPayment) {
      const filtered = filterChildrenByNames(children, urlPayment.childNames)
      setUnmatchedNames(filtered.unmatchedNames)
      generatePayments(urlPayment.amount, urlPayment.note, false, filtered.children)
    }
  }, [children.length, accountNumber])

  const hasChildren = children.length > 0
  const hasPayments = payments.length > 0
  const hasValidAccount = isValidAccountNumber(accountNumber)
  const canGenerate = hasChildren && hasValidAccount

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Platby
          </h1>
          <p className="text-slate-400">Generátor QR kódů pro platby</p>
        </header>

        {!hasChildren && !showSettings && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full 
                            bg-slate-800 mb-6">
              <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Začněte přidáním dětí</h2>
            <p className="text-slate-400 mb-6">
              Pro generování QR kódů nejprve nastavte číslo účtu a děti s jejich variabilními symboly
            </p>
            <button
              onClick={() => setShowSettings(true)}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl 
                         font-medium transition-colors"
            >
              Nastavit
            </button>
          </div>
        )}

        {(hasChildren || showSettings) && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showSettings 
                    ? 'bg-slate-700 text-slate-300' 
                    : 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                {showSettings ? 'Skrýt nastavení' : 'Nastavení'}
              </button>
            </div>

            {showSettings ? (
              <ChildrenSettings 
                children={children} 
                onChildrenChange={setChildren}
                accountNumber={accountNumber}
                onAccountNumberChange={setAccountNumber}
              />
            ) : hasChildren && (
              <div className="flex flex-wrap gap-2">
                {children.map((child) => (
                  <span 
                    key={child.id}
                    className="px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 
                               rounded-lg text-slate-300 text-sm"
                  >
                    {child.name}
                  </span>
                ))}
              </div>
            )}

            {hasChildren && !hasPayments && (
              <PaymentForm 
                onGenerate={handleGenerate} 
                disabled={!canGenerate}
                accountNumber={accountNumber}
              />
            )}

            {hasPayments && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Vygenerované QR kódy</h2>
                  <button
                    onClick={handleClear}
                    className="px-4 py-2 text-slate-400 hover:text-slate-200 
                               hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Nová platba
                  </button>
                </div>

                {unmatchedNames.length > 0 && (
                  <p className="px-4 py-3 rounded-xl border border-amber-500/50 bg-amber-500/10 text-amber-300 text-sm">
                    Nenalezené děti: {unmatchedNames.join(', ')}. Zobrazuji QR kódy pro všechny děti.
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {payments.map((payment) => (
                    <QRCodeCard key={payment.child.id} payment={payment} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <footer className="mt-12 text-center text-slate-600 text-sm">
          <p>Data uložena pouze lokálně v prohlížeči</p>
        </footer>
      </div>
    </div>
  )
}
