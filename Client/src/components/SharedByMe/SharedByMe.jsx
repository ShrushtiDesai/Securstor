import React from 'react'
import { useEffect,useState,useContext } from 'react'
import AccountContractContext from '@/Context/AccountContractContext'

function SharedByMe() {
  const { address, contract, provider } = useContext(AccountContractContext);
  const [access, setaccess] = useState([]);
  const inputaddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

  const file_url = "https://maroon-secret-shrimp-348.mypinata.cloud/ipfs/QmXKU5YzGZx7ho3xDcTX8FeJYWSCiy1kkZmsoKPmaSLaZN";
 
  useEffect(() => {
     const test = async () => {
         try {
           const access = await contract.grantAccess(file_url,inputaddress);
           console.log(access);
           setaccess(access); // Update the state with the fetched files
         } catch (error) {
           console.error("Error fetching files shared with me:", error);
         }
     };
 
     test();
  }, [contract]); // Depend on contract to re-run the effect if it changes
  return (
    <div>Shared By Me</div>
  )
}

export default SharedByMe