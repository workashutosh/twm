import { useEffect, useRef, useState } from "react";
const TableFilterIconComponent = ({ tableFilter, setTableFilter }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
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

  // table filter checkbox change
  const handleCheckboxChange = (fieldName, e) => {
    setTableFilter((prev) => ({
      ...prev,
      [fieldName]: e.target.checked,
    }));
  };

  const hanldeApplyClick = () => {
    localStorage.setItem("tableFilter", JSON.stringify(tableFilter));
    setDropdownVisible(false);
  };

  useEffect(() => {
    if (localStorage?.getItem("tableFilter")) {
      const lsData = localStorage?.getItem("tableFilter");
      setTableFilter(JSON.parse(lsData));
    }
  }, []);

  return (
    <div ref={dropdownRef} className="relative ml-auto ">
      <div className="relative group">
        <svg
          className="cursor-pointer"
          onClick={() => {
            setDropdownVisible(!isDropdownVisible);
            // getSavedFilters();
          }}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 1V19M13 1V19M1 2C1 1.73478 1.10536 1.48043 1.29289 1.29289C1.48043 1.10536 1.73478 1 2 1H18C18.2652 1 18.5196 1.10536 18.7071 1.29289C18.8946 1.48043 19 1.73478 19 2V18C19 18.2652 18.8946 18.5196 18.7071 18.7071C18.5196 18.8946 18.2652 19 18 19H2C1.73478 19 1.48043 18.8946 1.29289 18.7071C1.10536 18.5196 1 18.2652 1 18V2Z"
            stroke={`${isDropdownVisible ? "#9A55FF" : "#1B2559"} `}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="tooltiptext absolute invisible text-sm top-[125%] z-20 -left-12 bg-white text-[#6F6B6B] drop-shadow-xl text-center p-1  w-28 rounded group-hover:visible  ">
          Table Filters
        </div>
      </div>

      {isDropdownVisible && (
        <div className="absolute top-8 right-0 z-[100] w-[650px] rounded-md border border-[#E9E9E9] bg-white pb-1 pt-4 shadow-md">
          {/* Checkbox Container */}
          <div className="flex w-full border-b border-b-[#DBDBDB] pb-3">
            {/* Column 1 */}
            <div className="flex flex-1 flex-col gap-3 border-r border-r-[#DBDBDB] px-5">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-[#444444]">Unit Details</span>
                <input
                  checked
                  disabled
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer ">
                <span className="text-xs text-[#444444]">Brokerage %</span>
                <input
                  checked
                  disabled
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer ">
                <span className="text-xs text-[#444444]">Ladder %</span>
                <input
                  checked
                  disabled
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            {/* Column 2 */}

            <div className="flex flex-1 flex-col gap-3 border-r border-r-[#DBDBDB] px-5">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-[#444444]">AV</span>
                <input
                  checked
                  disabled
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-[#444444]">Closure Date</span>
                <input
                  checked
                  disabled
                  type="checkbox"
                  id="tf-closure_date"
                  className="w-4 h-4 cursor-pointer"
                />
              </label>

              <label
                htmlFor="tf-ob_status"
                className="flex items-center justify-between cursor-pointer "
              >
                <span className="text-xs text-[#444444]">OB Status</span>
                <input
                  checked
                  disabled
                  type="checkbox"
                  id="tf-ob_status"
                  className="w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            {/* Column 3 */}
            <div className="flex flex-1 flex-col gap-3 border-r border-r-[#DBDBDB] px-5">
              <label
                htmlFor="tf-invoice_status"
                className="flex items-center justify-between cursor-pointer"
              >
                <span className="text-xs text-[#444444]">Location Name</span>
                <input
                  onChange={(e) => {
                    handleCheckboxChange("invoice_status", e);
                  }}
                  checked={tableFilter.invoice_status}
                  type="checkbox"
                  id="tf-invoice_status"
                  className="w-4 h-4 cursor-pointer"
                />
              </label>

              <label
                htmlFor="tf-number"
                className="flex items-center justify-between cursor-pointer"
              >
                <span className="text-xs text-[#444444]">Contact No.</span>
                <input
                  onChange={(e) => {
                    handleCheckboxChange("number", e);
                  }}
                  checked={tableFilter.number}
                  type="checkbox"
                  id="tf-number"
                  className="w-4 h-4 cursor-pointer"
                />
              </label>

              <label
                htmlFor="tf-company_name"
                className="flex items-center justify-between cursor-pointer"
              >
                <span className="text-xs text-[#444444]">Company Name</span>
                <input
                  onChange={(e) => {
                    handleCheckboxChange("company_name", e);
                  }}
                  checked={tableFilter.company_name}
                  type="checkbox"
                  id="tf-company_name"
                  className="w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Button Container */}
          <div className="flex justify-end gap-2 pt-2 pb-1 pr-4">
            <button
              onClick={hanldeApplyClick}
              className="rounded w-fit px-4 h-7 text-sm leading-none text-white bg-[#9A55FF]"
            >
              Apply
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("tableFilter");
                setTableFilter({
                  invoice_status: false,
                  number: false,
                  company_name: false,
                });
                setDropdownVisible(false);
              }}
              className="rounded w-fit px-4 h-7 text-sm leading-none text-white bg-[#2C2C2C]"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableFilterIconComponent;
