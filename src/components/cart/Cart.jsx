import React from 'react'
import "./Cart.css"
// import CartTime from './CartTime'

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
            {/* <h4>Stage 1</h4>
            <div className='timer-container'>
              <div className='ends'>Ends in:</div>
              <div className='timer-content'>
                <CartTime duration={24*24*60*60*1000}/>
              </div>
            </div> */}

            {/* <div className='you-have-container'>
              <span color="text" className="you-have-label"> You Have: </span>
              <div className="progress-input you-have-input" >0</div>
              <span className="gary-text gary-span">$GARYS</span>
            </div> */}

            {/* <div className="select-text backcolor">Select with which token/coin do you want to buy:</div> */}
            <div className='select-button-container'>
              <button className="claim-button select-button claim-button-active" scale="md" id="btn-eth"> ETH</button>
              <button className="claim-button select-button" scale="md" id="btn-usdt"> USDT</button>
              <button className="claim-button select-button" scale="md" id="btn-usdc"> USDC</button>
            </div>

            <div className='pay-container'>
              <span className='pay-label'>Pay</span>
              <div style={style}>
                <input scale="md" className="progress-input pay-input" id="pay-input" value="" style={style1}/>
                <span className="max-button" style={style2}>Max</span>
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

            {/* <div class="equivalence backcolor"><span> 1 GARY = $0.0000001</span></div> */}
        </div>
    </div>
  )
}

export default Cart