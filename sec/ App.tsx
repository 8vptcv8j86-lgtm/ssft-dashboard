import { useState } from 'react'
import Dashboard from './Dashboard'

const STORAGE_KEY = 'ssft_dash_session'

function PasscodeGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const expected = import.meta.env.VITE_DASHBOARD_PASSCODE
    if (expected && code === expected) {
      sessionStorage.setItem(STORAGE_KEY, '1')
      onUnlock()
    } else {
      setError(true)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            St. Croix Operations
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-2 mb-6 tracking-tight">
          South Shore FinTech
        </h1>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
          Access Code
        </label>
        <input
          type="password"
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setError(false)
          }}
          autoFocus
          className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-lg font-mono tracking-widest focus:outline-none focus:border-teal-500 transition-colors"
          placeholder="••••••"
        />
        {error && (
          <p className="text-red-600 text-sm font-medium mt-2">
            Incorrect code. Try again.
          </p>
        )}
        <button
          type="submit"
          className="w-full mt-6 bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors"
        >
          Enter Dashboard
        </button>
        <p className="text-xs text-slate-400 mt-5 leading-relaxed">
          Internal access only. This screen is a basic shared-passcode gate,
          not full authentication — do not use this link for client-facing
          access until real auth is added.
        </p>
      </form>
    </div>
  )
}

export default function App() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === '1',
  )

  if (!unlocked) {
    return <PasscodeGate onUnlock={() => setUnlocked(true)} />
  }

  return <Dashboard />
}
