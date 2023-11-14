import React, { useState } from 'react'
import "./Cart.css"
import {loadStripe} from '@stripe/stripe-js';
import axios from 'axios';

const style ={
  display: "inline-block",
  position: "relative",
}

const style1 ={
  width: "300px"
}

const Cart = () => {
  const [payInput, setPayInput] = useState();
  const [tokenETH,setTokenETH] = useState()

  const payinput_inNum = parseInt(payInput);

  const payment_fun = (event)=>{
    setPayInput(event.target.value)
    setTokenETH(payinput_inNum/8)
  };

  // console.log({tokenPrice:payinput_inNum, toETH:tokenETH},">>>>>>>>>>>>>>>")

  const eth = [{tokenPrice:payinput_inNum, toETH:tokenETH, quant:2}]

  const makePayment = async ()=>{
    const stripe = await loadStripe('pk_test_51OApPrSGgPa6DtpSCUQ5tquKu3RnLcSPhGeTWhBvzpSgdJoj67mdMv4TelETIwZDdxsrNSp6wIkvE8IryaiL5S2X00yxZBBmLS');

  const response = await axios.post("http://localhost:7000/api/create-checkout-session",{products:eth});

  const session = await response.data;

  const result = stripe.redirectToCheckout({
      sessionId:session.id
  });
  
  if(result.error){
      console.log(result.error);
  }
  };
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
                <input 
                scale="md" 
                className="progress-input pay-input" 
                id="pay-input" 
                onChange={payment_fun}
                value={payInput} 
                style={{"visibility":"hidden;"}}/>
              </div>
              <span className="eth-label">USDT</span>
            </div>

            <div className='receive-container'>
              <span className='receive-label'>Receive: </span>
              <div class="progress-input receive-input" style={style1}>ETH: {!payInput?0:tokenETH}</div>
              {/* <span class="gary-span backcolor">GARYS</span> */}
            </div>


            <button class="claim-button" scale="md" id="claim" disabled="" 
            style={{"margin-top": "40px;"}}>PAY</button>
            {/* <a href='https://global-stg.transak.com/?apikey=8f020938-fd46-4977-bc01-059542dc79b7' 
            // target="_blank"
            rel="noreferrer" class="claim-button" scale="md" id="claim" disabled="" 
            style={{"margin-top": "40px;"}}>Buy To Card</a> */}

            <button class="claim-button" scale="md" id="claim" disabled="" 
            style={{"margin-top": "40px;"}} onClick={()=>makePayment()}>Buy With Card ST</button>

            {/* <div class="equivalence backcolor"><span> 1 GARY = $0.0000001</span></div> */}
        </div>
    </div>
  )
}

export default Cart