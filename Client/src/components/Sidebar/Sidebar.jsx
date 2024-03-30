// Sidebar.js
import React from 'react';
import UserItem from './UserItem';
import Menubar from './Menubar';



const Sidebar = ({account, contract}) => {

  console.log(contract);
  const inputaddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

  const file_url = "https://maroon-secret-shrimp-348.mypinata.cloud/ipfs/QmXKU5YzGZx7ho3xDcTX8FeJYWSCiy1kkZmsoKPmaSLaZN";

//   try {
//     // Example: Calling a contract function that might revert
//     contract.grantAccess(file_url,inputaddress);
// } catch (error) {
//     // Check if the error is a revert error
//     if (error.code === -32603) {
//         // Extract the revert reason from the nested error message
//         const revertReason = error.data.message.split("reverted with reason string '")[1].split("'")[0];
//         console.log('Contract reverted with reason:', revertReason);
//         // Display the revert reason to the user
//         alert(`Transaction failed: ${revertReason}`);
//     } else {
//         // Handle other types of errors
//         console.error('An error occurred:', error);
//         alert('An error occurred while interacting with the contract.');
//     }
// }

  

 return (
    <div className='flex flex-col w-[300px] min-w-[300px] border-r min-h-screen p-4'>
      <div>
        <UserItem account={account}></UserItem>
        <div className="col-span-2 border-t border-neutral-300 my-2 w-full" />
        <Menubar contract={contract}></Menubar>
      </div>
      
    </div>
 );
};

export default Sidebar;

// import React, { useState, useEffect } from 'react';
// import UserItem from './UserItem';
// import Menubar from './Menubar';

// const Sidebar = ({ account, contract }) => {
//  const [errorMessage, setErrorMessage] = useState('');

//  const inputAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
//  const fileUrl = "https://maroon-secret-shrimp-348.mypinata.cloud/ipfs/QmXKU5YzGZx7ho3xDcTX8FeJYWSCiy1kkZmsoKPmaSLaZN";

//  useEffect(() => {
//     const callContractFunction = async () => {
//       try {
//         // Await the contract function call
//         await contract.grantAccess(fileUrl, inputAddress);
//       } catch (error) {
//         // Check if the error is a revert error
//         if (error.code === -32603) {
//           // Extract the revert reason from the nested error message
//           const revertReason = error.data.message.split("reverted with reason string '")[1].split("'")[0];
//           console.log('Contract reverted with reason:', revertReason);
//           // Update the state with the revert reason
//           setErrorMessage(`Transaction failed: ${revertReason}`);
//         } else {
//           // Handle other types of errors
//           console.error('An error occurred:', error);
//           setErrorMessage('An error occurred while interacting with the contract.');
//         }
//       }
//     };

//     callContractFunction();
//  }, [contract, fileUrl, inputAddress]); // Dependencies to re-run the effect

//  return (
//     <div className='flex flex-col w-[300px] min-w-[300px] border-r min-h-screen p-4'>
//       <div>
//         <UserItem account={account}></UserItem>
//         <div className="col-span-2 border-t border-neutral-300 my-2 w-full" />
//         <Menubar contract={contract}></Menubar>
//       </div>
//       {errorMessage && <div className="error-message">{errorMessage}</div>}
//     </div>
//  );
// };

// export default Sidebar;
