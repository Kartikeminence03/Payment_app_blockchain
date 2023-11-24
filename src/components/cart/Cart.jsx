/* global BigInt */
import React, { useEffect, useState } from 'react'
import "./Cart.css"
import {loadStripe} from '@stripe/stripe-js';
import axios from 'axios';
import { ethers } from 'ethers'
import { baseUrl } from '../../backend_Url/baseUrl';
import tokenPresale from '../../abi/TokenPreSale.json';
import usdtAbi from '../../abi/usdt.json';
import usdcAbi from '../../abi/usdc.json'
// import CartTime from './CartTime';

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
  const [currencys, setCurrencys] = useState("ETH");
  const [errorMessage,setErrorMessage] = useState("");

  const tokenPresaleaddress = process.env.REACT_APP_TOKENPRESALEADDRESS;

  const loadBlockchainData = async()=>{
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);
    const network = await provider.getNetwork();
    const goer = network.name==="goerli";
  }

  const goerliNetwork = async ()=>{};


  //! Get token amount
  const getTokenAmount = async (payInput, getTokenFunction) => {
    try {
      const signer = await provider.getSigner();
      // const inputpay = Number(payInput) * 10 ** 6;
  
      const tokenPresaleContract = new ethers.Contract(
        tokenPresaleaddress,
        tokenPresale.abi,
        provider
      );
  
      const tokenPresaleContractWithSigner = tokenPresaleContract.connect(signer);
      const RecieveTokens = await getTokenFunction(tokenPresaleContractWithSigner, BigInt(payInput).toString());
      setTokenETH(Number(RecieveTokens) / 10 ** 18);
    } catch (err) {
      console.error(err,"----->>>>>>");
    }
  };
  

  //*Get token with ETh
  const ethToken = async ()=>{
    const inputpay = await document.getElementById("pay-input")?.value;
    const payDsoulETH = Number(inputpay) * 10 ** 18;
    await getTokenAmount(payDsoulETH, async (contract, payValue) => {
      return contract.getTokenAmountForEth(payValue);
    })
  };


  //*Get token with USDT
  const usdtToken =async ()=>{
    // console.log("USDT");
    const inputpay = document.getElementById("pay-input")?.value;
    const payDsoulUSDT = Number(inputpay) * 10 ** 6;
    await getTokenAmount(payDsoulUSDT, async (contract, payValue) => {
      return contract.getTokenAmountForUsdt(payValue);
    });
  };


  //*Get token with USDC
  const usdcToken = async()=>{
    // console.log("USDC");
    const inputpay = document.getElementById("pay-input")?.value;
    const payDsoulUSDC = Number(inputpay) * 10 ** 6;
    await getTokenAmount(payDsoulUSDC, async (contract, payValue) => {
      return contract.getTokenAmountForUsdc(payValue);
    });
  };


  //!Pay for token
  const payWithToken = async (tokenSymbol, allowanceContractAddress, allowanceAbi, buyFunction) => {
    try {
      console.log(tokenSymbol);
      const signer = await provider.getSigner();
      const inputpay = document.getElementById("pay-input")?.value;
      const payAmount = Number(inputpay) * 10 ** 6;
  
      const tokenPresaleContract = new ethers.Contract(tokenPresaleaddress, tokenPresale.abi, provider);
      const tokenPresaleContractWithSigner = tokenPresaleContract.connect(signer);
  
      const allowanceContract = new ethers.Contract(allowanceContractAddress, allowanceAbi, provider);
      const allowanceContractWithSigner = allowanceContract.connect(signer);
  
      let allowanceToPresale = await allowanceContractWithSigner.allowance(signer.address, tokenPresaleaddress);
  
      if (allowanceToPresale < payAmount) {
        const approve = await allowanceContractWithSigner.approve(tokenPresaleaddress, payAmount - Number(allowanceToPresale));
        const approveReceipt = await approve.wait();
      }
  
      allowanceToPresale = await allowanceContractWithSigner.allowance(signer.address, tokenPresaleaddress);
  
      const buy = await buyFunction(tokenPresaleContractWithSigner, payAmount);
      const buyReceipt = await buy.wait();
    } catch (error) {
      console.error(error);
    }
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
      console.error(error)
    }
  };


  const payWithUSDT = async () => {
    const usdtAllowanceContractAddress = process.env.REACT_APP_USDTALLOWANCE;
    const usdtAllowanceAbi = usdtAbi;
    await payWithToken("USDT", usdtAllowanceContractAddress, usdtAllowanceAbi, async (contract, amount) => {
      return contract.buyWithUsdt(amount);
    });
  };

  const payWithUSDC = async () => {
    const usdcAllowanceContractAddress = process.env.REACT_APP_USDCALLOWANCE;
    const usdcAllowanceAbi = usdcAbi;
    await payWithToken("USDC", usdcAllowanceContractAddress, usdcAllowanceAbi, async (contract, amount) => {
      return contract.buyWithUsdc(amount);
    });
  };


  const executeClaimAction = async (actionFunction, actionToken) => {
    try {
      const signer = await provider.getSigner();
      const tokenPresaleContract = new ethers.Contract(tokenPresaleaddress, tokenPresale.abi, provider);
      const tokenPresaleContractWithSigner = tokenPresaleContract.connect(signer);
  
      const claimAction = await actionFunction(tokenPresaleContractWithSigner, actionToken);
      const claimReceipt = await claimAction.wait();
    } catch (error) {
      console.log(error);
    }
  };


  const claimTokensButton = async () => {
    await executeClaimAction((contract, token) => contract.claimTokens(token), claimToken);
  };
  
  const claimRefundButton = async () => {
    await executeClaimAction((contract, token) => contract.claimRefund(token), refundToken);
  };


  //Pay for token with blockchain
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

    // const ethFun = (a)=> {
    //   ethToken()
    //   setCurrencys(a)
    // }
    // const usdtFun = (a)=> {
    //   usdtToken()
    //   setCurrencys(a)
    // }
    // const usdcFun = (a)=> {
    //   usdcToken()
    //   setCurrencys(a)
    // }

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
            {/* <CartTime/> */}
            {!errorMessage === "" ? errorMessage:""}
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
                // style={{"visibility":"hidden;"}}
                />
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
                // style={{"visibility":"hidden;"}}
                />
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
                  // style={{"visibility":"hidden;"}}
                  />
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
                // style={{"visibility":"hidden;"}}
                />
              </div>
            </div>
            <button className="claim-button" scale="md" id="claim" disabled={buttonDisabled} 
            style={{"margin-top": "40px;"}} onClick={()=>claimRefundButton()}>Refund Token</button>
        </div>
    </div>
  )
}

export default Cart