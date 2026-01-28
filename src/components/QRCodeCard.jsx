import { useRef, useCallback } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export function QRCodeCard({ payment }) {
  const containerRef = useRef(null)

  const handleDownload = useCallback(() => {
    const canvas = containerRef.current?.querySelector('canvas')
    if (!canvas) return
    
    const link = document.createElement('a')
    link.download = `platba-${payment.child.name.toLowerCase().replace(/\s+/g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [payment.child.name])

  const handleShare = useCallback(async () => {
    const canvas = containerRef.current?.querySelector('canvas')
    if (!canvas) return

    try {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
      const file = new File([blob], `platba-${payment.child.name}.png`, { type: 'image/png' })
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Platba - ${payment.child.name}`,
          text: `${payment.amount} Kč - ${payment.message}`
        })
      } else {
        handleDownload()
      }
    } catch {
      handleDownload()
    }
  }, [payment, handleDownload])

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50
                    flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-4 text-amber-400">{payment.child.name}</h3>
      
      <div ref={containerRef} className="bg-white p-4 rounded-xl mb-4">
        <QRCodeCanvas
          value={payment.spdString}
          size={200}
          level="M"
          marginSize={1}
        />
      </div>

      <div className="w-full space-y-2 text-sm mb-4">
        <div className="flex justify-between py-2 border-b border-slate-700/50">
          <span className="text-slate-400">Částka:</span>
          <span className="font-semibold text-emerald-400">{payment.amount} Kč</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-700/50">
          <span className="text-slate-400">Účet:</span>
          <span className="font-mono">{payment.account}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-700/50">
          <span className="text-slate-400">VS:</span>
          <span className="font-mono">{payment.variableSymbol}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-slate-400">Zpráva:</span>
          <span className="text-right max-w-[60%]">{payment.message}</span>
        </div>
      </div>

      <div className="flex gap-2 w-full">
        <button
          onClick={handleDownload}
          className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 rounded-xl 
                     font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Stáhnout
        </button>
        <button
          onClick={handleShare}
          className="flex-1 py-3 px-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl 
                     font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Sdílet
        </button>
      </div>
    </div>
  )
}
