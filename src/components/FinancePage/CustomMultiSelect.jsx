import { useState, useMemo, useEffect } from "react";

const CustomMultiSelect = ({ ddName, options, setValue }) => {
  // To store selected option values
  const [selectedOptions, setSelectedOptions] = useState([]);

  // To store the search text
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const selectedOptionsIds = selectedOptions.map((name) => {
      // Find the corresponding ID for the selected option
      const selectedOption = options.find((option) => option.name === name);
      return selectedOption ? selectedOption.id : null;
    });

    setValue(selectedOptionsIds.join(","));
  }, [selectedOptions]);

  // Function to toggle the selection of all options
  const toggleSelectAll = () => {
    if (selectedOptions.length === filteredOptions.length) {
      setSelectedOptions([]);
    } else {
      setSelectedOptions(filteredOptions.map((option) => option.name));
    }
  };

  // Function to clear all selections
  const toggleClearAll = () => {
    setSelectedOptions([]);
    setSearchText("");
  };

  // Function to handle a single option click
  const handleOptionClick = (name) => {
    if (selectedOptions.includes(name)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== name));
    } else {
      setSelectedOptions([...selectedOptions, name]);
    }
  };

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [options, searchText]);

  const selectedOptionsText = useMemo(() => {
    if (selectedOptions.length === 0) {
      return "Select Here..";
    }
    const text = selectedOptions.join(", ").substring(0, 20);
    return selectedOptions.length > 1 ? `${text}...` : text;
  }, [selectedOptions]);

  return (
    <div className="relative rounded shadow ">
      {/* Button  */}
      <button className="h-8 w-full  rounded border border-[#E0E0E0]  pl-3 text-left text-sm text-[#696969] focus:outline-none">
        {selectedOptionsText}
      </button>
      <div className="absolute z-10 mt-[6px]  shadow w-full rounded border border-[#E0E0E0] bg-white ">
        <div className="px-2 pt-2">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded border border-[#E0E0E0] pl-2 py-1  outline-none text-sm text-[#6F6B6B]"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="flex items-center justify-between mt-1">
            {/* Select All button */}
            <button
              onClick={toggleSelectAll}
              className="text-sm font-medium text-[#9A55FF]"
            >
              SELECT ALL
            </button>
            {/* Clear All button */}
            <button
              onClick={toggleClearAll}
              className="text-sm font-medium text-[#9A55FF]"
            >
              CLEAR ALL
            </button>
          </div>
          <div className="overflow-y-scroll modal max-h-40">
            {/* Render the filtered options */}
            {filteredOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => handleOptionClick(option.name)}
                className={`my-1 rounded flex cursor-pointer justify-between px-2 py-1 text-sm text-[#696969]  ${
                  selectedOptions.includes(option.name)
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

export default CustomMultiSelect;