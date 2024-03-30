import React from 'react'
import { useContext } from 'react'
import AccountContractContext from '@/Context/AccountContractContext'

function SharedByMe() {
  const {address, contract, provider} = useContext(AccountContractContext);
  console.log(contract);

  return (
    <div>SharedByMe</div>
  )
}

export default SharedByMe