import './product.css'
import ChipsBar from './Component/chipsbar'
import Plan from './Component/plan'

function Product(){
    return(
        <div className="product">
            <aside className="sidebar">
                <div className="panel">
                <h2 className="panel__title">Filter Paket</h2>

                <section className="card">
                    <h3 className="card__title">Harga</h3>

                    <label className="option">
                    <span className="option__text">Rp100.000-Rp299.999</span>
                    <input type="radio" name="harga" />
                    <span className="control control--radio" aria-hidden="true"></span>
                    </label>

                    <label className="option">
                    <span className="option__text">Rp300.000-499.999</span>
                    <input type="radio" name="harga" />
                    <span className="control control--radio" aria-hidden="true"></span>
                    </label>

                    <label className="option">
                    <span className="option__text">Rp500.000-Rp1.000.000</span>
                    <input type="radio" name="harga" />
                    <span className="control control--radio" aria-hidden="true"></span>
                    </label>

                    <label className="option">
                    <span className="option__text">&gt;Rp1.000.000</span>
                    <input type="radio" name="harga" />
                    <span className="control control--radio" aria-hidden="true"></span>
                    </label>
                </section>

                <section className="card">
                    <h3 className="card__title">Kecepatan</h3>

                    <label className="option option--divider">
                    <span className="option__text">50 Mbps</span>
                    <input type="checkbox" />
                    <span className="control control--check" aria-hidden="true"></span>
                    </label>

                    <label className="option option--divider">
                    <span className="option__text">75 Mbps</span>
                    <input type="checkbox" />
                    <span className="control control--check" aria-hidden="true"></span>
                    </label>

                    <label className="option option--divider">
                    <span className="option__text">150 Mbps</span>
                    <input type="checkbox" />
                    <span className="control control--check" aria-hidden="true"></span>
                    </label>

                    <label className="option">
                    <span className="option__text">200 Mbps</span>
                    <input type="checkbox" />
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

                <ChipsBar />

                <Plan />
            </main>
        </div>
    )
}
export default Product