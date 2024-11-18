import { useState, useMemo, useEffect } from "react";

const CustomSingleSelect = ({ ddName, options, setValue }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setValue(selectedOption ? selectedOption.id : null);
  }, [selectedOption]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  // Inside your CustomSingleSelect component
const filteredOptions = useMemo(() => {
  return options?.filter((option) => {
    // Adjust the condition based on your search criteria
    return option.name && option.name.toLowerCase().includes(searchText.toLowerCase());
  }) ?? [];
}, [options, searchText]);



  const selectedOptionText = useMemo(() => {
    return selectedOption ? selectedOption.name : "Select Here...";
  }, [selectedOption]);

  return (
    <div className="relative rounded shadow">
      {/* Button */}
      <button className="h-8 w-full rounded border border-[#E0E0E0] pl-3 text-left text-sm text-[#696969] focus:outline-none">
        {selectedOptionText}
      </button>
      <div className="absolute z-10 mt-[6px] shadow w-full rounded border border-[#E0E0E0] bg-white">
        <div className="px-2 pt-2">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded border border-[#E0E0E0] pl-2 py-1  outline-none text-sm text-[#6F6B6B]"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="overflow-y-scroll max-h-40">
            {/* Render the filtered options */}
            {filteredOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => handleOptionClick(option)}
                className={`my-1 rounded flex cursor-pointer justify-between px-2 py-1 text-sm text-[#696969]  ${
                  selectedOption && selectedOption.id === option.id
                    ? "bg-[#EADCFF] after:content-['✓'] text-black"
                    : ""
                }`}
              >
                {option.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomSingleSelect;
