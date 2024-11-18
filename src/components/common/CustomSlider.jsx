import React, { useState, useContext, useEffect } from "react";
import ReactSlider from "react-slider";

const CustomSlider = ({ name, onValuesChange }) => {
  const [min, setMin] = useState(null);
  const [max, setMax] = useState(10000000);

  useEffect(() => {
    if (min <= max && min >= 0 && max <= 10000000) {
      onValuesChange({ name, min, max });
    }
  }, [min, max]);

  const handleMinChange = (e) => {
    let newMin = Math.max(0, parseInt(e.target.value, 10) || 0);
    if (newMin > max) {
      newMin = max;
    }
    setMin(newMin);
  };

  return (
    <div className="w-full rounded border border-[#E0E0E0] py-4 px-3 mt-3">
      <ReactSlider
        className="horizontal-slider"
        thumbClassName="thumb"
        trackClassName="track"
        defaultValue={[0, 10000000]}
        value={[min, max]}
        min={0}
        max={10000000}
        onChange={(e) => {
          setMin(e[0]);
          setMax(e[1]);
        }}
        pearling
        minDistance={10}
      />

      <div className="flex justify-between mt-4">
        <div className=" w-[45%]">
          <input
            min={0}
             placeholder="min (Lacs)"
            type="number"
            className="border border-[#E0E0E0] pl-2 placeholder:text-xs placeholder:text-[#9D9D9D] outline-none text-[#696969] text-sm h-7 rounded-md w-full"
            value={min}
            onChange={handleMinChange}
          />
        </div>

        <div className=" w-[45%]">
          <input
            max={10000000}
            type="number"
            placeholder="max (Lacs)"
            className="border border-[#E0E0E0] pl-2 placeholder:text-xs placeholder:text-[#9D9D9D] outline-none text-[#696969] text-sm h-7 rounded-md w-full"
            value={max}
            onChange={(e) =>
              setMax(Math.min(10000000, parseInt(e.target.value, 10) || 0))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CustomSlider;

