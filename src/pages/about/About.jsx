import React from 'react'
import transakSDK from "@transak/transak-sdk";

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
  return (
    <div>
        <h1>About</h1>
        <button onClick={() => openTransak()}>
            Buy Crypto
        </button>
    </div>
    
  )
}

export default About