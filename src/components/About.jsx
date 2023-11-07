import React from 'react'
import '../pages/home/Home.css'

const About = () => {
  return (
    <>
    <section id="about-container">
        <div class="about-img">
            <img src="https://garycoin.io/static/media/whatisgarycoin.dd4188b5efe2d413feaf.jpg"/>
        </div>

        <div class="about-text">
            <h2>Welcom to TechEduca, Enhance your skills with best Online Courses</h2>
            <p>You can start and finish one of these popular courses in under a day - for
                free| Check out the list below.. Take the course for free
            </p>

        </div>
    </section>

    {/* ====================================================== */}
    <section id="about-containers">
        <div class="about-texts">
            <h2>Welcom to TechEduca, Enhance your skills with best Online Courses</h2>
            <p>You can start and finish one of these popular courses in under a day - for
                free| Check out the list below.. Take the course for free
            </p>

        </div>

        <div class="about-imgs">
            <img src="https://garycoin.io/static/media/presale_airdrop.054e95dca86871bafb47.png"/>
        </div>
    </section>
    </>
  )
}

export default About