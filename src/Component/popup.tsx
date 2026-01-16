import './popup.css'

type Props = {
  open: boolean
  loading?: boolean
  onClose: () => void
  onPay: () => void
}

export default function Popup({ open, loading = false, onClose, onPay }: Props) {
  if (!open) return null

  return (
    <div className="overlay">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="title">
        <button className="close" type="button" aria-label="Tutup" onClick={onClose}>
          X
        </button>

        <h1 className="title" id="title">Pembayaran</h1>

        <div className="actions">
          <button
            className="btn btn--primary"
            type="button"
            onClick={onPay}
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Bayar'}
          </button>
        </div>
      </div>
    </div>
  )
}
