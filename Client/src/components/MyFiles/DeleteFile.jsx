import React, { useState } from "react";
import { Trash2 } from "lucide-react";

function DeleteFile({IpfsHash, contract, fileurl}) {
  const VITE_APP_PINATA_JWT_ACCESS_TOKEN = import.meta.env.VITE_APP_PINATA_JWT_ACCESS_TOKEN;

  console.log(VITE_APP_PINATA_JWT_ACCESS_TOKEN);

  const deletePin = async (IpfsHash) => {
    try {
       console.log(`Deleting pin with hash: ${IpfsHash}`);
       const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${IpfsHash}`, {
         method: "DELETE",
         headers: {
          Authorization: `Bearer ${VITE_APP_PINATA_JWT_ACCESS_TOKEN}`,
         },
       });
   
       if (response.ok) {
         console.log("Pin deleted successfully");
         await contract.deleteFile(fileurl);
         console.log("file deleted.")
       } else {
         console.log("Failed to delete pin");
       }
    } catch (error) {
       console.log("Error deleting pin:", error);
    }
   };


  return (
      <>
      <div>
        <button onClick={() => deletePin(IpfsHash)}><Trash2/></button>
      </div>
          
      </>
  );
}

export default DeleteFile;
