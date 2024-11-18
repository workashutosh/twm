import React, { useState, useEffect, useRef, useContext } from "react";
import { AppContext } from "@context/AppContext";


const TableSeeMore = ({
  setSelectedBookingID,
  setSelectedClientID,
  followUp,
  details,
  setDetailsData,
  setClientName,
  data,
  invoice,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef(null);
  // Close the dropdown when clicking anywhere else on the page
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsVisible(false);
     // setQuickUpdate(false);
    }
  };

  const { activeUserData } = useContext(AppContext);

  function storeActivity(userId, activityName, userName) {
    // Retrieve existing activity data from localStorage
    const existingActivities = localStorage.getItem('userActivities');
  
    // Parse existing data or initialize as an empty array if it doesn't exist yet
    const activities = existingActivities ? JSON.parse(existingActivities) : [];
  
    // Get the current date and time
    const currentDate = new Date();
    const timing = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;
  
    // Create a new activity object
    const newActivity = {
      userId: userId,
      userName: userName,
      activityName: activityName,
      timing: timing
    };
  
    // Add the new activity to the activities array
    activities.push(newActivity);
  
    // Convert activities array to JSON string
    const activitiesJson = JSON.stringify(activities);
  
    // Store the JSON string in localStorage
    localStorage.setItem('userActivities', activitiesJson);
  }


  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative h-full z-[100] cursor-pointer text-left text-[#8B8B8B]"
      onClick={() => setIsVisible(!isVisible)}
    >
      <span className="text-xl font-bold  rounded-sm h-3"><i className="fa-regular fa-pen-to-square mx-0.5 fa-xs"></i></span>
      {isVisible && (
        <div
          className="absolute top-0 w-40 pt-2 pb-1 px-2 text-left bg-white border-gray-300 rounded-md shadow-lg -left-40"
          ref={dropdownRef}
        >
          <p
            onClick={() => {
              setSelectedBookingID(data?.generic_details?.booking_id);
              storeActivity(activeUserData?.id, "Viewed Booking Details", activeUserData?.name);
              followUp((prev) => !prev);
            }}
            className="px-3  py-[6px] text-xs rounded-md hover:bg-[#9A55FF] hover:text-white"
          >
            Follow Up
          </p>
          <p
            onClick={() => {
              details((prev) => !prev);
              setDetailsData(data);
              setClientName(data?.generic_details?.name);
              storeActivity(activeUserData?.id, "Viewed Booking Details", activeUserData?.name);
            }}
            className="px-3  py-[6px] text-xs rounded-md hover:bg-[#9A55FF] hover:text-white"
          >
            Details
          </p>

          <p
            onClick={() => {
              setSelectedClientID(data?.generic_details?.client_id);
              setClientName(data?.generic_details?.name);
              storeActivity(activeUserData?.id, "Viewed Client Details", activeUserData?.name);
              invoice((prev) => !prev);
            }}
            className="px-3  py-[6px] text-xs rounded-md hover:bg-[#9A55FF] hover:text-white"
          >
            Invoice
          </p>
        </div>
      )}
    </div>
  );
};

export default TableSeeMore;
