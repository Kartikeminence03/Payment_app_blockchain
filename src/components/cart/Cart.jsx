import React, { useEffect, useState } from 'react'
import "./Cart.css"
import {loadStripe} from '@stripe/stripe-js';
import axios from 'axios';
import { ethers } from 'ethers'
import { baseUrl } from '../../backend_Url/baseUrl';
import digiSoul from '../../abi/DigiSoul.json';
import tokenPresale from '../../abi/TokenPreSale.json';
import usdtAbi from '../../abi/usdt.json';
import usdcAbi from '../../abi/usdc.json'

const style ={
  display: "inline-block",
  position: "relative",
}

const style1 ={
  width: "300px"
}

const Cart = () => {
  const [provider, setProvider] = useState(null)
  const [payInput, setPayInput] = useState("");
  const [tokenETH,setTokenETH] = useState();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [account, setAccount] = useState("");
  const [refundToken, setRefundToken] = useState("");
  const [claimToken, setClaimToken] = useState("");
  const [metaAccount, setMetaAccount] = useState(null);
  const [currencys, setCurrencys] = useState("ETH");

  const tokenPresaleaddress = process.env.REACT_APP_TOKENPRESALEADDRESS;
  // const inputpay = document.getElementById("pay-input").value;
  // const payinput_inNum = 1;
  // const payDsoulETH = payinput_inNum*10**18;
  // const payDsoulUSDT = payinput_inNum*10**6;
  // console.log(typeof payinput_inNum)

  const loadBlockchainData = async()=>{
    const provider = new ethers.BrowserProvider(window.ethereum);
    // console.log(await provider?.getSigner(),"-----.....>>>>>>>>>");
    setProvider(provider);
    // const network = await provider.getNetwork();
    // console.log('provider', network.name);
    // setTokenYouGet(tokenYouGetInNum)


    // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    // const account = ethers.getAddress(accounts[0])
    // setMetaAccount(account)
  }
  


  const ethToken = async ()=>{
    try{
      const signer = await provider.getSigner();
      const inputpay = document.getElementById("pay-input").value;
      const payDsoulETH = Number(inputpay)*10**18;
      // console.log("ETH");
      const tokenPresaleContract = new ethers.Contract(tokenPresaleaddress, tokenPresale.abi, provider)
      const tokenPresaleContractWithSigner = tokenPresaleContract.connect(signer);
      const RecieveTokens = await tokenPresaleContractWithSigner.getTokenAmountForEth(payDsoulETH.toString());
      const recieveToken_inNum = parseInt(RecieveTokens)
      const RecieveTokens1 = recieveToken_inNum/10**18;
      setTokenETH( RecieveTokens1);
    } catch(err) {
      console.log(err);
    }


  };

  const usdtToken =async ()=>{
    // console.log("USDT");
    const signer = await provider.getSigner();
    const inputpay = document.getElementById("pay-input").value;
    const payDsoulUSDT = Number(inputpay*10**6)
    const tokenPresaleContract = new ethers.Contract(tokenPresaleaddress, tokenPresale.abi, provider)
    const tokenPresaleContractWithSigner = tokenPresaleContract.connect(signer);
    const RecieveTokens = await tokenPresaleContractWithSigner.getTokenAmountForUsdt(payDsoulUSDT.toString());
    setTokenETH(Number(RecieveTokens)/10**18);
  };


  const usdcToken = async()=>{
    // console.log("USDC");
    const signer = await provider.getSigner();
    const inputpay = document.getElementById("pay-input").value;
    const payDsoulUSDT = Number(inputpay*10**6)
    const tokenPresaleContract = new ethers.Contract(tokenPresaleaddress, tokenPresale.abi, provider)
    const tokenPresaleContractWithSigner = tokenPresaleContract.connect(signer);
    const RecieveTokens = await tokenPresaleContractWithSigner.getTokenAmountForUsdc(payDsoulUSDT.toString());
    setTokenETH(Number(RecieveTokens)/10**18);
  };



  const payWithETH = async ()=>{
    try {
      console.log("Eth");
    const signer = await provider.getSigner();
    const inputpay = document.getElementById("pay-input").value;
    const payDsoulETH = Number(inputpay)*10**18;
    const tokenPresaleContract = new ethers.Contract(tokenPresaleaddress, tokenPresale.abi, provider);
    const tokenPresaleContractWithSigner = tokenPresaleContract.connect(signer);
    const buy =  await tokenPresaleContractWithSigner.buyWithEth({value: payDsoulETH.toString()});
    const buyReciept = await buy.wait();
    } catch (error) {
      console.log(error)
    }
  };

  const payWithUSDT = async ()=>{
    console.log("USDT");
    try {
      const signer = await provider.getSigner();
    const inputpay = document.getElementById("pay-input").value;
    const payDsoulUSDT = Number(inputpay*10**6)
    const tokenPresaleContract = new ethers.Contract(tokenPresaleaddress, tokenPresale.abi, provider);
    const tokenPresaleContractWithSigner = tokenPresaleContract.connect(signer);
    const usdtContract = new ethers.Contract(process.env.REACT_APP_USDTALLOWANCE,usdtAbi, provider);
    const usdtContractWithSigner = usdtContract.connect(signer);

    let usdtAllowanceToPresale = await usdtContractWithSigner.allowance(signer.address, tokenPresaleaddress);

    if (usdtAllowanceToPresale < payDsoulUSDT) {
      const approve = await usdtContractWithSigner.approve(tokenPresaleaddress, payDsoulUSDT - Number(usdtAllowanceToPresale))
      const approveReceipt = await approve.wait();
    }

    usdtAllowanceToPresale = await usdtContractWithSigner.allowance(signer.address, tokenPresaleaddress);

    const buy = await tokenPresaleContractWithSigner.buyWithUsdt(payDsoulUSDT);
    const buyReciept = await buy.wait();
    } catch (error) {
      console.log(error)
    }
  };

  const payWithUSDC = async ()=>{
    try {
      const signer = await provider.getSigner();
    const inputpay = document.getElementById("pay-input").value;
    const payDsoulUSDT = Number(inputpay*10**6)
    const tokenPresaleContract = new ethers.Contract(tokenPresaleaddress, tokenPresale.abi, provider);
    const tokenPresaleContractWithSigner = tokenPresaleContract.connect(signer);
    const usdcContract = new ethers.Contract(process.env.REACT_APP_USDCALLOWANCE,usdcAbi, provider);
    const usdcContractWithSigner = usdcContract.connect(signer);

    let usdcAllowanceToPresale = await usdcContractWithSigner.allowance(signer.address, tokenPresaleaddress);

    if (usdcAllowanceToPresale < payDsoulUSDT) {
      const approve = await usdcContractWithSigner.approve(tokenPresaleaddress, payDsoulUSDT - Number(usdcAllowanceToPresale))
      const approveReceipt = await approve.wait();
    }

    usdcAllowanceToPresale = await usdcContractWithSigner.allowance(signer.address, tokenPresaleaddress);

    const buy = await tokenPresaleContractWithSigner.buyWithUsdc(payDsoulUSDT);
    const buyReciept = await buy.wait();
    } catch (error) {
      console.log(error);
    }
  };

  const claimTokensButton = async ()=>{
    try {
      const signer = await provider.getSigner();
      const tokenPresaleContract = new ethers.Contract(tokenPresaleaddress, tokenPresale.abi, provider);
      const tokenPresaleContractWithSigner = tokenPresaleContract.connect(signer);
      const buy =  await tokenPresaleContractWithSigner.claimTokens(claimToken);
      const buyReciept = await buy.wait();
    } catch (error) {
      console.log(error);
    }
  }

  const claimRefundButton = async ()=>{
    try {
      const signer = await provider.getSigner();
      const tokenPresaleContract = new ethers.Contract(tokenPresaleaddress, tokenPresale.abi, provider);
      const tokenPresaleContractWithSigner = tokenPresaleContract.connect(signer);
      const buy =  await tokenPresaleContractWithSigner.claimRefund(refundToken);
      const buyReciept = await buy.wait();
    } catch (error) {
      console.log(error);
    }
  }

  const pay_with_meta = ()=>{
    if(currencys==="ETH"){
      payWithETH()
    } else if(currencys==="USDT"){
      payWithUSDT()
    } else{
      payWithUSDC()
    }
  }

    if(currencys==="ETH"){
      ethToken()
    } else if(currencys==="USDT"){
      usdtToken()
    } else{
      usdcToken()
    }

  useEffect(()=>{
    // if(!metaAccount) return 
    loadBlockchainData()
  },[])

  const payment_fun = async(event)=>{
    const inputpay = document.getElementById("pay-input").value;
    const fiatPay = Number(inputpay)
    setPayInput(fiatPay)
  };

  const account_id = (event)=>{
    setAccount(event.target.value)
  };

  const refund_token = (event)=>{
    setRefundToken(event.target.value)
  };

  const claim_token = async (event)=>{
    setClaimToken(event.target.value)
  }

  const eth = [{tokenPrice:payInput, toETH:tokenETH, userAccount:account, quant:1}]

  const makePayment = async ()=>{
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PK_TEST);

  const response = await axios.post(`${baseUrl}create-checkout-session`,{products:eth});

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
              <button className="claim-button select-button claim-button-active" scale="md" id="btn-eth" onClick={()=>setCurrencys("ETH")}> ETH</button>
              <button className="claim-button select-button" scale="md" id="btn-usdt" onClick={()=>setCurrencys("USDT")}> USDT</button>
              <button className="claim-button select-button" scale="md" id="btn-usdc" onClick={()=>setCurrencys("USDC")}> USDC</button>
            </div>

            <div className='pay-container'>
              <span className='pay-label'>Pay</span>
              <div style={style}>
                <input 
                scale="md" 
                className="progress-input pay-input" 
                onChange={payment_fun}
                id="pay-input" 
                type='number'
                value={payInput} 
                style={{"visibility":"hidden;"}}/>
              </div>
              <span className="eth-label">{currencys}</span>
            </div>

            <div className='receive-container'>
              <span className='receive-label'>Receive: </span>
              <div className="progress-input receive-input" style={style1}>{tokenETH}</div>
              <span className="gary-span backcolor">DSoul</span>
            </div>


            <button className="claim-button" scale="md" id="claim" disabled="" 
            style={{"margin-top": "40px;"}} onClick={()=>pay_with_meta()} >PAY</button>
            {/* <a href='https://global-stg.transak.com/?apikey=8f020938-fd46-4977-bc01-059542dc79b7' 
            // target="_blank"
            rel="noreferrer" className="claim-button" scale="md" id="claim" disabled="" 
            style={{"margin-top": "40px;"}}>Buy To Card</a> */}

           <div className='pay-container'>
              <span className='pay-label1'>Your account ID</span>
              <div style={style}>
                <input 
                scale="md" 
                className="progress-input pay-input1" 
                id="pay-input1" 
                onChange={account_id}
                type='text'
                value={account} 
                style={{"visibility":"hidden;"}}/>
              </div>
            </div>

            {payInput && account == ""?<button className="claim-button" scale="md" id="claim" disabled={!buttonDisabled} 
            style={{"margin-top": "40px;"}} onClick={()=>makePayment()}>Buy With Card ST</button>:<button className="claim-button" scale="md" id="claim" disabled={buttonDisabled} 
            style={{"margin-top": "40px;"}} onClick={()=>makePayment()}>Buy With Card ST</button>}


              <div className='pay-container'>
                <span className='pay-label1'>Your Presale ID</span>
                <div style={style}>
                  <input 
                  scale="md" 
                  className="progress-input pay-input1" 
                  id="pay-input1" 
                  onChange={claim_token}
                  type='text'
                  value={claimToken} 
                  style={{"visibility":"hidden;"}}/>
              </div>
            </div>
            <button className="claim-button" scale="md" id="claim" disabled={buttonDisabled}
            style={{"margin-top": "40px;"}} onClick={()=>claimTokensButton()}>claim Token</button>


             <div className='pay-container'>
              <span className='pay-label1'>Your Claim ID</span>
              <div style={style}>
                <input 
                scale="md" 
                className="progress-input pay-input1" 
                id="pay-input1" 
                onChange={refund_token}
                type='text'
                value={refundToken} 
                style={{"visibility":"hidden;"}}/>
              </div>
            </div>
            <button className="claim-button" scale="md" id="claim" disabled={buttonDisabled} 
            style={{"margin-top": "40px;"}} onClick={()=>claimRefundButton()}>Refund Token</button>
        </div>
    </div>
  )
}

export default Cart