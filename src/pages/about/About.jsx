import React, { useState } from 'react'
import transakSDK from "@transak/transak-sdk";
import '../../components/cart/Cart.css'
import { baseUrl } from '../../backend_Url/baseUrl';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const style ={
    display: "inline-block",
    position: "relative",
  }

const settings = {
    apiKey: '4fcd6904-706b-4aff-bd9d-77422813bbb7',  // Your API Key
    environment: 'STAGING', // STAGING/PRODUCTION
    defaultCryptoCurrency: 'ETH',
    themeColor: '000000', // App theme color
    hostURL: window.location.origin,
    widgetHeight: "500px",
    widgetWidth: "500px",
}

export function openTransak() {
    const transak = new transakSDK(settings);

    transak.init();

    // To get all the events
    transak.on(transak.ALL_EVENTS, (data) => {
        console.log(data)
    });

    // This will trigger when the user closed the widget
    transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (eventData) => {
        console.log(eventData);
        transak.close();
    });

    // This will trigger when the user marks payment is made.
    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
        console.log(orderData);
        window.alert("Payment Success")
        transak.close();
    });
}

const About = () => {
    const [reEmail,setReEmail] = useState("");
    const navigate = useNavigate();

    function reInput (){
        const inputEmail = document.getElementById("pay-input").value;
        setReEmail(inputEmail)
    }
    
    const refundPayment = async()=>{
        try {
            const response = await axios.post(`${baseUrl}refundPayment-fiat`,{userEmail:reEmail});
            const re = await response.data
            console.log(re.refund.status);
            toast.success(re.refund.status)
            setReEmail('')
            navigate('/')

        return response.data
        } catch (error) {
            const err = error.response.data.error
            toast.error(err)
            // console.log(error.response.data.error);
        }
    }
  return (
    <div>
        <h1>About</h1>
        <button onClick={() => openTransak()}>
            Buy Crypto
        </button>

        <div className='claim-container'>
            <div className='claim-content'>
                <h2>Refund</h2>
                <div className='pay-container'>
              <span className='pay-label1'>Your Email ID</span>
              <div style={style}>
                <input 
                scale="md" 
                className="progress-input pay-input" 
                id="pay-input" 
                onChange={reInput}
                type='email'
                value={reEmail}
                required
                style={{"visibility":"hidden;"}}/>
              </div>
            </div>
            <button className="claim-button" scale="md" id="claim" 
            style={{"margin-top": "40px;"}} onClick={()=>refundPayment()}>Refund Fiat Payment</button>
            </div>
        </div>
    </div>
    
  )
}

export default About