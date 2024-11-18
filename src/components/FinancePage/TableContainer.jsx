import axios from "axios";
import React, { useEffect, useState , useContext} from "react";
import { toast } from "react-toastify";
import Loader from "@common/Loader";
import FollowUpModal from "@financepage/FollowUpModal";
import TableSeeMore from "@financepage/TableSeeMore";
import DetailsModal from "@financepage/DetailsModal";
import InvoiceModal from "@financepage/InvoiceModal";
import { useFilterContext } from '@context/FilterContext';
import useStore from '@store/index.jsx';
import IMAGES from "@images";
import { AppContext } from "@context/AppContext";
import apiInstance from '@api/apiInstance';
import { useLoggerStore } from "@store/log.jsx";
import { getLocalStorage } from "@utils/getLocalStorage";
import LoaderComponent from "../common/LoaderComponent";





const TableContainer = ({ isSidebarVisible, tableFilter }) => {
  const [tableData, setTableData] = useState([]);
  
  const [loading, setLoading] = useState(true);

  const [isFollowUpModalVisible, setIsFollowUpModalVisible] = useState(false);

  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);

  const [detailsData, setDetailsData] = useState({});

  const [clientName , setClientName] = useState("");

  const [selectedBookingID, setSelectedBookingID] = useState();

  const [selectedRow, setSelectedRow] = useState(null);

  const [ReqBody, setReqBody] = useState([]);

  const [selectedClientId, setSelectedClientID] = useState();
  
  const [mainRequest , setMainReqestBody] = useState([]);

  const [actualCount , setActualCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const { filterData } = useFilterContext();

  const {  sortByRefData , reloadTc } = useStore();

  const { activeUserData } = useContext(AppContext);

  const {logData, updateActivityLog , activityLog , initializeLogData } = useLoggerStore();




  const handleLogCheck = async (log) => {
   // updateUserLog({ user_id: "newUserId" });
   updateActivityLog(log);
    //console.log(logData)
  //  console.log(logData)
  } 

  useEffect(() => {
    initializeLogData(activeUserData);
  }, [activeUserData, initializeLogData]);


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

 // window.onload = storeActivity(activeUserData?.user_id , activeUserData?.user_name , "Loaded Main Home Finance Page");
 
  const handleRowClick = (index) => {
    setSelectedRow(index);
  };


  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    handleLogCheck(`Booking Details Table page visited on ${pageNumber}`);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalCount / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {

    if (filterData) {
      handleLogCheck(`Filter applied on Booking Details Table for ${JSON.stringify(filterData)}`);
      setMainReqestBody(filterData);
      setCurrentPage(1);
    }
    
  
  }, [filterData]);
    ///console.log(sortByRefData);

    useEffect(() => {
      if (sortByRefData !== null ) {
        let updatedRequest = {...mainRequest}; 
        if (sortByRefData.typeName === "closure") {
          updatedRequest.recent_closure = "True";
          delete updatedRequest.max_av;
        } else if (sortByRefData.typeName === "av") {
          updatedRequest.max_av = "True";
          delete updatedRequest.recent_closure;
        }
       // console.log(updatedRequest);
        setMainReqestBody(updatedRequest); 
      }
    }, [sortByRefData]);

    useEffect(() => {
      setMainReqestBody(null); 
    }, []);

    const fetchTableData = async () => {
      try {
        const res = await apiInstance(
          `client/fetch2.php?page=${currentPage}`,
          'POST',
          mainRequest
        );
        const filteredData = res?.data.filter(item => !item.count);
        if (currentPage === 1) {
          setTotalCount(res?.data[0]?.count);
        }
        setTableData(filteredData);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    
    
    useEffect(() => {
      fetchTableData();
    }, [currentPage, mainRequest , totalCount]);


  const configurationIdMapping = {
    1: "1 BHK",
    2: "1.5 BHK",
    3: "2 BHK",
    4: "2.5 BHK",
    5: "3 BHK",
    6: "3.5 BHK",
    7: "4 BHK",
    8: "4.5 BHK",
    9: "5 BHK",
    10: "5.5 BHK",
    11: "MORE THAN 6",
    12: "COMMERCIAL",
    13: "PLOT",
    14: "VILLA",
  };

  const obStatusMapping = {
    1: "BA1",
    2: "BA2",
    3: "SDR",
    4: "Composite Payment",
    5: "BA 3",
  };

  const convertAmount = (number) => {
    if (isNaN(number)) {
      return;
    }
  
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  
    return formatter.format(number);
  };

  const handleModalClose = () => {
    setIsDetailsModalVisible(false);
    setIsFollowUpModalVisible(false);
    setIsInvoiceModalVisible(false);
    fetchTableData(); 
  };


  function sortData(type){
    handleLogCheck(`sorted by ${type}`);
    let updatedRequest = {...mainRequest};
    let keys = ["av_desc", "av_asc" , "recent_f_desc" , "recent_f_asc" ,  "closure_desc", "closure_asc" ,  "recent_f", "inv_no_desc", "inv_no_asc" , 
    "inv_amt_desc",  "inv_amt_asc" , "raise_date_desc", "raise_date_asc" , "expected_desc", "expected_asc"];

    keys.forEach(key => {
        if (key === type) {
            updatedRequest[key] = "True";
        } else {
            delete updatedRequest[key];
        }
    });

    //console.log(updatedRequest);
    setMainReqestBody(updatedRequest); 
  }


  function calculatePercentage(percent, amount) {
    // Convert percent to decimal
    const decimalPercent = percent / 100;
    
    // Calculate the result
    const result = amount * decimalPercent;
    
    // Round to two decimal places to avoid floating point precision issues
    return Math.round(result * 100) / 100;
  }

  function calculateBrokerageAmount(base , ladder , aop , agreementValue) {
        
        let total_percent = 0;
        if(base){
            total_percent += Number(base);
        }
        if(ladder){
            total_percent += Number(ladder);
        }
        if(aop){
            total_percent += Number(aop);
        }
        let total_amount = 0;
        if(total_percent && agreementValue){
            total_amount = calculatePercentage(total_percent , agreementValue);
        } 
        return total_amount;
  }

  

  if (loading) return <LoaderComponent />;


  //console.log(totalCount);
  return (
    <>
    
      <div
        id="table-container"
        className={`border-t border-t-[#F6F6F6] mx-1  ${
          isSidebarVisible ? " max-w-[78.7vw]" : "max-w-[91vw]"
        } max-h-[72vh] rounded-t-lg overflow-auto tableContainer`}
      >
        <table className="w-full border mt-0">
          <thead className="h-14 bg-[#F7F8FF] sticky top-[-1%] mt-0 z-10">
          <tr>
           <th className="text-[#9A55FF] font-medium text-xs text-start pl-2 pr-2 min-w-[10zvw]">
             Name
           </th>
           <th className="text-[#9A55FF] font-medium text-xs min-w-[6vw]">
             Project
           </th>
           <th className="text-[#9A55FF] font-medium text-xs min-w-[6vw]">
             Unit <br /> Details
           </th>
           <th className="text-[#9A55FF] font-medium text-xs min-w-[2vw]">
             Brokerage %
           </th>
           <th className="text-[#9A55FF] font-medium text-xs min-w-[2vw]">
             Ladder %
           </th>
           <th className="text-[#9A55FF] font-medium text-xs min-w-[2vw]">
             AOP %
           </th>
           <th className="text-[#9A55FF] font-medium text-xs min-w-[8vw] relative">
             Agreement <br /> Value
             <div className=" flex flex-col absolute right-0 top-[23%] mr-2">
                      <i className="fa-solid fa-caret-up hover:text-red-800 cursor-pointer" onClick={() => sortData("av_desc")}></i>
                      <i className="fa-solid fa-caret-down hover:text-red-800 cursor-pointer" onClick={() => sortData("av_asc")}></i>
                         </div>
           </th>
           <th className="text-[#9A55FF] font-medium text-xs min-w-[8vw] relative"> Brokerage <br /> Amount </th>
           <th className="text-[#9A55FF] font-medium text-xs min-w-[2vw]">Status</th>
           <th className="text-[#9A55FF] font-medium text-xs min-w-[6vw]">
             ON Boarding <br /> Status
           </th>
           <th className="text-[#9A55FF] font-medium text-xs min-w-[8vw] relative">
             Closure <br /> Date
             <div className=" flex flex-col absolute right-0 top-[23%] mr-2">
                      <i className="fa-solid fa-caret-up hover:text-red-800 cursor-pointer" onClick={() => sortData("closure_desc")}></i>
                      <i className="fa-solid fa-caret-down hover:text-red-800 cursor-pointer" onClick={() => sortData("closure_asc")}></i>
                         </div>
           </th>
           <th className="text-[#9A55FF] font-medium text-xs min-w-[6vw] relative">
             Inv No.
             <div className=" flex flex-col absolute right-0 top-[23%] mr-2">
                      <i className="fa-solid fa-caret-up hover:text-red-800 cursor-pointer" onClick={() => sortData("inv_no_desc")}></i>
                      <i className="fa-solid fa-caret-down hover:text-red-800 cursor-pointer" onClick={() => sortData("inv_no_asc")}></i>
                         </div>
           </th>
           <th className="text-[#9A55FF] font-medium text-xs min-w-[8vw] relative">
             Inv Amount
             <div className=" flex flex-col absolute right-0 top-[23%] mr-2">
                      <i className="fa-solid fa-caret-up hover:text-red-800 cursor-pointer" onClick={() => sortData("inv_amt_desc")}></i>
                      <i className="fa-solid fa-caret-down hover:text-red-800 cursor-pointer" onClick={() => sortData("inv_amt_asc")}></i>
                         </div>
           </th>
           <th className="text-[#9A55FF] font-medium text-xs min-w-[8vw] relative">
             Raise <br /> Date
             <div className=" flex flex-col absolute right-0 top-[23%] mr-2">
                      <i className="fa-solid fa-caret-up hover:text-red-800 cursor-pointer" onClick={() => sortData("raise_date_desc")}></i>
                      <i className="fa-solid fa-caret-down hover:text-red-800 cursor-pointer" onClick={() => sortData("raise_date_asc")}></i>
                         </div>
           </th>
           <th className="text-[#9A55FF] font-medium text-xs min-w-[8vw] relative">
             Expected <br /> Date
             <div className=" flex flex-col absolute right-0 top-[23%] mr-2">
                      <i className="fa-solid fa-caret-up hover:text-red-800 cursor-pointer" onClick={() => sortData("expected_desc")}></i>
                      <i className="fa-solid fa-caret-down hover:text-red-800 cursor-pointer" onClick={() => sortData("expected_asc")}></i>
                         </div>
           </th>
           {tableFilter?.invoice_status && (
          <th className="text-[#9A55FF] font-medium text-xs min-w-[6vw]">
            Location <br /> Name
          </th>
             )}
         {tableFilter?.number && (
           <th className="text-[#9A55FF] font-medium text-xs min-w-[6vw]">
             Contact Number
           </th>
         )}
         {tableFilter?.company_name && (
           <th className="text-[#9A55FF] font-medium text-xs min-w-[6vw]">
             Company Name
           </th>
         )}
         <th className="text-[#9A55FF] font-bold text-left text-xl min-w-[2vw] sticky right-0 bg-inherit drop-shadow-2xl top-[-1%] bg-[#F1EEFF]">
             ⁝
         </th>
         </tr>

          </thead>

          <tbody>
          {totalCount > 0 ? (
           tableData.map((item, index) => (

              <tr
                key={index}
                className={`h-14 ${
                  item?.generic_details?.inv_count == "0" && item?.ob_status_details?.status_id == "4" ? 'bg-[#cacff4]' : ''
                } border-b my-2 ${selectedRow === index ? 'highlighted-row' : ''}`}
                onClick={() => handleRowClick(index)}
              >
               <td className="pl-3 font-medium text-xs  text-[#595959]">
               {item?.generic_details?.name &&
                    (() => {
                        const nameParts = item.generic_details.name.split(' ');
                        if (nameParts.length === 3) {
                            return (
                                <>
                                    <div>{nameParts[0]} {nameParts[1]}</div>
                                    <div>{nameParts[2]}</div>
                                </>
                            );
                        } else {
                            return <div>{item.generic_details.name}</div>;
                        }
                    })()
                }
                </td>
                <td className="text-center   text-[#595959] text-xs font-medium">
                  {item?.generic_details?.project_name}
                </td>
                <td className="text-center   text-xs ">
                  {
                    configurationIdMapping[
                      item?.generic_details?.configuration_id
                    ]
                  }
                </td>
                <td className="text-center text-xs">
                    {item?.fetched_brokerage_percent ?? 0}
                  </td>

                  <td className="text-center text-xs">
                  {item?.fetched_ladder_percent ?? 0}
                  </td>
                  <td className="text-center text-xs">
                    {item?.aop_percent ?? 0}
                  </td>
                  <td className="text-center text-xs">
                    {convertAmount(item?.generic_details?.agreement_value) || '-'}
                  </td>
                  <td className="text-center text-xs">
                    {convertAmount(calculateBrokerageAmount(item?.fetched_brokerage_percent , item?.fetched_ladder_percent , item?.aop_percent , item?.generic_details?.agreement_value)) || '0'}
                  </td>
                  <td className="text-center text-[10px]">
                    <span className={item?.generic_details?.active === 'Y' ? 'text-green-500' : 'text-red-500'}>
                      {item?.generic_details?.active === 'Y' ? 'Active' : 'Cancelled'}
                    </span>
                  </td>
                <td className={`  text-center text-xs `}>
                  {obStatusMapping[item?.ob_status_details?.status_id]}
                </td>
                
                  <td className="text-center text-xs">
                    {item?.generic_details?.closure_date
                      ? new Date(item?.generic_details?.closure_date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : '-'}
                  </td>
                  
                  <td className="text-center text-xs">
                  {(item?.generic_details?.latest_invoice_number) || 0} <br />
                  {(item?.generic_details?.latest_invoice_type)}
                  </td>
                  <td className="text-center text-xs">
                    {convertAmount(+item?.generic_details?.latest_invoice_value) || 0}
                  </td>
                  <td className="text-center text-xs">
                  {item?.generic_details?.raise_date
                      ? new Date(item?.generic_details?.raise_date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : '-'}
                  </td>
                  <td className="text-center text-xs">
                  {item?.generic_details?.expected_date
                      ? new Date(item?.generic_details?.expected_date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : '-'}
                  </td>
                  
                {tableFilter?.invoice_status && (
                  <td className="text-center text-xs ">
                    {item?.location_name}
                  </td>
                )}
                {tableFilter?.number && (
                  <td className="text-center text-xs ">
                    {item?.generic_details?.number}
                  </td>
                )}
                {tableFilter?.company_name && (
                  <td className="text-center text-[#8C8989] text-xs ">{item?.company_name}</td>
                )}
                <td className="sticky right-0 bg-white mx-px" onClick={() => storeActivity(activeUserData?.user_id, activeUserData?.user_name, `Clicked on View more for client called ${item?.generic_details?.name} `)}>
                    <TableSeeMore
                      setSelectedBookingID={setSelectedBookingID}
                      setSelectedClientID={setSelectedClientID}
                      data={item}
                      setDetailsData={setDetailsData}
                      setClientName={setClientName}
                      followUp={
                        item?.generic_details?.active !== 'N'
                        ? setIsFollowUpModalVisible
                        : () => {
                            toast.error('Cannot Follow up on Cancelled Booking');
                          }
                        }
                      details={setIsDetailsModalVisible}
                      invoice={
                        item?.ob_status_details?.status_id > 3 
                          ? setIsInvoiceModalVisible
                          : () => {
                              toast.error('Composite Payment not Completed');
                            }
                      }
                    />
                  </td>
              </tr>
           ))
           ) : (
            <tr className="text-center">
            <td colSpan="9" className="text-center py-8"> 
              <img src={IMAGES.NoData} alt="No Data" className="w-9 mx-auto" /> 
              <p className="text-xs mt-2">No data found</p> 
            </td>
          </tr>
          
              )}
          </tbody>
          
        </table>

   
      </div>
      <div className="flex justify-between items-center py-4 mr-4">
        <p className=" text-xs ml-3 text-gray-600">{totalCount} clients in total</p>
        <ul className="flex gap-1">
          <li
            onClick={() => paginate(currentPage - 1)}
            className={`border border-[#E0E0E0] w-9 h-9 text-center pt-1 rounded-xl ${
              currentPage === 1
                ? "bg-white text-[#686868] cursor-not-allowed"
                : "bg-white text-[#686868] cursor-pointer"
            }`}
          >
            <a className="pt-1">
              &lt;
            </a>
          </li>
          
              {pageNumbers.map((number) => {
            if (
              number === 1 ||
              number === currentPage - 1 ||
              number === currentPage ||
              number === currentPage + 1 ||
              number === Math.ceil(totalCount / itemsPerPage)
            ) {
              return (
                <li
                  key={number}
                  onClick={() => paginate(number)}
                  className={`border border-[#E0E0E0] w-9 h-9 text-center pt-1 rounded-xl ${
                    currentPage === number
                      ? "bg-[#9A55FF] text-white cursor-not-allowed"
                      : "bg-white text-[#686868] cursor-pointer"
                  }`}
                >
                  <a href="#">
                    {number}
                  </a>
                </li>
              );
            } else if (
              number === 2 ||
              number === Math.ceil(totalCount / itemsPerPage) - 1
            ) {
              return (
                <li
                  key={number}
                  className="border border-[#E0E0E0] w-9 h-9 text-center pt-1 cursor-not-allowed rounded-xl"
                >
                  <span className="page-link">...</span>
                </li>
              );
            }
            return null;
          })}

              <li
            onClick={() => {
              if (currentPage !== Math.ceil(totalCount / itemsPerPage)) {
                paginate(currentPage + 1);
              }
            }}
            className={`border border-[#E0E0E0] w-9 h-9 text-center pt-1 rounded-xl ${
              currentPage === Math.ceil(totalCount / itemsPerPage)
                ? "bg-white text-[#686868] cursor-not-allowed"
                : "bg-white text-[#686868] cursor-pointer"
            }`}
          >
            <a href="#" className="pt-1">
              &gt;
            </a>
          </li>
        </ul>
      </div>
      
      

      

      {isFollowUpModalVisible && (
        <FollowUpModal
          bookingID={selectedBookingID}
          onClose={handleModalClose}
        />
      )}
      {isDetailsModalVisible && (
        <DetailsModal
          detailsData={detailsData}
          clientName={clientName}
          onClose={handleModalClose}
        />
      )}
      {isInvoiceModalVisible && (
        <InvoiceModal
        clientID={selectedClientId} 
        clientName={clientName}
        onClose={handleModalClose} />
      )}
    </>
  );
};

export default TableContainer;
