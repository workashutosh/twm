import React, { useState } from 'react'
import LoaderComponent from "@components/common/LoaderComponent.jsx";
import { useTable, usePagination, useSortBy } from 'react-table';
import apiInstance from "@api/apiInstance";
import { RefreshCcw, Filter, FilterX, Search, Ban } from "lucide-react";
import Select, { components } from 'react-select';
import makeAnimated from 'react-select/animated';
import Datepicker from 'react-tailwindcss-datepicker';



const Assignlead = () => {
    const [daterange, setDaterange] = useState({
        startDate: null,
        endDate: null,
      });
    
      const handleDateChange = (newValue) => {
        setDaterange(newValue); 
      };



  return (
    <div className="w-full p-1  rounded-md mt-1">
      <div className='font-normal p-1 flex'>
        <div className="relative w-full max-w-xs">
          <Search size={18} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                   className="w-full p-2 pl-8 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                   placeholder="Search Lead"
                 />
        </div>
        <div className='w-[300px] ml-2 border border-gray-300 rounded-md'>
          <Datepicker
           value={daterange}
           onChange={handleDateChange} 
           showShortcuts={true} 
          classNames="w-24"
          placeholder='Date Range'
         />

        </div>
        <div className='ml-2 mt-1 bg-white p-2 rounded-md cursor-pointer'>
        <Ban size={20}  />
        </div>
        <div className='ml-2 mt-1 bg-white p-2 rounded-md cursor-pointer'>
        <Search size={20}  />
        </div>
        
        

      </div>
      
    </div>
  )
}

export default Assignlead
