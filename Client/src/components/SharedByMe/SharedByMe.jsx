import React, { useContext, useEffect, useState } from 'react';
import AccountContractContext from '@/Context/AccountContractContext';
import { columns } from './SharedByColumns'; 
import RevokeAccess from '../Accesscontrol/RevokeAccess';
import useStore from '@/Context/store';

const SharedByMe = () => {
 const { address, contract } = useContext(AccountContractContext);
 const [sharedFiles, setSharedFiles] = useState([]);
 const [selectedTempOwners, setSelectedTempOwners] = useState({});
 const {revokeTrigger} = useStore();

 useEffect(() => {
    const grantFiles = async () => {
      try {
        const fetchGrantFiles = await contract.getSharedOwnedFiles();

        const sharedFilesDetails = await Promise.all(fetchGrantFiles.map(async (url) => {
          const [primaryOwner, filename, filesize, timestamp, fileurl] = await contract.getFileTokenDetails(url);
          const ipfsHash = url.split('/').pop();
          const date = timestamp;
          const tempOwners = await contract.getTemporaryOwners(fileurl);

          return {
            fileName: filename,
            size: filesize,
            date: date,
            url: fileurl,
            ipfsHash: ipfsHash,
            tempOwners: tempOwners,
          };
        }));

        setSharedFiles(sharedFilesDetails);
      } catch (error) {
        console.error("Error fetching file details:", error);
      }
    };

    grantFiles();
 }, [contract, revokeTrigger]);

 useEffect(() => {
  const initialSelectedTempOwners = {};
  sharedFiles.forEach(file => {
    if (file.tempOwners.length > 0) {
      initialSelectedTempOwners[file.url] = file.tempOwners[0];
    }
  });
  setSelectedTempOwners(initialSelectedTempOwners);
}, [sharedFiles]);

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
              <th className='px-4 py-2 border border-solid border-black'>Temp Owner</th>
              <th className='px-4 py-2 border border-solid border-black'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sharedFiles.map((file, index) => (
              <tr key={index}>
                {columns.map((column, i) => (
                 <td key={i} className="px-4 py-2 border">
                    {column.accessor(file)}
                 </td>
                ))}
                <td className="px-4 py-2 border">
                 <select
                    onChange={(e) => {
                      const newSelectedTempOwners = { ...selectedTempOwners, [file.url]: e.target.value };
                      setSelectedTempOwners(newSelectedTempOwners);
                    }}
                 >
                    {file.tempOwners.map((owner, index) => (
                      <option key={index} value={owner}>{owner}</option>
                    ))}
                 </select>
                </td>
                <td className="px-4 py-2 border">
                 <RevokeAccess fileUrl={file.url} TempOwnerAddress={selectedTempOwners[file.url]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
 );
};

export default SharedByMe;
