import '../product.css'

function ChipsBar(){
    return(
        <nav className="chips" aria-label="Kategori paket">
                <button className="chip">
                    Rekomendasi
                </button>

                <button className="chip chip--active">
                    Internet
                </button>

                <button className="chip">
                    Internet + Phone
                </button>

                <button className="chip">
                    Internet + TV
                </button>

                <button className="chip">
                    Internet + TV + Phone
                </button>
        </nav>
    )
}
export default ChipsBar