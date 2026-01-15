import Promo from './Component/Promo/promo.tsx'
import Usage from './Component/Usage/usage.tsx'
import Product from './Component/Product/product.tsx'
import './home.css'

function Homepage(){
    return(
        <section id='homepage'>
            <div className='homepage-container'>
                <Usage />
                <Promo />
                <Product />
            </div>
        </section>
    )
}
export default Homepage