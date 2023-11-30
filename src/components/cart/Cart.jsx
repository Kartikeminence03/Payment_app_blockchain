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
import { toast } from 'react-toastify';
import CartTime from './CartTime';

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
  const [startPresaleTime,setStartPresaleTime] = useState(0)
  const [endPresaleTime,setEndPresaleTime] = useState(0);
  const [metaAccount,setMetaAccount] = useState();
  const [goerNetwork,setGoerNetwork] = useState("goerli");

  const tokenPresaleaddress = process.env.REACT_APP_TOKENPRESALEADDRESS;
  const currentTime = new Date();

  const bt = async ()=>{
    const chainId = 137 // Polygon Mainnet
    const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

if (window.ethereum.networkVersion !== chainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89'}]
        });
      } catch (err) {
          // This error code indicates that the chain has not been added to MetaMask
        if (err.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: 'goerli',
                chainId: '0x89',
                nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
                rpcUrls: ['https://polygon-rpc.com/']
              }
            ]
          });
        }
      }
    }
  }

  const loadBlockchainData = async()=>{
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = ethers.getAddress(accounts[0]);
      setMetaAccount(account)

      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      console.log(provider);
      const network = await provider.getNetwork();
      const goer = network.name===goerNetwork;

      let goerliNetwork;
      if(!goer){
        setGoerNetwork("network")
        // goerliNetwork= setInterval(()=>{
          toast.error("please connect to Goerli")
        // },3000)
        //// window.location.reload(true);
        // return ()=>clearInterval(goerliNetwork)
        //// console.log("hi");
      } else{
        setGoerNetwork("goerli")
        toast.success("Connected to Goerli")
        // window.location.reload();
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    loadBlockchainData()
    //// return ()=>origin;
    // window.location.reload();
  },[goerNetwork])

  // useEffect(()=>{
  //   loadBlockchainData()
  // },[])

  //! Get token amount
  const getTokenAmount = async (payInput, getTokenFunction) => {
    try {if(provider){

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
    }
    } catch (err) {
      console.error(err,"----->>>>>>");
    }
  };
  

  //* Get token with ETh
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
      // console.error(error.message);
      let err  = error.message;
      let err1 = err.slice(21,44)
      // console.log(err1);
      if(err1){
        toast.error(err1)
        setButtonDisabled(true)
      }
    }
  };

  ////*Buy Presale Time function
  const bytokenTime = async ()=>{
    try {
      const signer = await provider.getSigner();
      const tokenPresaleContract = new ethers.Contract(tokenPresaleaddress, tokenPresale.abi, provider);
      const tokenPresaleContractWithSigner = tokenPresaleContract.connect(signer);
      const RecieveTime = await tokenPresaleContractWithSigner.presale(1)
      const startTime = RecieveTime[0];
      const endTime = RecieveTime[1];
      setStartPresaleTime(startTime);
      setEndPresaleTime(endTime)
      // console.log(RecieveTime[0],"====>>>>");
    } catch (error) {
      console.error(error)
    }
  };

  ////*Buy Presale Time variable
  let bigToNumST = Number(startPresaleTime);
  let bigToNumED = Number(endPresaleTime);
  let stt = new Date(bigToNumST*1000)
  let edt = new Date(bigToNumED*1000)
  ////*Buy Presale Time variable


  //Pay with ETH function
  const payWithETH = async ()=>{
    try {
      console.log("Eth");
    const signer = await provider.getSigner();
    const inputpay = document.getElementById("pay-input").value;
    const payDsoulETH = Number(inputpay)*10**18;
    const tokenPresaleContract = new ethers.Contract(tokenPresaleaddress, tokenPresale.abi, provider);
    const tokenPresaleContractWithSigner = tokenPresaleContract.connect(signer);
    const buy =  await tokenPresaleContractWithSigner.buyWithEth({value: BigInt(payDsoulETH).toString()});
    const buyReciept = await buy.wait();
    } catch (error) {
      // console.error(error.message,"=====>>>>")
      let err  = error.message;
      let err1 = err.slice(0,18)
      let err2 = err.slice(21,44)
      if(err1=="insufficient funds"){
        toast.error(err1)
        setButtonDisabled(true)
      } else{
        toast.error(err2)
        setButtonDisabled(true)
      }
    }
  };


  //Pay with USDT function
  const payWithUSDT = async () => {
    const usdtAllowanceContractAddress = process.env.REACT_APP_USDTALLOWANCE;
    const usdtAllowanceAbi = usdtAbi;
    await payWithToken("USDT", usdtAllowanceContractAddress, usdtAllowanceAbi, async (contract, amount) => {
      return contract.buyWithUsdt(amount);
    });
  };

  //Pay with USDC function
  const payWithUSDC = async () => {
    const usdcAllowanceContractAddress = process.env.REACT_APP_USDCALLOWANCE;
    const usdcAllowanceAbi = usdcAbi;
    await payWithToken("USDC", usdcAllowanceContractAddress, usdcAllowanceAbi, async (contract, amount) => {
      return contract.buyWithUsdc(amount);
    });
  };


  //Execute claim function
  const executeClaimAction = async (actionFunction, actionToken) => {
    try {
      const signer = await provider.getSigner();
      const tokenPresaleContract = new ethers.Contract(tokenPresaleaddress, tokenPresale.abi, provider);
      const tokenPresaleContractWithSigner = tokenPresaleContract.connect(signer);
  
      const claimAction = await actionFunction(tokenPresaleContractWithSigner, actionToken);
      const claimReceipt = await claimAction.wait();
    } catch (error) {
      console.log(error,);
    }
  };

  //Claim token function
  const claimTokensButton = async () => {
    await executeClaimAction((contract, token) => contract.claimTokens(token), claimToken);
  };
  
  //Claim refund function
  const claimRefundButton = async () => {
    await executeClaimAction((contract, token) => contract.claimRefund(token), refundToken);
  };


  //*Pay for token with blockchain
  const pay_with_meta = ()=>{
    // loadBlockchainData()
    bt();
    if(currencys==="ETH"){
      payWithETH()
      setButtonDisabled(false)
    } else if(currencys==="USDT"){
      payWithUSDT()
      setButtonDisabled(false)
    } else{
      payWithUSDC()
      setButtonDisabled(false)
    }
  }

  //!Presale Time
  const checkPresaleTime = ()=>{
    setTimeout(()=>{
      bytokenTime()
      if(currentTime<stt){
        setButtonDisabled(true)
        setErrorMessage("Presale is not start")
      } else if(currentTime>edt){
        setButtonDisabled(true)
        setErrorMessage("Presale is end")
      } else{
        setButtonDisabled(false)
      }
    },100)
  };

  useEffect(()=>{
    checkPresaleTime()
  },[stt,edt]);
  //!Presale Time

    if(currencys==="ETH"){
      ethToken()
    } else if(currencys==="USDT"){
      usdtToken()
    } else{
      usdcToken()
    }

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

  const eth = [{tokenPrice:payInput, crypto:currencys, toETH:tokenETH, userAccount:account, quant:1}];

  ////* Payment with card stripe function
  const makePayment = async ()=>{
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PK_TEST);

    if(currentTime<stt){
      const response = null;
      toast.error("Presale is not start")
    } else if(currentTime>edt){
      setButtonDisabled(true)
      // setErrorMessage("Presale is end")
      toast.error("Presale is end")
    } else{
      setButtonDisabled(false)
      const response = await axios.post(`${baseUrl}create-checkout-session`,{products:eth});
      const session = await response.data;
    // console.log(session);

    const result = stripe.redirectToCheckout({
        sessionId:session.id,
    });
  
    if(result.error){
        console.log(result.error);
    }
    }
  };
  
  return (
    <div className='claim-container'>
        <div className='claim-content'>
            <h2 className='claim-title'>
            {"Join the "}
             <span className="gary-bold">$PAY</span>
            </h2>
            {/* <CartTime startTime={startPresaleTime} endTime={endPresaleTime}/> */}
            <p className='claim-title1'>{errorMessage === "" ? "":errorMessage}</p>
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


            <button className="claim-button" scale="md" id="claim" 
            disabled={buttonDisabled}
            style={{"margin-top": "40px;"}} onClick={()=>pay_with_meta()} >PAY</button>

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

            {!payInput == "" && !account == ""?<button className="claim-button" scale="md" id="claim" disabled={!buttonDisabled} 
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