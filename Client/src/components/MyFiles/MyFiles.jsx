import React, { useContext, useEffect, useState } from 'react';
import { FileInput } from 'lucide-react';
import AccountContractContext from '@/Context/AccountContractContext';
import { columns } from './columns';
import DeleteFile from './DeleteFile';
import GrantAcess from '../Accesscontrol/GrantAcess';
import useStore from '@/Context/store';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
 // Import the placeholder image
import placeholderImage from '@/assets/empty.svg';


const MyFiles = () => {
  const { contract } = useContext(AccountContractContext);
  const [files, setFiles] = useState([]); // State to store the files

  const { uploadTrigger } = useStore();

  useEffect(() => {

    const fetchFiles = async () => {
      try {

        const fetchedUrls = await contract.displayOwnedFiles();
        console.log(fetchedUrls);
        console.log(typeof (fetchedUrls));

        // Iterate over the URLs and fetch file token details for each
        const fileDetails = await Promise.all(fetchedUrls.map(async (url) => {
          console.log("myfiles map check")
          const [primaryOwner, filename, filesize, timestamp, fileurl] = await contract.getFileTokenDetails(url);
          console.log("inside files use effect")
          // Convert timestamp to a readable date format
          const ipfsHash = url.split('/').pop();
          const date = timestamp;
          return {
            fileName: filename,
            size: filesize, // Assuming filesize is in kilobytes
            date: date,
            url: fileurl,
            ipfsHash: ipfsHash,
          };
        }));

        setFiles(fileDetails); // Update the state with the fetched file details
      } catch (error) {
        console.error("Error fetching file details:", error);
      }
    };

    fetchFiles();
    
    const timer = setTimeout(() => {
      fetchFiles();
    }, 20000);

    console.log("line 53 of myfiles upload trigger:", uploadTrigger);

    return() => clearTimeout(timer);

  }, [contract, uploadTrigger]); // Depend on contract to re-run the effect if it changes

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
            {files.length > 0 ? (
              files.map((file, index) => (
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
                          <div>
                            <GrantAcess FileUrl={file.url}></GrantAcess>
                          </div>
                          <div>
                            <DeleteFile IpfsHash={file.ipfsHash} contract={contract} fileurl={file.url}></DeleteFile>
                          </div>
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
                  <img src={placeholderImage} width={400} height={400} alt="No files found" className="mx-auto" />
                 <p className='text-2xl'>No files to display.</p>
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

export default MyFiles;
