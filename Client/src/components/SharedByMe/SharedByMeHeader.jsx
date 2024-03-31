// Header.jsx
import React from 'react';
import SharedByMe from './SharedByMe';

const SharedByMeHeader = () => {
 return (
  <>
    <header className="bg-black text-white p-4">
      <h1 className="text-xl">Shared By Me</h1>
    </header>
    <SharedByMe/>
</>
    
 );
};

export default SharedByMeHeader;
