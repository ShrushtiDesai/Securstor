import React, { useContext, useEffect, useState } from 'react';
import { FileInput } from 'lucide-react';
import AccountContractContext from '@/Context/AccountContractContext';
import { columns } from './columnsForShared';
import { Button } from '../ui/button';
import useStore from '@/Context/store';
import emptyPlaceholder from '@/assets/empty.svg'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"



const SharedWithMe = () => {
 const { contract } = useContext(AccountContractContext);
 const [sharedFiles, setsharedwithFiles] = useState([]); // State to store the files
 const { grantTrigger, revokeTrigger } = useStore();

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

    const timer = setTimeout(() => {
      fetchshareFiles();
    }, 20000);

    return() => clearTimeout(timer);

 }, [contract,grantTrigger,revokeTrigger]); // grant aur revoke bhi add karna hai

 return (
  <div className='flex flex-col'>
  <div className="w-full mx-auto p-4 m-4">
    <table className="w-full border-collapse">
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
        {sharedFiles.length > 0 ? (
          sharedFiles.map((file, index) => (
            <tr key={index}>
             {columns.map((column, i) => (
                <td key={i} className="px-4 py-2 border">
                  {i < columns.length - 1 ? column.accessor(file) : (
                    <span className='flex justify-center'>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button variant='ghost' className='bg-green-400 hover:bg-green-300' onClick={() => window.open(file.url, '_blank')}>
                             <FileInput />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className='bg-black text-white'>
                            <p>Open</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="w-full h-full flex-col px-4 py-2 border text-center">
            <div className='flex flex-col gap-4 justify-center items-center w-full h-full'>
             <img src={emptyPlaceholder} width={200} height={200} alt="No files found" className="mx-auto" />
             <p className='text-2xl'>No files shared with you yet.</p>
             </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
);
};

export default SharedWithMe;
