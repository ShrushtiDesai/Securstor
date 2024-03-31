// Header.jsx
import React, {useContext} from 'react';
import MyFiles from './MyFiles';
import AccountContractContext from '@/Context/AccountContractContext';

const FilesHeader = () => {
  const { address, contract, provider } = useContext(AccountContractContext);
 return (
  <>
    <header className="bg-black text-white p-4">
      <h1 className="text-xl">My Files</h1>
    </header>
    <MyFiles/>
    </>
 );
};

export default FilesHeader;
