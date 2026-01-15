import './popup.css'

function Popup(){
    return(
        <div className="overlay">
            <div className="modal" role="dialog" aria-modal="true" aria-labelledby="title">
            <button className="close" type="button" aria-label="Tutup">x</button>

            <h1 className="title" id="title">Pilih Mekanisme Tagihan</h1>
            <p className="subtitle">Pilih Mekanisme Tagihan yang paling pas untuk Anda</p>

            <div className="list" role="radiogroup" aria-label="Mekanisme tagihan">
                <label className="item">
                <div className="item-left">
                    <div className="period">2 Bulan</div>
                    <div className="price">Rp460.000</div>
                </div>

                <div className="item-right">
                    <input className="radio-input" type="radio" name="billing" />
                    <span className="radio-ui" aria-hidden="true"></span>
                </div>
                </label>

                <label className="item">
                <div className="item-left">
                    <div className="period">7 Bulan</div>
                    <div className="price">Rp1.610.000</div>
                </div>

                <div className="item-right">
                    <input className="radio-input" type="radio" name="billing" />
                    <span className="radio-ui" aria-hidden="true"></span>
                </div>
                </label>

                <label className="item">
                <div className="item-left">
                    <div className="period">15 Bulan</div>
                    <div className="price">Rp3.450.000</div>
                </div>

                <div className="item-right">
                    <input className="radio-input" type="radio" name="billing" />
                    <span className="radio-ui" aria-hidden="true"></span>
                </div>
                </label>
            </div>

            <button className="cta" type="button">Pilih</button>
            </div>
        </div>
    )
}
export default Popup