import { useEffect, useMemo, useState } from 'react'
import './transaction.css'

type AuthUser = {
  id: number
  name: string
  email: string
}

type TxRaw = {
  id: number | string
  userId: number | string
  planId: number | string
  status: string
}

type Tx = {
  id: number
  userId: number
  planId: number
  status: string
}

type PlanRaw = {
  id: number | string
  packageId: string
  name: string
  speed: number | string
  price: number | string
  price_display?: string
}

type Plan = {
  id: number
  packageId: string
  name: string
  speed: number
  price: number
  price_display?: string
}

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:3000'
const AUTH_KEY = 'auth_user'

function readAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthUser
    if (!parsed?.id) return null
    return parsed
  } catch {
    return null
  }
}

async function fetchArray<T>(
  url: string,
  fallbackKey?: string,
  signal?: AbortSignal
): Promise<T[]> {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()

  if (Array.isArray(json)) return json as T[]
  if (fallbackKey && json && Array.isArray((json as any)[fallbackKey])) {
    return (json as any)[fallbackKey] as T[]
  }
  return []
}

function formatRupiah(n: number) {
  return `Rp${n.toLocaleString('id-ID')}`
}

export default function Transaction() {
  const [user, setUser] = useState<AuthUser | null>(() => readAuthUser())
  const [txs, setTxs] = useState<Tx[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // kalau login/logout terjadi, halaman transaksi ikut sync
  useEffect(() => {
    const sync = () => setUser(readAuthUser())
    window.addEventListener('auth:changed', sync as EventListener)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('auth:changed', sync as EventListener)
      window.removeEventListener('storage', sync)
    }
  }, [])

  useEffect(() => {
    if (!user) {
      window.location.hash = '#signin'
      return
    }

    const controller = new AbortController()

    const load = async () => {
      try {
        setLoading(true)
        setError('')

        const [txRaw, planRaw] = await Promise.all([
          fetchArray<TxRaw>(
            `${API_BASE}/transactions?userId=${encodeURIComponent(String(user.id))}`,
            'transactions',
            controller.signal
          ),
          fetchArray<PlanRaw>(`${API_BASE}/plans`, 'plans', controller.signal),
        ])

        const txNorm: Tx[] = txRaw.map((t) => ({
          id: Number(t.id),
          userId: Number(t.userId),
          planId: Number(t.planId),
          status: String(t.status ?? ''),
        }))

        const planNorm: Plan[] = planRaw.map((p) => ({
          id: Number(p.id),
          packageId: String(p.packageId),
          name: String(p.name),
          speed: Number(p.speed),
          price: Number(p.price),
          price_display: p.price_display ? String(p.price_display) : undefined,
        }))

        setTxs(txNorm)
        setPlans(planNorm)
      } catch (e: any) {
        if (e?.name === 'AbortError') return
        setError(e?.message ?? 'Gagal memuat transaksi')
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [user])

  const plansById = useMemo(() => {
    const map = new Map<number, Plan>()
    for (const p of plans) map.set(p.id, p)
    return map
  }, [plans])

  if (!user) return null

  return (
    <div className="page">
      <header className="header">
        <h1 className="header__title">Transaksi</h1>
        <p className="header__subtitle">Daftar transaksi paket yang pernah kamu beli</p>
      </header>

      {loading && <div style={{ padding: 16 }}>Memuat transaksi...</div>}
      {!loading && error && <div style={{ padding: 16 }}>{error}</div>}

      {!loading && !error && (
        <main className="list">
          {txs.length === 0 ? (
            <div style={{ padding: 16 }}>Belum ada transaksi.</div>
          ) : (
            txs.map((tx) => {
              const plan = plansById.get(tx.planId)

                const name = plan?.name ?? 'Paket tidak ditemukan'
                const speed = plan?.speed ?? 0
                const priceText =
                    plan?.price_display ?? (plan ? formatRupiah(plan.price) : '—')

                const statusNorm = (tx.status ?? '').trim().toLowerCase()
                const isUnpaid = statusNorm === 'belum dibayar'
                const statusText =
                    statusNorm === 'selesai'
                    ? 'Selesai'
                    : statusNorm === 'belum dibayar'
                        ? 'Belum Dibayar'
                        : tx.status

                return (
                    <article key={tx.id} className="tx-card">
                    <div className="tx-card__left">
                        <p className="tx-card__name">{name}</p>
                        <p className="tx-card__speed">
                        <strong>{speed ? `${speed} Mbps` : '—'}</strong>
                        </p>
                    </div>

                    <div className={`tx-card__status ${isUnpaid ? 'tx-card__status--danger' : ''}`}>
                        {statusText}
                    </div>

                    <div className="tx-card__price">{priceText}</div>
                    </article>
                )
            })
          )}
        </main>
      )}
    </div>
  )
}
