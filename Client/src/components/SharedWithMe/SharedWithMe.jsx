import React, { useState, useEffect } from 'react';
import { useContext } from 'react'
import AccountContractContext from '@/Context/AccountContractContext'

const SharedWithMe = () => {

 const {address, contract, provider} = useContext(AccountContractContext);
 console.log(contract);
//  contract.di

 useEffect(() => {
 });

 return (
    <div className="p-4">
      Shared With Me
    </div>
 );
};

export default SharedWithMe;