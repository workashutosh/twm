const InputWithLabel = ({ value, setValue, type, name }) => {
  return (
    <div className="relative border mt-5 lg:mt-0 border-[#E0E0E0] rounded h-9 flex-1">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type={type}
        placeholder="Enter Here.."
        className="outline-none w-full h-full rounded placeholder:text-[#9D9D9D] placeholder:text-xs pl-3 text-[#9D9D9D] text-xs"
      />
      <span className="absolute px-1 -top-3 left-4 text-[#696969] text-sm bg-white ">
        {name}
      </span>
    </div>
  );
};

export default InputWithLabel;
