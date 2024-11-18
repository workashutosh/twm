import { useEffect, useRef, useState } from "react";
import useStore from '@store/index.jsx';


const SortIconComponent = (
  {
    //   isSortDropdownVisible: isDropdownVisible,
    //   setIsSortDropdownVisible: setDropdownVisible,
  }
) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const {  updateSortByRefBody } = useStore();
  const dropdownRef = useRef(null);

  const handleSortClick = (type, typeName) => {
    const sortData = { type, typeName };
    updateSortByRefBody(sortData);
    setDropdownVisible(false);
  };

  useEffect(() => {
    // Function to close the dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    

    // Add event listener when the dropdown is visible
    if (isDropdownVisible) {
      document.addEventListener("click", handleClickOutside);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownVisible]);
  return (
    <div
      ref={dropdownRef}
      className="relative "
      onClick={() => setDropdownVisible(!isDropdownVisible)}
    >
      <div className="relative group">
        <svg
          className="cursor-pointer"
          width="24"
          height="19"
          viewBox="0 0 24 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.2 13.1429H1M9.8 8.28571H1M5.4 3.42857H1M18.6 18H1M19.7 13.1429V1M19.7 1L23 4.64286M19.7 1L16.4 4.64286"
            stroke={` ${isDropdownVisible ? "#9A55FF" : "#1B2559"} `}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="tooltiptext absolute invisible text-sm top-[125%] z-20 -left-2/3 bg-white text-[#6F6B6B] drop-shadow-xl text-center p-1 w-16 rounded group-hover:visible  ">
          Sort
        </div>
      </div>

      {isDropdownVisible && (
        <div className="absolute top-7 drop-shadow-lg z-20 w-[195px] rounded  bg-white p-2 text-sm font-normal ">
           <p
            className="cursor-pointer leading-none py-2 hover:bg-[#EADCFF] hover:text-[#000000] rounded pl-3 text-[#8B8B8B] "
            onClick={() => handleSortClick("type" , "closure")}
          >
              Sort By : Recent Closure
          </p>
          <p
            className="cursor-pointer leading-none py-2 hover:bg-[#EADCFF] hover:text-[#000000] rounded pl-3 text-[#8B8B8B] "
            onClick={() => handleSortClick("type", "av")}
          >
             Sort By : Maximum AV
          </p>
        </div>
      )}
    </div>
  );
};

export default SortIconComponent;
