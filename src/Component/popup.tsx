import './popup.css'

function Popup(){
    return(
        <div className="overlay">
            <div className="modal" role="dialog" aria-modal="true" aria-labelledby="title">
            <button className="close" type="button" aria-label="Tutup">X</button>

            <h1 className="title" id="title">Pembayaran</h1>

            <div className="actions">
                <button className="btn btn--primary" type="button">Bayar</button>
            </div>
            </div>
        </div>
    )
}
export default Popup