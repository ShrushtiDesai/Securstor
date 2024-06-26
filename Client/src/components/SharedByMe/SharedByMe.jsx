import React, { useContext, useEffect, useState } from 'react';
import AccountContractContext from '@/Context/AccountContractContext';
import { columns } from './SharedByColumns'; 
import RevokeAccess from '../Accesscontrol/RevokeAccess';
import useStore from '@/Context/store';
import placeholderImage from '@/assets/empty.svg';

const SharedByMe = () => {
 const { address, contract } = useContext(AccountContractContext);
 const [sharedFiles, setSharedFiles] = useState([]);
 const [selectedTempOwners, setSelectedTempOwners] = useState({});
 const {revokeTrigger} = useStore();

 useEffect(() => {
    const grantFiles = async () => {
      try {
        const fetchGrantFiles = await contract.getSharedOwnedFiles();

        const sharedFilesDetails = await Promise.all(fetchGrantFiles.map(async (hash) => {
          const [primaryOwner, filename, filesize, timestamp, filehash] = await contract.getFileTokenDetails(hash);
          const ipfsHash = filehash;
          const date = timestamp;
          const tempOwners = await contract.getTemporaryOwners(filehash);

          return {
            fileName: filename,
            size: filesize,
            date: date,
            hash: ipfsHash,
            tempOwners: tempOwners,
          };
        }));

        setSharedFiles(sharedFilesDetails);
      } catch (error) {
        console.error("Error fetching file details:", error);
      }
    };

    grantFiles();

    const timer = setTimeout(() => {
      grantFiles();
    }, 20000);

    return() => clearTimeout(timer);

 }, [contract, revokeTrigger]);

 useEffect(() => {
  const initialSelectedTempOwners = {};
  sharedFiles.forEach(file => {
    if (file.tempOwners.length > 0) {
      initialSelectedTempOwners[file.hash] = file.tempOwners[0];
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
        {sharedFiles.length > 0 ? (
          sharedFiles.map((file, index) => (
            <tr key={index}>
             {columns.map((column, i) => (
                <td key={i} className="px-4 py-2 border">
                  {column.accessor(file)}
                </td>
              ))}
             <td className="px-4 py-2 border">
             <select
                 onChange={(e) => {
                   const newSelectedTempOwners = { ...selectedTempOwners, [file.hash]: e.target.value };
                   setSelectedTempOwners(newSelectedTempOwners);
                 }}
             >
                 {file.tempOwners.map((owner, index) => (
                   <option key={index} value={owner}>{owner}</option>
                 ))}
             </select>
             </td>
             <td className="px-4 py-2 border">
             <RevokeAccess fileUrl={file.hash} TempOwnerAddress={selectedTempOwners[file.hash]} />
             </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length + 2} className="w-full h-full flex-col px-4 py-2 border text-center">
            <div className='flex flex-col gap-4 justify-center items-center w-full h-full'>
             <img src={placeholderImage} width={400} height={400} alt="No files found" className="mx-auto" />
             <p className='text-2xl'>No files shared by you yet.</p>
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

export default SharedByMe;
