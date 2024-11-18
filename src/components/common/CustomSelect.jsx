import React from 'react';
import IMAGES from "@images";

const CustomSelect = ({ name, values, setChange, currentVal }) => {


  return (
    <div className="relative mt-5 lg:mt-0 border border-[#E0E0E0] rounded h-9 flex-1">
      <select
        value={currentVal}
        onChange={(e) => setChange(e.target.value)}
        className="outline-none h-full rounded w-full text-[#696969] text-xs pl-3 pt-1
        appearance-none "
      >
        <option hidden>Select Here</option>
        {values?.map((value) => (
          <option className="text-xs" key={value.id} value={value.id}>
            {value.name}
          </option>
        ))}
      </select>
      <span className="absolute px-1 -top-3 left-4 text-[#696969] text-sm bg-white ">
        {name}
      </span>
      <img
        src={IMAGES.ArrowIcon}
        alt="arrow icon"
        className="absolute top-[40%] left-[92%] rotate-180"
      />
    </div>
  );
};

export default CustomSelect;
