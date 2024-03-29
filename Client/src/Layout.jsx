import { useEffect, useState } from "react";
import { ethers } from "ethers";
import FileShare from "./artifacts/contracts/FileShare.sol/FileShare.json";
import Sidebar from './components/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

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
        setContract(contract);
        setProvider(signer);
        

      }
      else{
        alert("Metamask extension not found!!");
      }
    }
    provider && wallet()
  },[])

 return (
    <div className='m-0 p-0'>
      <div className='flex items-start justify-start'>
        <Sidebar account={address}
               provider={provider}
               contract={contract}></Sidebar>
        <div className='w-full h-full'>
          <Outlet />
        </div>
      </div>
    </div>
 );
}

export default Layout
