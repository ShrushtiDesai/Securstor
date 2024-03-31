import React from 'react';
import { Waypoints } from 'lucide-react';

function UserItem({account}) {

  const userAddress = account;
  const shortUserAddress = `${userAddress.slice(0,8)}xxx${userAddress.slice(-5)}`;

 

 return (
   <div className='py-4 pt-0 '>
    <div className="flex flex-col items-start border rounded-[8px] p-2">
      <div className="flex items-center gap-2 px-2">
        <Waypoints />
        <div className="grow">
          <p className="text-[30px] font-bold">SecureStor</p>
        </div>
      </div>
      <p className="text-[18px] text-neutral-500 pl-12">Hi {shortUserAddress}</p>
    </div>
    </div>
 );
}

export default UserItem;
