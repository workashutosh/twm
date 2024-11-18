// import React from "react";
// import IMAGES from "../../images";

// const FilterItem = (setselectedFilter, selectedFilter) => {
//   return (
//     <div
//       id="filter-container"
//       className="pl-4 pr-4 h-[440px]  overflow-y-scroll pt-1 "
//     >
//       <div className="border-b border-b-[#F7F7F7] py-2">
//         {/* Name  */}
//         <div
//           onClick={() =>
//             setselectedFilter((prev) => (prev === "name" ? "" : "name"))
//           }
//           className="flex mt-1  justify-between cursor-pointer"
//         >
//           <p
//             className={` ${
//               selectedFilter === "name"
//                 ? "text-[#9A55FF] font-medium"
//                 : "text-[#6F6B6B] "
//             }  text-base text-[15px]  select-none cursor-pointer`}
//           >
//             Name
//           </p>
//           {selectedFilter === "name" && (
//             <img src={IMAGES.ArrowIcon} alt="arrow icon" className="mr-3 " />
//           )}
//         </div>
//         {selectedFilter === "name" && (
//           <div className="pt-2 pb-1">
//             <input
//               onChange={(e) => {
//                 console.log(e.target.value);
//               }}
//               placeholder={"Enter Here"}
//               type="text"
//               className="border  border-[#E0E0E0] outline-none rounded h-8 pl-2 placeholder:text-[#9D9D9D] placeholder:text-xs text-[#6F6B6B] text-sm w-[94%] font-normal"
//             />
//           </div>
//         )}

//         {/* Project */}
//         <div
//           onClick={() =>
//             setselectedFilter((prev) => (prev === "project" ? "" : "project"))
//           }
//           className="flex mt-3 justify-between cursor-pointer"
//         >
//           <p
//             className={` ${
//               selectedFilter === "project"
//                 ? "text-[#9A55FF] font-medium"
//                 : "text-[#6F6B6B] "
//             }  text-base text-[15px]  select-none cursor-pointer`}
//           >
//             Project
//           </p>
//           {selectedFilter === "project" && (
//             <img src={IMAGES.ArrowIcon} alt="arrow icon" className="mr-3 " />
//           )}
//         </div>
//         {selectedFilter === "project" && (
//           <div className="pt-2 pb-1">
//             <CustomMultiSelect
//               setValue={setSelectedProjectIds}
//               options={dropdownData?.project}
//             />
//           </div>
//         )}

//         {/* Configuration */}
//         <div
//           onClick={() =>
//             setselectedFilter((prev) =>
//               prev === "configuration" ? "" : "configuration"
//             )
//           }
//           className="mt-3 flex justify-between cursor-pointer"
//         >
//           <p
//             className={` ${
//               selectedFilter === "configuration"
//                 ? "text-[#9A55FF] font-medium"
//                 : "text-[#6F6B6B] "
//             }  text-base text-[15px]  select-none cursor-pointer`}
//           >
//             Configuration
//           </p>
//           {selectedFilter === "configuration" && (
//             <img src={IMAGES.ArrowIcon} alt="arrow icon" className="mr-3 " />
//           )}
//         </div>
//         {selectedFilter === "configuration" && (
//           <div className="pt-2 pb-1">
//             <input
//               onChange={(e) => {
//                 console.log(e.target.value);
//               }}
//               placeholder={"Enter Here"}
//               type="text"
//               className="border  border-[#E0E0E0] outline-none rounded h-8 pl-2 placeholder:text-[#9D9D9D] placeholder:text-xs text-[#6F6B6B] text-sm w-[94%] font-normal"
//             />
//           </div>
//         )}

//         {/*   OB Status */}
//         <div
//           onClick={() =>
//             setselectedFilter((prev) =>
//               prev === "ob_status" ? "" : "ob_status"
//             )
//           }
//           className="mt-3 flex justify-between cursor-pointer"
//         >
//           <p
//             className={` ${
//               selectedFilter === "ob_status"
//                 ? "text-[#9A55FF] font-medium"
//                 : "text-[#6F6B6B] "
//             }  text-base text-[15px]  select-none cursor-pointer`}
//           >
//             OB Status
//           </p>
//           {selectedFilter === "ob_status" && (
//             <img src={IMAGES.ArrowIcon} alt="arrow icon" className="mr-3 " />
//           )}
//         </div>
//         {selectedFilter === "ob_status" && (
//           <div className="pt-2 pb-1">
//             <input
//               onChange={(e) => {
//                 console.log(e.target.value);
//               }}
//               placeholder={"Enter Here"}
//               type="text"
//               className="border  border-[#E0E0E0] outline-none rounded h-8 pl-2 placeholder:text-[#9D9D9D] placeholder:text-xs text-[#6F6B6B] text-sm w-[94%] font-normal"
//             />
//           </div>
//         )}

//         {/* Sourced By */}
//         <div
//           onClick={() =>
//             setselectedFilter((prev) =>
//               prev === "sourced_by" ? "" : "sourced_by"
//             )
//           }
//           className="mt-3 flex justify-between cursor-pointer"
//         >
//           <p
//             className={` ${
//               selectedFilter === "sourced_by"
//                 ? "text-[#9A55FF] font-medium"
//                 : "text-[#6F6B6B] "
//             }  text-base text-[15px]  select-none cursor-pointer`}
//           >
//             Sourced By
//           </p>
//           {selectedFilter === "sourced_by" && (
//             <img src={IMAGES.ArrowIcon} alt="arrow icon" className="mr-3 " />
//           )}
//         </div>
//         {selectedFilter === "sourced_by" && (
//           <div className="pt-2 pb-1">
//             <CustomMultiSelect
//               setValue={sourcedBy}
//               options={dropdownData?.source_by_and_closed_by}
//             />
//           </div>
//         )}

//         {/* Closed By */}
//         <div
//           onClick={() =>
//             setselectedFilter((prev) =>
//               prev === "closed_by" ? "" : "closed_by"
//             )
//           }
//           className="mt-3 flex justify-between cursor-pointer"
//         >
//           <p
//             className={` ${
//               selectedFilter === "closed_by"
//                 ? "text-[#9A55FF] font-medium"
//                 : "text-[#6F6B6B] "
//             }  text-base text-[15px]  select-none cursor-pointer`}
//           >
//             Closed By
//           </p>
//           {selectedFilter === "closed_by" && (
//             <img src={IMAGES.ArrowIcon} alt="arrow icon" className="mr-3 " />
//           )}
//         </div>
//         {selectedFilter === "closed_by" && (
//           <div className="pt-2 pb-1">
//             <CustomMultiSelect
//               setValue={closedBy}
//               options={dropdownData?.source_by_and_closed_by}
//             />
//           </div>
//         )}

//         {/* Invoice Status */}
//         <div
//           onClick={() =>
//             setselectedFilter((prev) =>
//               prev === "invoice_status" ? "" : "invoice_status"
//             )
//           }
//           className="mt-3 flex justify-between cursor-pointer"
//         >
//           <p
//             className={` ${
//               selectedFilter === "invoice_status"
//                 ? "text-[#9A55FF] font-medium"
//                 : "text-[#6F6B6B] "
//             }  text-base text-[15px]  select-none cursor-pointer`}
//           >
//             Invoice Status
//           </p>
//           {selectedFilter === "invoice_status" && (
//             <img src={IMAGES.ArrowIcon} alt="arrow icon" className="mr-3 " />
//           )}
//         </div>
//         {selectedFilter === "invoice_status" && (
//           <div className="pt-2 pb-1">
//             <input
//               onChange={(e) => {
//                 console.log(e.target.value);
//               }}
//               placeholder={"Enter Here"}
//               type="text"
//               className="border  border-[#E0E0E0] outline-none rounded h-8 pl-2 placeholder:text-[#9D9D9D] placeholder:text-xs text-[#6F6B6B] text-sm w-[94%] font-normal"
//             />
//           </div>
//         )}

//         {/* Closure Date */}
//         <div
//           onClick={() =>
//             setselectedFilter((prev) =>
//               prev === "closure_date" ? "" : "closure_date"
//             )
//           }
//           className="mt-3 flex justify-between cursor-pointer"
//         >
//           <p
//             className={` ${
//               selectedFilter === "closure_date"
//                 ? "text-[#9A55FF] font-medium"
//                 : "text-[#6F6B6B] "
//             }  text-base text-[15px]  select-none cursor-pointer`}
//           >
//             Closure Date
//           </p>
//           {selectedFilter === "closure_date" && (
//             <img src={IMAGES.ArrowIcon} alt="arrow icon" className="mr-3 " />
//           )}
//         </div>
//         {selectedFilter === "closure_date" && (
//           <div className="custom-daterange pt-2 pb-1">
//             <DateRangePicker value={closureDate} setValue={setClosureDate} />
//           </div>
//         )}

//         {/* Follow Up Date */}
//         <div
//           onClick={() =>
//             setselectedFilter((prev) =>
//               prev === "follow_up_date" ? "" : "follow_up_date"
//             )
//           }
//           className="mt-3 flex justify-between cursor-pointer"
//         >
//           <p
//             className={` ${
//               selectedFilter === "follow_up_date"
//                 ? "text-[#9A55FF] font-medium"
//                 : "text-[#6F6B6B] "
//             }  text-base text-[15px]  select-none cursor-pointer`}
//           >
//             Follow Up Date
//           </p>
//           {selectedFilter === "follow_up_date" && (
//             <img src={IMAGES.ArrowIcon} alt="arrow icon" className="mr-3 " />
//           )}
//         </div>
//         {selectedFilter === "follow_up_date" && (
//           <div className="custom-daterange pt-2 pb-1">
//             <DateRangePicker value={followUpDate} setValue={setFollowUpDate} />
//             {/* <input
//             onChange={(e) => {
//               console.log(e.target.value);
//             }}
//             placeholder={"Enter Here"}
//             type="date"
//             className="border  border-[#E0E0E0] outline-none rounded h-8 pl-2 placeholder:text-[#9D9D9D] placeholder:text-xs text-[#6F6B6B] text-sm w-[94%] font-normal"
//           /> */}
//           </div>
//         )}
//       </div>

//       {/* Icon's Container (search, clear all, save filters)*/}
//       <div className="sticky bottom-0 flex items-center justify-end gap-3 py-1 bg-white ">
//         <img
//           onClick={handleFilter}
//           className="cursor-pointer"
//           src={IMAGES.SearchIcon}
//           alt="search icon "
//         />
//         <img
//           onClick={() => {
//             setIsFiltersVisible(false);
//             setselectedFilter(null);
//           }}
//           className="cursor-pointer"
//           src={IMAGES.ClearAllIcon}
//           alt="clear all icon"
//         />
//         <img className="cursor-pointer" src={IMAGES.SaveIcon} alt="save icon" />
//       </div>
//     </div>
//   );
// };

// export default FilterItem;
