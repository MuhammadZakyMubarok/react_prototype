import '../product.css'

function Plan(){
    return(
        <section className="grid" aria-label="Daftar paket">
            <article className="plan">
                <div className="plan__top">
                <div>
                    <p className="plan__name">50 Mbps Internet</p>
                    <p className="plan__speed"><strong>50 Mbps</strong></p>
                </div>
                <div className="plan__price">Rp230.000</div>
                </div>
            </article>

            <article className="plan">
                <div className="plan__top">
                <div>
                    <p className="plan__name">Promo JanTASTIC - 50 Mbps Internet</p>
                    <p className="plan__speed"><strong>50 Mbps</strong></p>
                </div>
                <div className="plan__price">Rp230.000</div>
                </div>
            </article>

            <article className="plan">
                <div className="plan__top">
                <div>
                    <p className="plan__name">50 Mbps Internet + Movie Standard</p>
                    <p className="plan__speed"><strong>50 Mbps</strong></p>
                </div>
                <div className="plan__price">Rp269.000</div>
                </div>
            </article>

            <article className="plan">
                <div className="plan__top">
                <div>
                    <p className="plan__name">50 Mbps Internet + Game</p>
                    <p className="plan__speed"><strong>50 Mbps</strong></p>
                </div>
                <div className="plan__price">Rp290.000</div>
                </div>
            </article>
        </section>
    )
}
export default Plan