// Sidebar.js
import React from 'react';
import UserItem from './UserItem';
import Menubar from './Menubar';

const Sidebar = ({account, contract}) => {

 return (
    <div className='flex flex-col w-[300px] min-w-[300px] border-r min-h-screen p-4'>
      <div>
        <UserItem account={account}></UserItem>
        <div className="col-span-2 border-t border-neutral-300 my-2 w-full" />
        <Menubar contract={contract} address={account}></Menubar>
      </div>
      
    </div>
 );
};

export default Sidebar;
