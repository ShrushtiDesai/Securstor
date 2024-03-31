// Header.jsx
import React from 'react';
import MyFiles from './MyFiles';

const FilesHeader = () => {
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
