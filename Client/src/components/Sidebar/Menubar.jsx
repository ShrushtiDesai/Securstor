import React from 'react'
import { NavLink } from 'react-router-dom'
import { Files, Forward, Share2, Upload } from 'lucide-react'
import FileUpload from '../FileUpload'


function Menubar({contract}) {
  // console.log(contract);
  return (
    <div className='flex flex-col pt-2'>
      <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
      <div>
        <FileUpload contract={contract}></FileUpload>
      </div>
      <li>
                                <NavLink
                                to=""
                                    className={({isActive}) =>
                                    `flex justify-left py-2 pr-4 pl-3 duration-200 ${isActive ? "bg-black text-white" : "bg-white text-black"} border-gray-1100 hover:bg-gray-400 lg:hover:bg-transparent hover:text-white lg:p-0 rounded-[13px] mb-1`
                                    }
                                >
                                  <span className='pr-2'><Files/></span> My Files
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                to="/SharedByMe"
                                    className={({isActive}) =>
                                        `flex justify-left py-2 pr-4 pl-3 duration-200 ${isActive ? "bg-black text-white" : "bg-white text-black"} border-gray-1100 hover:bg-gray-400 lg:hover:bg-transparent hover:text-white lg:p-0 rounded-[13px] mb-1`
                                    }
                                >
                                   <span className='pr-2'><Share2/></span> Shared By Me
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                to="/SharedWithMe"
                                    className={({isActive}) =>
                                        `flex justify-left py-2 pr-4 pl-3 duration-200 ${isActive ? "bg-black text-white" : "bg-white text-black"} border-gray-1100 hover:bg-gray-400 lg:hover:bg-transparent hover:text-white lg:p-0 rounded-[13px] mb-1`
                                    }
                                >
                                   <span className='pr-2'><Forward/></span> Shared With Me
                                </NavLink>
                            </li>
      </ul>
    </div>
  )
}

export default Menubar