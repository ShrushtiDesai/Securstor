import React, { useState, useEffect, useContext } from 'react';
import AccountContractContext from '@/Context/AccountContractContext';

const SharedWithMe = () => {
 const { address, contract, provider } = useContext(AccountContractContext);
 const [files, setFiles] = useState([]); // State to store the files

 useEffect(() => {
    const fetchFilesSharedWithMe = async () => {
        try {
          const fetchedFiles = await contract.displayFilesSharedWithMe();
          console.log(fetchedFiles);
          setFiles(fetchedFiles); // Update the state with the fetched files
        } catch (error) {
          console.error("Error fetching files shared with me:", error);
        }
    };

    fetchFilesSharedWithMe();
 }, [contract]); // Depend on contract to re-run the effect if it changes

 return (
    <div className="p-4">
      Shared With Me
      {/* Render the files here if needed */}
    </div>
 );
};

export default SharedWithMe;
