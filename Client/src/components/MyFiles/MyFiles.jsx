import React, { useContext, useEffect, useState } from 'react';
import { FileInput, Trash2, Share2} from 'lucide-react';
import AccountContractContext from '@/Context/AccountContractContext';

const MyFiles = () => {
 const { address, contract, provider } = useContext(AccountContractContext);
 const [files, setFiles] = useState([]); // State to store the files
 const [fetchedUrlsLength, setFetchedUrlsLength] = useState(0);


 useEffect(() => {
    const fetchFiles = async () => {
      try {
        const fetchedUrls = await contract.displayOwnedFiles();
        setFetchedUrlsLength(fetchedUrls.length);
        console.log(fetchedUrls);
        console.log(fetchedUrlsLength);

        // Iterate over the URLs and fetch file token details for each
        const fileDetails = await Promise.all(fetchedUrls.map(async (url) => {
          const [primaryOwner, filename, filesize, timestamp] = await contract.getFileTokenDetails(url);
          // Convert timestamp to a readable date format
          const date = new Date(timestamp * 1000).toLocaleDateString();
          return {
            fileName: filename,
            size: `${filesize}kb`, // Assuming filesize is in kilobytes
            date: date,
          };
        }));

        setFiles(fileDetails); // Update the state with the fetched file details
      } catch (error) {
        console.error("Error fetching file details:", error);
      }
    };

    fetchFiles();
 }, [fetchedUrlsLength]); // Depend on contract to re-run the effect if it changes

 return (
    <div className='flex flex-col'>
      <table>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Size</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td>{file.fileName}</td>
              <td>{file.size}</td>
              <td>{file.date}</td>
              <td>
                <span className='flex'>
                 <FileInput />
                 <Share2 />
                 <Trash2 />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
 );
};

export default MyFiles;
