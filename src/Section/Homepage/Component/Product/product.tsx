import { useEffect, useMemo, useState } from 'react'
import './product.css'

import ChipsBar from './Component/chipsbar'
import type { PackageItem } from './Component/chipsbar'

import Plan from './Component/plan'
import type { PlanItem } from './Component/plan'

import Popup from '../../../../Component/popup'

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:3000'
const AUTH_KEY = 'auth_user'

type AuthUser = {
  id: number
  name: string
  email: string
}

function readAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

async function fetchArray<T>(url: string, fallbackKey?: string, signal?: AbortSignal): Promise<T[]> {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()

  if (Array.isArray(json)) return json as T[]
  if (fallbackKey && json && Array.isArray((json as any)[fallbackKey])) return (json as any)[fallbackKey] as T[]
  return []
}

async function updateTransactionStatus(txId: number, status: string) {
  // 1) Try PATCH
  const patchRes = await fetch(`${API_BASE}/transactions/${txId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })

  if (patchRes.ok) return

  // 2) Fallback: GET then PUT (lebih kompatibel di beberapa setup)
  const getRes = await fetch(`${API_BASE}/transactions/${txId}`)
  if (!getRes.ok) throw new Error(`GET tx HTTP ${getRes.status}`)
  const current = await getRes.json()

  const putRes = await fetch(`${API_BASE}/transactions/${txId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...current, status }),
  })
  if (!putRes.ok) throw new Error(`PUT tx HTTP ${putRes.status}`)
}


function Product() {
  const [packages, setPackages] = useState<PackageItem[]>([])
  const [plans, setPlans] = useState<PlanItem[]>([])
  const [activePackageId, setActivePackageId] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // auth + popup state
  const [user, setUser] = useState<AuthUser | null>(() => readAuthUser())
  const [popupOpen, setPopupOpen] = useState(false)
  const [txId, setTxId] = useState<number | null>(null)
  const [payLoading, setPayLoading] = useState(false)
  const [txCreating, setTxCreating] = useState(false)

  // sync auth
  useEffect(() => {
    const sync = () => setUser(readAuthUser())
    window.addEventListener('auth:changed', sync as EventListener)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('auth:changed', sync as EventListener)
      window.removeEventListener('storage', sync)
    }
  }, [])

  // load packages & plans
  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      try {
        setLoading(true)
        setError('')

        const [pkgRaw, planRaw] = await Promise.all([
          fetchArray<any>(`${API_BASE}/packages`, 'packages', controller.signal),
          fetchArray<any>(`${API_BASE}/plans`, 'plans', controller.signal),
        ])

        const pkgNorm: PackageItem[] = pkgRaw.map((p: any) => ({
          id: String(p.id),
          name: String(p.name),
        }))

        const planNorm: PlanItem[] = planRaw.map((p: any) => ({
          id: Number(p.id),
          packageId: String(p.packageId),
          name: String(p.name),
          speed: Number(p.speed),
          price: Number(p.price),
          price_display: p.price_display ? String(p.price_display) : undefined,
        }))

        setPackages(pkgNorm)
        setPlans(planNorm)
        setActivePackageId((prev) => prev ?? (pkgNorm[0]?.id ?? null))
      } catch (e: any) {
        if (e?.name === 'AbortError') return
        setError(e?.message ?? 'Gagal mengambil data')
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [])

  const filteredPlans = useMemo(() => {
    if (!activePackageId) return []
    return plans.filter((p) => p.packageId === activePackageId)
  }, [plans, activePackageId])

  const createTransaction = async (userId: number, planId: number) => {
    // cari max id dulu supaya bisa set id manual (sesuai permintaan)
    const existing = await fetchArray<any>(`${API_BASE}/transactions`, 'transactions')
    const maxId = existing.reduce((m: number, t: any) => {
      const v = Number(t?.id)
      return Number.isFinite(v) ? Math.max(m, v) : m
    }, 0)

    const newTx = {
      id: maxId + 1,
      userId,
      planId,
      status: 'Belum Dibayar',
    }

    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTx),
    })

    if (!res.ok) throw new Error(`Create tx HTTP ${res.status}`)
    const created = await res.json()
    return Number(created?.id ?? newTx.id)
  }

  const handleSelectPlan = async (plan: PlanItem) => {
    // belum login -> ke signin
    if (!user) {
      window.location.hash = '#signin'
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (txCreating) return
    setTxCreating(true)

    try {
      const newId = await createTransaction(user.id, plan.id)
      setTxId(newId)
      setPopupOpen(true)
    } catch (e) {
      console.error(e)
      // simpel: biar user tahu ada masalah
      alert('Gagal membuat transaksi. Coba lagi.')
    } finally {
      setTxCreating(false)
    }
  }

  const handleClosePopup = () => {
    setPopupOpen(false)
    setPayLoading(false)
    setTxId(null)
  }

  const handlePay = async () => {
    if (!txId) return

    setPayLoading(true)
    try {
        await updateTransactionStatus(txId, 'Selesai')

        // refresh data transaksi (kalau halaman transaksi sedang terbuka)
        window.dispatchEvent(new Event('tx:changed'))

        // tutup popup dulu
        handleClosePopup()

        // lalu arahkan ke halaman transaksi
        window.location.hash = '#transaksi'
        window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {
        console.error(e)
        alert('Gagal memproses pembayaran. Coba lagi.')
        setPayLoading(false)
    }
    }


  return (
    <div className="product">
      <aside className="sidebar">
        <div className="panel">
          <h2 className="panel__title">Filter Paket</h2>
          <section className="card">
            <h3 className="card__title">Harga</h3>

            <label className="option">
              <span className="option__text">Rp100.000-Rp299.999</span>
              <input type="radio" name="harga" disabled />
              <span className="control control--radio" aria-hidden="true"></span>
            </label>

            <label className="option">
              <span className="option__text">Rp300.000-499.999</span>
              <input type="radio" name="harga" disabled />
              <span className="control control--radio" aria-hidden="true"></span>
            </label>

            <label className="option">
              <span className="option__text">Rp500.000-Rp1.000.000</span>
              <input type="radio" name="harga" disabled />
              <span className="control control--radio" aria-hidden="true"></span>
            </label>

            <label className="option">
              <span className="option__text">&gt;Rp1.000.000</span>
              <input type="radio" name="harga" disabled />
              <span className="control control--radio" aria-hidden="true"></span>
            </label>
          </section>

          <section className="card">
            <h3 className="card__title">Kecepatan</h3>

            <label className="option option--divider">
              <span className="option__text">50 Mbps</span>
              <input type="checkbox" disabled />
              <span className="control control--check" aria-hidden="true"></span>
            </label>

            <label className="option option--divider">
              <span className="option__text">75 Mbps</span>
              <input type="checkbox" disabled />
              <span className="control control--check" aria-hidden="true"></span>
            </label>

            <label className="option option--divider">
              <span className="option__text">150 Mbps</span>
              <input type="checkbox" disabled />
              <span className="control control--check" aria-hidden="true"></span>
            </label>

            <label className="option">
              <span className="option__text">200 Mbps</span>
              <input type="checkbox" disabled />
              <span className="control control--check" aria-hidden="true"></span>
            </label>
          </section>
        </div>
      </aside>

      <main className="content">
        <header className="content__header">
          <div className="heading">
            <h1 className="heading__title">Pilihan Paket</h1>
          </div>
        </header>

        <ChipsBar packages={packages} activePackageId={activePackageId} onSelect={setActivePackageId} />

        <Plan
          plans={filteredPlans}
          loading={loading}
          error={error}
          onSelectPlan={handleSelectPlan}
        />

        <Popup
          open={popupOpen}
          loading={payLoading}
          onClose={handleClosePopup}
          onPay={handlePay}
        />
      </main>
    </div>
  )
}

export default Product
