import { useEffect, useMemo, useState } from 'react'
import './product.css'

import ChipsBar from './Component/chipsbar'
import type { PackageItem } from './Component/chipsbar'

import Plan from './Component/plan'
import type { PlanItem } from './Component/plan'

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:3000'

async function fetchArray<T>(url: string, fallbackKey?: string, signal?: AbortSignal): Promise<T[]> {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()

  if (Array.isArray(json)) return json as T[]
  if (fallbackKey && json && Array.isArray((json as any)[fallbackKey])) return (json as any)[fallbackKey] as T[]
  return []
}

function Product() {
  const [packages, setPackages] = useState<PackageItem[]>([])
  const [plans, setPlans] = useState<PlanItem[]>([])
  const [activePackageId, setActivePackageId] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

        // normalisasi id -> string (biar aman dari number/string mismatch)
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

        <ChipsBar
          packages={packages}
          activePackageId={activePackageId}
          onSelect={setActivePackageId}
        />

        <Plan plans={filteredPlans} loading={loading} error={error} />
      </main>
    </div>
  )
}

export default Product
