import './transaction.css'

function Transaction(){
    return(
        <div className="page">
            <header className="header">
            <h1 className="header__title">Transaksi</h1>
            <p className="header__subtitle">Daftar transaksi paket yang pernah kamu beli</p>
            </header>

            <main className="list">
            <article className="tx-card">
                <div className="tx-card__left">
                <p className="tx-card__name">50 Mbps Internet</p>
                <p className="tx-card__speed"><strong>50 Mbps</strong></p>
                </div>

                <div className="tx-card__status">Selesai</div>
                <div className="tx-card__price">Rp230.000</div>
            </article>

            <article className="tx-card">
                <div className="tx-card__left">
                <p className="tx-card__name">Promo JanTASTIC - 50 Mbps Internet</p>
                <p className="tx-card__speed"><strong>50 Mbps</strong></p>
                </div>

                <div className="tx-card__status">Selesai</div>
                <div className="tx-card__price">Rp230.000</div>
            </article>

            <article className="tx-card">
                <div className="tx-card__left">
                <p className="tx-card__name">50 Mbps Internet + Movie Standard</p>
                <p className="tx-card__speed"><strong>50 Mbps</strong></p>
                </div>

                <div className="tx-card__status">Selesai</div>
                <div className="tx-card__price">Rp269.000</div>
            </article>

            <article className="tx-card">
                <div className="tx-card__left">
                <p className="tx-card__name">50 Mbps Internet + Game</p>
                <p className="tx-card__speed"><strong>50 Mbps</strong></p>
                </div>

                <div className="tx-card__status">Selesai</div>
                <div className="tx-card__price">Rp290.000</div>
            </article>
            </main>
        </div>
    )
}

export default Transaction