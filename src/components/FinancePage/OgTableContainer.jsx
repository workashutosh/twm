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
  

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const { filterData } = useFilterContext();

  const {  sortByRefData , reloadTc } = useStore();

 /*   if(tableData !== null){
    console.log(tableData);
  }  */

 
  const handleRowClick = (index) => {
    setSelectedRow(index);
  };

  const sortByAgreementValue = () => {
    const sortedTableData = [...tableData];

    sortedTableData.sort((a, b) => {
      const valueA = parseInt(a.generic_details.agreement_value, 10);
      const valueB = parseInt(b.generic_details.agreement_value, 10);

      return valueB - valueA; 
    });

    setTableData(sortedTableData);
  };


  const sortByRecentClosureDate = () => {
    const sortedTableData = [...tableData];

    sortedTableData.sort((a, b) => {
      const dateA = new Date(a.generic_details.closure_date);
      const dateB = new Date(b.generic_details.closure_date);

      return dateB - dateA;
    });

    setTableData(sortedTableData);
  };


  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalCount / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {

    if (filterData) {
     // console.log(filterData);
      const filtereddata = filterData?.filter(item => !item.count);
    //  console.log(filtereddata);
      setTableData(filtereddata);
      setTotalCount(filterData.count);
    }
  
  }, [filterData]);
  
  useEffect(() => {
    if (sortByRefData !== null && filterData == null) {
      const newReqBody = [];
  
      if (sortByRefData.typeName === "closure") {
        newReqBody.push({ "recent_closure": "True" });
      } else if (sortByRefData.typeName === "av") {
        newReqBody.push({ "max_av": "True" });
      }
  
      setReqBody(newReqBody);
    }
  }, [sortByRefData , filterData]);


  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const res = await apiInstance(`client/filterFetch.php?page=${currentPage}`, 'POST', ReqBody[0]);
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
  
    fetchTableData();
  }, [currentPage, ReqBody]);
  
  


  const obStatusStyles = {
    sdr: "text-[#04B900] font-medium text-sm",
    ba_2: "text-[#F5BD1E] font-medium text-sm",
  };


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


  if (loading) return <Loader />;
  //console.log(tableData);
  return (
    <>
      <div
        id="table-container"
        className={`border-t border-t-[#F6F6F6] mx-1  ${
          isSidebarVisible ? " max-w-[78.7vw]" : "max-w-[91vw]"
        } max-h-[75vh] overflow-y-scroll overflow-x-scroll`}
      >
        <table className="w-full">
          <thead className="h-14 bg-[#F7F8FF] ">
          <tr>
           <th className="text-[#9A55FF] font-medium text-base text-start pl-2 pr-2 min-w-[5vw]">
             Name
           </th>
           <th className="text-[#9A55FF] font-medium text-base min-w-[6vw]">
             Project
           </th>
           <th className="text-[#9A55FF] font-medium text-base min-w-[6vw]">
             Unit <br /> Details
           </th>
           <th className="text-[#9A55FF] font-medium text-base min-w-[2vw]">
             Brokerage %
           </th>
           <th className="text-[#9A55FF] font-medium text-base min-w-[2vw]">
             Ladder %
           </th>
           <th className="text-[#9A55FF] font-medium text-base min-w-[6vw]">
             Agreement <br /> Value
           </th>
           <th className="text-[#9A55FF] font-medium text-base min-w-[6vw]">
             ON Boarding <br /> Status
           </th>
           <th className="text-[#9A55FF] font-medium text-base min-w-[8vw]">
             Recent <br /> Followup
           </th>
           <th className="text-[#9A55FF] font-medium text-base min-w-[8vw]">
             Closure <br /> Date
           </th>
           {tableFilter?.invoice_status && (
          <th className="text-[#9A55FF] font-medium text-base min-w-[6vw]">
            Location <br /> Name
          </th>
         )}
         {tableFilter?.number && (
           <th className="text-[#9A55FF] font-medium text-base min-w-[6vw]">
             Contact Number
           </th>
         )}
         {tableFilter?.company_name && (
           <th className="text-[#9A55FF] font-medium text-base min-w-[6vw]">
             Company Name
           </th>
         )}
         <th className="text-[#9A55FF] font-bold text-left text-xl min-w-[2vw]">
           ⁝
         </th>
         </tr>

          </thead>

          <tbody>
          {tableData.map((item, index) => (
              <tr
                key={index}
                className={`h-14 ${
                  item?.invoice_details?.post_raise_id === 4 ? 'bg-[#ECECEC]' : ''
                } border-b my-2 ${selectedRow === index ? 'highlighted-row' : ''}`}
                onClick={() => handleRowClick(index)}
              >
               <td className="pl-3 font-medium text-base text-[#595959]">
                  {item?.generic_details?.name &&
                    item?.generic_details?.name.split(' ').map((part, index) => (
                      <div key={index}>{part}</div>
                    ))}
                </td>
                <td className="text-center   text-[#595959] text-sm font-medium">
                  {item?.generic_details?.project_name}
                </td>
                <td className="text-center   text-sm ">
                  {
                    configurationIdMapping[
                      item?.generic_details?.configuration_id
                    ]
                  }
                </td>
                <td className="text-center text-sm">
                    {item?.fetched_brokerage_percent || '-'}
                  </td>

                  <td className="text-center text-sm">
                      {item?.fetched_brokerage_percent === item?.fetched_ladder_percent
                          ? 0
                          : (item?.fetched_ladder_percent - item?.fetched_brokerage_percent).toFixed(2) || '-'}
                  </td>
                  <td className="text-center text-sm">
                    {convertAmount(+item?.generic_details?.agreement_value) || '-'}
                  </td>

                <td className={`  text-center text-sm `}>
                  {obStatusMapping[item?.ob_status_details?.status_id]}
                </td>
                 <td className={`text-center text-sm`}>
                    {item?.generic_details?.recent_type === "1" ? "BA1" :
                     item?.generic_details?.recent_type === "2" ? "BA2" :
                     item?.generic_details?.recent_type === "3" ? "SDR" :
                     item?.generic_details?.recent_type === "4" ? "Composite Payment" :
                     item?.generic_details?.recent_type === "5" ? "BA 3" :
                     item?.generic_details?.recent_type}
                    <br />
                    {item?.generic_details?.recent_date &&
                      new Date(item?.generic_details?.recent_date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                  </td>
                  <td className="text-center text-sm">
                    {item?.generic_details?.closure_date
                      ? new Date(item?.generic_details?.closure_date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : '-'}
                  </td>

                {tableFilter?.invoice_status && (
                  <td className="text-center text-sm ">
                    {item?.location_name}
                  </td>
                )}
                {tableFilter?.number && (
                  <td className="text-center text-sm ">
                    {item?.generic_details?.number}
                  </td>
                )}
                {tableFilter?.company_name && (
                  <td className="text-center text-[#8C8989] text-sm ">{item?.company_name}</td>
                )}
                <td>
                    <TableSeeMore
                      setSelectedBookingID={setSelectedBookingID}
                      setSelectedClientID={setSelectedClientID}
                      data={item}
                      setDetailsData={setDetailsData}
                      setClientName={setClientName}
                      followUp={setIsFollowUpModalVisible}
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
            ))}
          </tbody>
          
        </table>

        <ul className="flex gap-1 py-4 justify-end mr-4">
              <li
                onClick={() => paginate(currentPage - 1)}
                className={`border border-[#E0E0E0] w-9 h-9 text-center pt-1 ${
                  currentPage === 1
                    ? "bg-white text-[#686868] cursor-not-allowed"
                    : "bg-white text-[#686868] cursor-pointer"
                }`}
              >
                <a href="#" className="pt-1">
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
                      className={`border border-[#E0E0E0] w-9 h-9 text-center pt-1 ${
                        currentPage === number
                          ? "bg-[#9A55FF] text-white cursor-not-allowed"
                          : "bg-white text-[#686868] cursor-pointer"
                      }`}
                    >
                      <a href="#" className="">
                        {number}
                      </a>
                    </li>
                  );
                } else if (
                  number === 2 ||
                  number === Math.ceil(totalCount / itemsPerPage) - 1
                ) {
                  // Display ellipsis for second and second-to-last pages
                  return (
                    <li
                      key={number}
                      className="border border-[#E0E0E0] w-9 h-9 text-center pt-1 cursor-not-allowed"
                    >
                      <span className="page-link">...</span>
                    </li>
                  );
                }
                return null;
              })}
 
              <li
                onClick={() => paginate(currentPage + 1)}
                className={`border border-[#E0E0E0] w-9 h-9 text-center pt-1 ${
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
          onClose={setIsFollowUpModalVisible}
        />
      )}
      {isDetailsModalVisible && (
        <DetailsModal
          detailsData={detailsData}
          clientName={clientName}
          onClose={setIsDetailsModalVisible}
        />
      )}
      {isInvoiceModalVisible && (
        <InvoiceModal
        clientID={selectedClientId} 
        clientName={clientName}
        onClose={setIsInvoiceModalVisible} />
      )}
    </>
  );
};

export default TableContainer;
