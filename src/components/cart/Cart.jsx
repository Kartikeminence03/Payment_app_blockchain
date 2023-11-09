import React from 'react'
import "./Cart.css"

const style ={
  display: "inline-block",
  position: "relative",
}

const style1 ={
  width: "300px"
}

const style2 ={
  visibility: "hidden",
}

const Cart = () => {
  return (
    <div className='claim-container'>
        <div className='claim-content'>
            <h2 className='claim-title'>
            {"Join the "}
             <span className="gary-bold">$PAY</span>
            {" Presale Now"}
            </h2>
            <div className='select-button-container'>
              <button className="claim-button select-button claim-button-active" scale="md" id="btn-eth"> ETH</button>
              <button className="claim-button select-button" scale="md" id="btn-usdt"> USDT</button>
              <button className="claim-button select-button" scale="md" id="btn-usdc"> USDC</button>
            </div>

            <div className='pay-container'>
              <span className='pay-label'>Pay</span>
              <div style={style}>
                <input scale="md" className="progress-input pay-input" id="pay-input" value="" style={{"visibility":"hidden;"}}/>
              </div>
              <span className="eth-label">USDT</span>
            </div>

            <div className='receive-container'>
              <span className='receive-label'>Receive: </span>
              <div class="progress-input receive-input" style={style1}>0</div>
              {/* <span class="gary-span backcolor">GARYS</span> */}
            </div>


            <button class="claim-button" scale="md" id="claim" disabled="" 
            style={{"margin-top": "40px;"}}>PAY</button>
            <a href='https://global-stg.transak.com/?apikey=8f020938-fd46-4977-bc01-059542dc79b7' 
            // target="_blank"
        rel="noreferrer" class="claim-button" scale="md" id="claim" disabled="" 
            style={{"margin-top": "40px;"}}>Buy To Card</a>

            {/* <div class="equivalence backcolor"><span> 1 GARY = $0.0000001</span></div> */}
        </div>
    </div>
  )
}

export default Cart