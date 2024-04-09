import React, { useContext, useEffect, useState } from 'react';
import { FileInput } from 'lucide-react';
import AccountContractContext from '@/Context/AccountContractContext';
import { columns } from './columnsForShared';


const SharedWithMe = () => {
 const { contract } = useContext(AccountContractContext);
 const [sharedFiles, setsharedwithFiles] = useState([]); // State to store the files

 useEffect(() => {
    const fetchshareFiles = async () => {
      try {
        // Fetch files shared with the current user
        const sharedwithfiles = await contract.displayFilesSharedWithMe();
        console.log(sharedwithfiles);
        // Iterate over the URLs and fetch file token details for each
        const sharedwithfileDetails = await Promise.all(sharedwithfiles.map(async (url) => {
          const [primaryOwner, filename, filesize, timestamp, fileurl] = await contract.getFileTokenDetails(url);
          // Convert timestamp to a readable date format
          const ipfsHash = url.split('/').pop();
          const date = timestamp;
          return {
            fileName: filename,
            size: filesize, // Assuming filesize is in kilobytes
            date: date,
            url: fileurl,
            ipfsHash: ipfsHash,
            primaryOwner: primaryOwner, // Include primary owner's address
          };
        }));

        setsharedwithFiles(sharedwithfileDetails); 

      } catch (error) {
        console.error("Error fetching file details:", error);
      }
    };

    fetchshareFiles();
 }, [contract]); // Depend on contract to re-run the effect if it changes

 return (
    <div className='flex flex-col'>
      <div className="w-full mx-auto p-4 m-4"> {/* Add margin around the container */}
        <table className="w-full border-collapse"> {/* Apply Tailwind CSS to make the table full width */}
          <thead>
            <tr>
              {columns.map((column, i) => (
                <th key={i} className="px-4 py-2 border border-solid border-black">
                 {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sharedFiles.map((file, index) => (
              <tr key={index}>
                {columns.map((column, i) => (
                 <td key={i} className="px-4 py-2 border">
                    {i < columns.length - 1 ? column.accessor(file) : (
                      <span className='flex justify-center'>
                        <button onClick={() => window.open(file.url, '_blank')}>
                          <FileInput />
                        </button>
                      </span>
                    )}
                 </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
 );
};

export default SharedWithMe;
