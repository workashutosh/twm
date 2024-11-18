import { useEffect, useMemo, useRef, useState } from "react";
import IMAGES from "@images";

const MultiSelect = ({ name, values }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(true);
  const dropdownRef = useRef(null);

  // in filter type options to maintain the selected ones
  const [activeElementIds, setActiveElementIds] = useState([]);

  const [activeElementText, setActiveElementText] = useState([]);
  // in type options handling the click of individual options
  const handleElementClick = (id, text) => {
    setActiveElementIds((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((activeId) => activeId !== id);
      } else {
        return [...prevIds, id];
      }
    });

    setActiveElementText((prevText) => {
      if (prevText.includes(text)) {
        return prevText.filter((activeText) => activeText !== text);
      } else {
        return [...prevText, text];
      }
    });
  };

  // Function to close the dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };
  useEffect(() => {
    // Add event listener when the dropdown is visible
    if (isDropdownVisible) {
      document.addEventListener("click", handleClickOutside);
    }
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownVisible]);

  const selectedOptionsText = useMemo(() => {
    if (activeElementText.length === 0) {
      return "Select Here..";
    }
    const text = activeElementText.join(", ").substring(0, 20);
    return activeElementText.length > 1 ? `${text}...` : text;
  }, [activeElementText]);

  return (
    <div
      ref={dropdownRef}
      className="relative  border border-[#E0E0E0] rounded h-9 flex-1 "
      onClick={() => setDropdownVisible(!isDropdownVisible)}
    >
      <p className="text-sm pt-2 pl-3  text-[#696969]">{selectedOptionsText}</p>
      <span className="absolute px-1 -top-3 left-4 text-[#696969] text-sm bg-white ">
       {name}
      </span>
      <img
        src={IMAGES.ArrowIcon}
        alt="arrow icon"
        className="absolute top-[40%] left-[92%] rotate-180"
      />
      {isDropdownVisible && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-10 w-full overflow-y-scroll bg-white shadow-md top-10 max-h-32 modal"
        >
          {values.map((value, id) => (
            <div
              key={value.id}
              onClick={() => {
                handleElementClick(value.id, value.name);
              }}
              className={`text-xs text-[#6F6B6B]   ${
                activeElementIds.includes(value.id)
                  ? "bg-[#F8EFFF]"
                  : "bg-white"
              } cursor-pointer  px-2 py-[5px] my-1 font-medium `}
            >
              {value.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
