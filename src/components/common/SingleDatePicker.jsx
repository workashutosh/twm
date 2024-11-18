import Datepicker from "react-tailwindcss-datepicker";

const SingleDatePicker = ({
  inputClass,
  value,
  setValue,
  isDisabled = false,
}) => {
  const handleValueChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <Datepicker
      disabled={isDisabled}
      popoverDirection="down"
      asSingle={true}
      useRange={false}
      toggleClassName="absolute text-[#9A55FF] fill-[#9A55FF] stroke-[#9A55FF] path-[#9A55FF] rounded-r-lg  right-2 h-full "
      placeholder={"Enter Date"}
      inputClassName={
        "border pl-1 border-[#E0E0E0] w-[99%] text-xs h-8 rounded outline-none text-[#6F6B6B]  "
      }
      value={value}
      onChange={handleValueChange}
    />
  );
};
export default SingleDatePicker;
