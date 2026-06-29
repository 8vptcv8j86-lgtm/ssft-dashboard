import { useEffect, useState } from 'react'

interface ComplianceJob {
  id: string
  manifestNumber: string
  vesselName: string
  riskScore: number
  status: 'CLEAR_TO_LOAD' | 'FLAGGED_SANCTION_RISK' | 'JONES_ACT_VIOLATION'
}

const STATUS_STYLE: Record<
  ComplianceJob['status'],
  { bg: string; text: string; label: string }
> = {
  CLEAR_TO_LOAD: { bg: 'bg-sky-50', text: 'text-teal-600', label: 'Clear to Load' },
  FLAGGED_SANCTION_RISK: { bg: 'bg-amber-50', text: 'text-gold-500', label: 'Sanction Risk' },
  JONES_ACT_VIOLATION: { bg: 'bg-red-50', text: 'text-red-600', label: 'Jones Act Alert' },
}

export default function Dashboard() {
  const [jobs, setJobs] = useState<ComplianceJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: replace with a real fetch to the live /api/v1/compliance/vet feed
    // once the backend is deployed. This is demo data only.
    const mockData: ComplianceJob[] = [
      { id: '1', manifestNumber: 'MNF-2026-A9', vesselName: 'Caribbean Breeze', riskScore: 0, status: 'CLEAR_TO_LOAD' },
      { id: '2', manifestNumber: 'MNF-2026-B2', vesselName: 'Northern Explorer', riskScore: 95.5, status: 'FLAGGED_SANCTION_RISK' },
      { id: '3', manifestNumber: 'MNF-2026-C4', vesselName: 'Atlantic Trader', riskScore: 100, status: 'JONES_ACT_VIOLATION' },
      { id: '4', manifestNumber: 'MNF-2026-D7', vesselName: 'Crucian Pride', riskScore: 0, status: 'CLEAR_TO_LOAD' },
    ]
    const t = setTimeout(() => {
      setJobs(mockData)
      setLoading(false)
    }, 350)
    return () => clearTimeout(t)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <p className="text-slate-500 font-medium">Loading compliance queue…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      {/* Demo data banner */}
      <div className="bg-gold-500 text-slate-900 text-xs font-bold text-center py-2 px-4">
        DEMO DATA — not yet connected to the live compliance API
      </div>

      {/* Header */}
      <div className="bg-slate-900 px-5 pt-6 pb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-teal-500" />
          <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
            Christiansted Operations Center
          </span>
        </div>
        <h1 className="text-xl font-extrabold text-white tracking-tight">
          South Shore FinTech
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">Live maritime compliance queue</p>
      </div>

      {/* Metrics — stacked on mobile, row on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-5 -mt-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Active Queue</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{jobs.length} manifests</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Validated</p>
          <p className="text-2xl font-extrabold text-teal-500 mt-1">99.4%</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Substance Node</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">Active</p>
        </div>
      </div>

      {/* Manifest list — cards on mobile, table on desktop */}
      <div className="px-5 mt-6">
        <h2 className="text-sm font-bold text-slate-900 mb-3">Manifest Feed</h2>

        {/* Mobile cards */}
        <div className="space-y-3 sm:hidden">
          {jobs.map((job) => {
            const style = STATUS_STYLE[job.status]
            return (
              <div key={job.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-sm font-semibold text-slate-900">
                    {job.manifestNumber}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}>
                    {style.label}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{job.vesselName}</p>
                <p className="text-xs text-slate-400 mt-1">Risk score: {job.riskScore.toFixed(2)}%</p>
              </div>
            )
          })}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase bg-slate-50">
                <th className="p-4">Manifest ID</th>
                <th className="p-4">Vessel</th>
                <th className="p-4 text-right">Risk</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => {
                const style = STATUS_STYLE[job.status]
                return (
                  <tr key={job.id} className="border-b border-slate-100">
                    <td className="p-4 font-mono text-sm text-slate-900">{job.manifestNumber}</td>
                    <td className="p-4 text-sm text-slate-700">{job.vesselName}</td>
                    <td className="p-4 text-sm text-right text-slate-600 font-semibold">
                      {job.riskScore.toFixed(2)}%
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${style.bg} ${style.text}`}>
                        {style.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
