// Header.jsx
import React from 'react';
import SharedWithMe from './SharedWithMe';

const SharedWithMeHeader = () => {
 return (
    <>
    <header className="bg-black text-white p-4">
      <h1 className="text-xl">Shared With Me</h1>
    </header>
    <SharedWithMe/>
    </>
 );
};

export default SharedWithMeHeader;
