import React from 'react'
import { useLocation } from 'react-router-dom'

const PcfModal = () => {

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const details = Object.fromEntries(query);
    console.log(details)

  return (
    <div className=' mt-6 '>Under Development</div>
  )
}

export default PcfModal