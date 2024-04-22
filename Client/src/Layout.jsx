import { useEffect, useState } from "react";
import React from "react";
import { ethers } from "ethers";
import FileShare from "./artifacts/contracts/FileShare.sol/FileShare.json";
import Sidebar from './components/Sidebar/Sidebar';
import { Outlet} from 'react-router-dom';
import AccountContractContext from "./Context/AccountContractContext";
import { Toaster } from "./components/ui/toaster";

function Layout() {
  const [address, setAccount]=useState('');
  const [contract, setContract]=useState(null);
  const [provider, setProvider]=useState(null);

  useEffect(()=> {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const wallet = async()=> {
      if(provider){
        await provider.send("eth_requestAccounts",[]);
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
        window.ethereum.on("accountsChanged",() => {
          window.location.reload();
        })
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        // console.log(account)
        setAccount(address);

        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

        const contract = new ethers.Contract(
          contractAddress,
          FileShare.abi,
          signer
        );
        console.log(contract);
        console.log(address);
        setContract(contract);
        setProvider(signer);
        console.log(signer);

      }
      else{
        alert("Metamask extension not found!!");
      }
    }
    provider && wallet()
  },[]);
 return (
  <AccountContractContext.Provider value={{address,contract,provider}}>
  <div className='m-0 p-0'>
    <div className='flex items-start justify-start'>
      <Sidebar account={address} provider={provider} contract={contract} />
      <div className='w-full h-full'>
        <Toaster/>
        <Outlet/>
      </div>
    </div>
  </div>
  </AccountContractContext.Provider>
 );
}

export default Layout
