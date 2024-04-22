import React, { useContext, useEffect, useState } from 'react';
import AccountContractContext from '@/Context/AccountContractContext';
import { columns } from './columns';
import DeleteFile from './DeleteFile';
import GrantAcess from '../Accesscontrol/GrantAcess';
import useStore from '@/Context/store';
import placeholderImage from '@/assets/empty.svg';
import FileAccess from '../Accesscontrol/FileAccess';


const MyFiles = () => {
  const { contract, address } = useContext(AccountContractContext);
  const [files, setFiles] = useState([]); // State to store the files

  const { uploadTrigger } = useStore();
  const {deleteTrigger} = useStore();

  useEffect(() => {

    const fetchFiles = async () => {
      try {

        const fetchedhash = await contract.displayOwnedFiles();
        console.log(fetchedhash);
        console.log(typeof (fetchedhash));

        // Iterate over the URLs and fetch file token details for each
        const fileDetails = await Promise.all(fetchedhash.map(async (hash) => {
          console.log("myfiles map check")
          const [primaryOwner, filename, filesize, timestamp, filehash] = await contract.getFileTokenDetails(hash);
          console.log("inside files use effect")
          // Convert timestamp to a readable date format
          const ipfsHash = filehash;
          const date = timestamp;
          return {
            fileName: filename,
            size: filesize, // Assuming filesize is in kilobytes
            date: date,
            hash: ipfsHash
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

  }, [contract, uploadTrigger, deleteTrigger]); // Depend on contract to re-run the effect if it changes

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
                          <FileAccess filehash={file.hash}></FileAccess>
                          <div>
                            <GrantAcess FileUrl={file.hash}></GrantAcess>
                          </div>
                          <div>
                            <DeleteFile IpfsHash={file.hash} contract={contract}></DeleteFile>
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
