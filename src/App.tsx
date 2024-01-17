/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { ethers } from 'ethers'
// import axios from 'axios'
import './App.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ethereum = (window as any).ethereum
const host = "http://localhost:3000"

// axios

function App() {

  const [isConnect, setIsConnect] = useState(false)
  const [accounts, setAccounts] = useState([])

  const handleClick = async () => {
    if (ethereum) {
      try {
        await ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Wallet connected");
        setIsConnect(true)
      } catch (error) {
        console.error("User denied account access", error);
        throw new Error('User denied account access');
      }
    } else {
      const errorMsg = 'Ethereum provider not detected. Please install MetaMask or another compatible wallet.';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }

  const handleGetAccounts = async () => {
    if (ethereum) {
      try {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        console.log(accounts);
        setAccounts(accounts)
      } catch (error) {
        console.error("User denied account access", error);
        throw new Error('User denied account access');
      }
    } else {
      const errorMsg = 'Ethereum provider not detected. Please install MetaMask or another compatible wallet.';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }

  const getNonce = async () => {
    const res = await fetch(host + '/auth/wallet/oauth/nonce', {
      method: 'get',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzA1NDg1ODIyLCJleHAiOjE3MDU0ODk0MjJ9.evmcwdCwScYm-RRs1ZtEmnSQzqChPNfMRP5g2K0hoyI'
      }
    })
    const json = await res.json()
    return json.data
  }

  const verify = async (params: any) => {
    const res = await fetch(host + '/auth/wallet/oauth/verify', {
      method: 'post',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzA1NDg1ODIyLCJleHAiOjE3MDU0ODk0MjJ9.evmcwdCwScYm-RRs1ZtEmnSQzqChPNfMRP5g2K0hoyI'
      }
    })
    const json = await res.json()
    console.log(json)
  }

  const handleGetSigner = async () => {
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner()
    const address = signer.address
    const nonce = await getNonce()
    const signature = await signer.signMessage(nonce)
    await verify({ address, signature })
  }

  return (
    <div >
      {
        isConnect ? <button onClick={() => handleClick()}>Wallet connected</button> : <button onClick={() => handleGetAccounts()}>get account</button>
      }
      <ul>{
        accounts.map(item => <li key={item}>{item}</li>)}
      </ul>
      <button onClick={() => handleGetSigner()}>Singer</button>
    </div>
  )
}

export default App
