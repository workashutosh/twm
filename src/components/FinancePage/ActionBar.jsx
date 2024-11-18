import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from 'react-icons/fa';
import IMAGES from "@images";
import FilterContainer from "@financepage/FilterContainer2";
import { useFilterContext } from '@context/FilterContext';

// Debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const ActionBar = (sideBarVisible) => {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { updateFilterData , filterData } = useFilterContext();  



  // Ref to track whether search text has been modified
  const hasSearched = useRef(false);


  // Create a debounced version of updateFilterData
  const debouncedUpdateFilterData = useRef(debounce((value , filterData) => {
    let updatedFilteredData = {...filterData};
    if (value) {
      updatedFilteredData.quick_search = value
      updateFilterData(updatedFilteredData);

    } else if (hasSearched.current) {
      updatedFilteredData.quick_search = ""
      hasSearched.current = false;
      updateFilterData(updatedFilteredData);

    }
  }, 200)).current;

  useEffect(() => {
    // Check if searchText has been modified
    if (searchText) {
      if (!hasSearched.current) {
        hasSearched.current = true;
      }
      debouncedUpdateFilterData(searchText, filterData);
    } else {
      debouncedUpdateFilterData("" , filterData);
    }
  }, [searchText, debouncedUpdateFilterData]);

  const handleClear = () => {
    setSearchText("");
  };

  return (
    <>
      <div className="z-20 flex items-center justify-between gap-4 pb-2 pr-5 bg-white border-b border-b-[#F6F6F6] mb-[10px]">
        <div className="flex gap-3">
          <div className=" ">
            <img
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsFiltersVisible((prev) => !prev);
              }}
              src={IMAGES.FilterIcon}
              alt="filter icon"
            />
            <FilterContainer displayProperty={isFiltersVisible ? "block" : "none"} widthProperty={sideBarVisible.sideBarVisible ? 80 : 90} />
          </div>

          <div
            onClick={() => window.location.reload(false)}
            className="relative cursor-pointer group mt-2"
          >
            <img 
              src={IMAGES.RefreshIcon}
              alt="Refresh"
            />
            <div className="tooltiptext absolute invisible text-sm top-[125%] z-20 -left-10 bg-white text-[#6F6B6B] drop-shadow-xl text-center p-1 w-24 rounded group-hover:visible">
              Refresh
            </div>
          </div>
        </div>

        <div className="flex items-center border-b border-gray-300 py-2">
          <FaSearch className="text-gray-500" />

          <input
            type="text"
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          {searchText && (
            <button
              onClick={handleClear}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ActionBar;
