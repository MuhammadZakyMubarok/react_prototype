import './usage.css'
import Bill from './Component/bill.tsx'
import Connectivity from './Component/connectivity.tsx'
import Consumption from './Component/consumption.tsx'

function Usage(){
    return(
        <div className="usage-container">
            <div className="usage-info">
                <Connectivity />
                <Consumption />
                <Bill />
            </div>
            <div className="bottom-btn">
                <button>Perbarui Paket</button>
            </div>
        </div>
    )
}
export default Usage