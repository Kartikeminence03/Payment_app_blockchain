import React, { useEffect } from 'react'
import Cart from '../../components/cart/Cart'
import './Home.css'
import ContactUs from '../../components/contact/ContactUs';


const Home = () => {
  

  return (
    <>
    <div>
        <section id="home">
            <div className='h2'>
                {/* <h2>Enhance Your Future With TechEduca</h2> */}
            </div>
            <Cart/>
        </section>

        <div>
          <ContactUs/>
        </div>
    </div>
    </>
  )
}

export default Home