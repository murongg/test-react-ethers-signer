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

  const getNonce = async (address?: string) => {
    const res = await fetch(host + '/signer/nonce' +( address ? ('?address=' + address) : ''), {
      method: 'get',
    })
    const json = await res.json()
    return json.nonce
  }

  const verify = async (params: any) => {
    const res = await fetch(host + '/signer/verify', {
      method: 'post',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await res.json()
    console.log(json)
  }

  const handleGetSigner = async () => {
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner()
    const address = signer.address
    const nonce = await getNonce(address)
    const signature = await signer.signMessage(nonce)
    await verify({ address, signature, nonce })
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
