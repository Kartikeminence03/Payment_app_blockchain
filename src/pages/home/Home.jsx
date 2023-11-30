import React, { useEffect } from 'react'
import Cart from '../../components/cart/Cart'
import './Home.css'
import About from '../about/About'

const Home = () => {
  useEffect(()=>{
    // window.location.reload()
  },[])
  return (
    <>
    <div>
        <section id="home">
            <div className='h2'>
                {/* <h2>Enhance Your Future With TechEduca</h2> */}
            </div>
            <Cart/>
        </section>
        {/* <section className='about_section'>
            <About/>
        </section> */}
    </div>
    </>
  )
}

export default Home