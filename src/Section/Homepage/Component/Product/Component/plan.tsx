import '../product.css'

export type PlanItem = {
  id: number
  packageId: string
  name: string
  speed: number
  price: number
  price_display?: string
}

function formatRupiah(n: number) {
  return `Rp${n.toLocaleString('id-ID')}`
}

type Props = {
  plans: PlanItem[]
  loading: boolean
  error: string
}

export default function Plan({ plans, loading, error }: Props) {
  if (loading) {
    return (
      <section className="grid" aria-label="Daftar paket">
        <article className="plan">
          <div className="plan__top">
            <div>
              <p className="plan__name">Memuat paket...</p>
              <p className="plan__speed"><strong>—</strong></p>
            </div>
            <div className="plan__price">—</div>
          </div>
        </article>
      </section>
    )
  }

  if (error) {
    return (
      <section className="grid" aria-label="Daftar paket">
        <article className="plan">
          <div className="plan__top">
            <div>
              <p className="plan__name">Gagal memuat data</p>
              <p className="plan__speed"><strong>{error}</strong></p>
            </div>
            <div className="plan__price">—</div>
          </div>
        </article>
      </section>
    )
  }

  if (plans.length === 0) {
    return (
      <section className="grid" aria-label="Daftar paket">
        <article className="plan">
          <div className="plan__top">
            <div>
              <p className="plan__name">Tidak ada paket di kategori ini</p>
              <p className="plan__speed"><strong>—</strong></p>
            </div>
            <div className="plan__price">—</div>
          </div>
        </article>
      </section>
    )
  }

  return (
    <section className="grid" aria-label="Daftar paket">
      {plans.map((p) => (
        <article key={p.id} className="plan">
          <div className="plan__top">
            <div>
              <p className="plan__name">{p.name}</p>
              <p className="plan__speed"><strong>{p.speed} Mbps</strong></p>
            </div>
            <div className="plan__price">{p.price_display ?? formatRupiah(p.price)}</div>
          </div>
        </article>
      ))}
    </section>
  )
}
