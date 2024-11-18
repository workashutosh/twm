import IMAGES from "../../images";
import axios from "axios";
import { useEffect, useState , useContext } from "react";
import { toast } from "react-toastify";
import { AddInvoiceModal } from "./AddInvoiceModal";
import { GenerateInvoiceModal } from './GenreateInvoice'
import { AppContext } from "../../context/AppContext";
import apiInstance from "@api/apiInstance";
import { useLoggerStore } from "@store/log";

 
const InvoiceModal = ({ clientID, clientName , onClose }) => {

  const { activeUserData } = useContext(AppContext);

  const {updateActivityLog , initializeLogData } = useLoggerStore();

  const handleLogCheck = async (log) => {
   updateActivityLog(log);
  } 

  useEffect(() => {
    initializeLogData(activeUserData);
  }, [activeUserData, initializeLogData]);


  const [invoiceData, setInvoiceData] = useState([]);
  const [type, setType] = useState(null);
  const [invoice_id, setInvoiceId] = useState(null);
  const [givenDate , setGivenDate] = useState(null);
  const [isAddInvoiceModalOpen, setAddInvoiceModalOpen] = useState(false);
  const [isGenerateInvoiceModalOpen, setisGenerateInvoiceModalOpen] = useState(false);
  const [selectedInvoiceIndex, setSelectedInvoiceIndex] = useState(null); 
  const [company_data, setCompanyData] = useState(null); 
  const [cancelReason , setCancelReason] = useState(null);
  const [cancelType , setCancelType] = useState(null);
  const [estimationData , setEstimationData] = useState(null);
  const [mcData , setMcData] = useState([]);
  const [performaInvNum , setPerformaInvNum] = useState('');
  const [tavInvNum , setTavInvNum] = useState('');
  const [advanceInvNum , setAdvanceInvNum] = useState('');
  const [invNum , setInvNum] = useState('');
  const [selectedInvoiceNumber, setSelectedInvoiceNumber] = useState(null);
  const [isDivVisible, setIsDivVisible] = useState(false);
  const [newExpectedDate , setNewExpectedDate] = useState('');


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

  const openAddInvoiceModal = () => {
    setAddInvoiceModalOpen(true);
    handleLogCheck(`Opened the add invoice modal of client_id ${clientID} and name ${clientName}`);
  };

  const openGenerateInvoiceModal = (invoiceNumber) => {
    setSelectedInvoiceNumber(invoiceNumber);
    setisGenerateInvoiceModalOpen(true);
    handleLogCheck(`Opened the generate invoice modal of client_id ${clientID} and name ${clientName} with invoice number ${invoiceNumber}`);
  };

  const closeGenerateInvoiceModal = () => {
    setisGenerateInvoiceModalOpen(false);
      handleLogCheck(`Closed the generate invoice modal of client_id ${clientID} and name ${clientName}`);
  };

  const closeAddInvoiceModal = () => {
    setAddInvoiceModalOpen(false);
    handleLogCheck(`Closed the add invoice modal of client_id ${clientID} and name ${clientName}`);
  };

  const toggleDivVisibility = () => {
    setIsDivVisible(!isDivVisible);
  };

  const getData = async () => {
    try {
      const res = await apiInstance('client/getInvoiceDetails.php', 'POST', {
        client_id: clientID
      });
  
      setInvoiceData(res?.data);
  
      const company_data = [
        {
          id: res?.data?.data[0]?.company_id || null,
          name: res?.data?.data[0]?.company_name || null,
        }
      ];
      setCompanyData(company_data); 
      getEstimation();
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const getEstimation = async () => {
    try {
      const res = await apiInstance('client/company_estimation_micro.php', 'GET');
  
      setEstimationData(res?.data);
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const currentDate = new Date().toISOString().split('T')[0];



  useEffect(() => {
    const getMicroserviceData = async () => {
      try {
        const response = await apiInstance(
          'client/invmicroservice.php',
          'GET'
        );
        setMcData(response.data);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };
  
    getMicroserviceData();
  }, []);

 
  
  useEffect(() => {
    // This block will run whenever mcData is updated
    if (mcData) {
      //console.log(mcData);
  
      // Check if the arrays are defined and not empty before accessing elements
      setPerformaInvNum(mcData.performa?.[0]?.invnumber || null);
      setTavInvNum(mcData.tax?.[0]?.invnumber || null);
      setAdvanceInvNum(mcData.advance?.[0]?.invnumber || null);
    }
  }, [mcData]);

  const calculateDynamicDate = (givenDate, id, estimationData) => {
    if (!estimationData) {
    //  console.error("estimationData is null or undefined");
      return null;
    }
  
    const filteredData = estimationData.filter((item) => item.id === id);
  
    if (filteredData.length === 0) {
      //console.error(`Estimation not found for id ${id}`);
      return null;
    }
  
    const estimation = filteredData[0];
    const days = parseInt(estimation.days, 10);
  
    if (isNaN(days)) {
     // console.error(`Invalid days value for id ${id}`);
      return null;
    }
  
    const givenDateObject = new Date(givenDate);
  
    // Check if the givenDateObject is a valid date
    if (isNaN(givenDateObject)) {
     // console.error("Invalid date value for givenDate");
      return null;
    }
  
    givenDateObject.setDate(givenDateObject.getDate() + days);
  
    return givenDateObject.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (company_data && company_data.length > 0) {
        const calculatedDate = calculateDynamicDate(givenDate, company_data[0].id, estimationData);
        setExpectedDate(calculatedDate);
    }

}, [givenDate, estimationData , company_data]);

  const [expectedDate, setExpectedDate] = useState(calculateDynamicDate(givenDate, '3', estimationData));

  const getFinancialYear = (inputDate) => {
    // Parse the input date
    const date = new Date(inputDate);
  
    // Check if the month is before April
    if (date.getMonth() < 3) {
      // If before April, consider the previous year as the start of the financial year
      return `/${date.getFullYear() - 1}/${date.getFullYear() % 100}`;
    } else {
      // If on or after April, consider the current year as the start of the financial year
      return `/${date.getFullYear()}/${(date.getFullYear() % 100) + 1}`;
    }
  };

  const convertInvoice = (clientID, invoiceValue, company,  invoiceType, raiseDate) => {
    handleLogCheck(`Converting Invoice for client_id ${clientID} and name ${clientName} with invoice value ${invoiceValue} and company ${company} and invoice type ${invoiceType} and raise date ${raiseDate}`);

    function promptForValidDate() {
      var inputDate = prompt("Please enter a date (YYYY-MM-DD format):" , raiseDate);
    
      if (inputDate === null) {
        alert("Operation canceled. No date was entered.");
      } else {
        var dateFormat = /^\d{4}-\d{2}-\d{2}$/;
    
        if (!dateFormat.test(inputDate)) {
          alert("Invalid date format! Please enter a date in the format YYYY-MM-DD.");
        } else if (inputDate > currentDate) {
          alert("Date should be less than current date");
          promptForValidDate();
        } else if (inputDate < raiseDate) {
          alert("Date should be greater than raise date");
          promptForValidDate();
        } else {
          if (invoiceType == "tax") {
            setInvNum(Number(tavInvNum) + 1);
          } else if (invoiceType == "advance") {
            setInvNum(Number(advanceInvNum) + 1);
          }
    
          handleLogCheck(`Converting Invoice for client_id ${clientID} and name ${clientName} with invoice value ${invoiceValue} and company ${company} and invoice type ${invoiceType} and raise date ${inputDate}`);
          apiInstance(
            'client/invoice.php',
            'PUT',
            {
              client_id: clientID,
              invoice_value: invoiceValue,
              company_id: company,
              invoice_number: invNum,
              invoice_type: invoiceType,
              raise_date: inputDate,
            }
          )
            .then((response) => {
              //console.log(response);
              toast.success("Invoice Converted Successfully");
              getData();
            })
            .catch((error) => {
              console.error('Error adding data:', error);
              toast.error("Error adding data");
            });
        }
      }
    }

    promptForValidDate();

    //const invnum = 

   
  };
  
  //use use effect
  const updateData = async (client_id, invoice_no, invoice_id) => {

    if (type !== null && givenDate !== null) {
  
      if (type === '2' && expectedDate === null) {
        toast.error("Expected date is required");
      } 
      else if (type === '4' && (cancelReason === null || cancelType === null)) {
        toast.error("All fields are required");
      }
      else {
        let requestBody = {
          client_id: client_id,
          invoice_id: invoice_id,
          invoice_number: invoice_no,
          post_status_id: type,
        };
  
        // Conditionally add properties based on the type
        if (type === '2') {
          requestBody.submit_date = givenDate;
          requestBody.expected_receive_date = expectedDate;
          storeActivity(activeUserData?.id, activeUserData?.name, `Updated Invoice Status OF client_id ${client_id} and invoice number ${invoice_no} to Submit stage the given date is ${givenDate} and expected receive date is ${expectedDate}`);
        } else if (type === '3') {
          requestBody.received_date = givenDate;
          storeActivity(activeUserData?.id, activeUserData?.name, `Updated Invoice Status OF client_id ${client_id} and invoice number ${invoice_no} to Received stage the given date ${givenDate}`);
        } else if (type === '4') {
          requestBody.cancel_date = givenDate;
          requestBody.cancel_reason = cancelReason;
          requestBody.cancel_type = cancelType;
          storeActivity(activeUserData?.id, activeUserData?.name, `Updated Invoice Status OF client_id ${client_id} and invoice number ${invoice_no} to Cancel stage the given date ${givenDate}`);
        }

        handleLogCheck(`Updating Invoice for client_id ${client_id} and invoice number ${invoice_no} with request body ${JSON.stringify(requestBody)}`);
  
        try {
          const res = await apiInstance(
            'client/invoice.php',
            'POST',
            requestBody
          );
  
          if (res.status === 200) {
            toast.success("Invoice Updated Successfully");  
          }
          setExpectedDate('');
          setGivenDate('');
          getData();
        } catch (error) {
          console.error('Error updating data:', error);
          toast.error("Error updating data");
        }
      }
    } else {
      toast.info('Please select a type and date');
    }
  
  };
  


    
  useEffect(() => {
    getData();
  }, [clientID]);

  const changeExpectedDate = async (client_id, invoice_no, submit_date, newExpectedDate) => {
    handleLogCheck(`Changing Expected Date for client_id ${client_id} and invoice number ${invoice_no} with submit date ${submit_date} and new expected date ${newExpectedDate}`);
    if (newExpectedDate === '') {
      toast.info("Please enter a date");
    } else if (newExpectedDate === invoiceData.data.expected_receive_date) {
      toast.info("Please enter a different date");
    } else {
      let requestBodyEx = {
        client_id: client_id,
        invoice_number: invoice_no,
        submit_date: submit_date,
        post_status_id: 2,
        expected_receive_date: newExpectedDate,
      };
  
      try {
        const res = await apiInstance(
          'client/invoice.php',
          'POST',
          requestBodyEx
        );
  
        if (res.status === 200) {
          toast.success("Expected Date Changed!");
        }
        handleLogCheck(`Expected Date Changed Successfully for client_id ${client_id} and invoice number ${invoice_no} with submit date ${submit_date} and new expected date ${newExpectedDate}`);
        getData();
        setIsDivVisible(false);
        setNewExpectedDate('');
      } catch (error) {
        console.error('Error updating data:', error);
        toast.error("Error updating data");
      }
    }
  };
  

  const toggleUpdateArrayVisibility = (index) => {
    setSelectedInvoiceIndex((prev) => (prev === index ? null : index));
    setIsDivVisible((prev) => !prev);
    handleLogCheck(`Toggled Update Array Visibility for client_id ${clientID} and invoice number ${invoiceData.data[index].invoice_number}`);
  };
  



  return (
    <>
      <div className="fixed inset-0 z-[50] flex items-start justify-center overflow-auto pt-20 font-ubuntu outline-none backdrop-brightness-50 focus:outline-none ">
      <div className="modal mx-auto max-h-[80vh] w-[45vw] overflow-auto rounded-xl bg-white pb-4 pl-6 pr-6 outline-none invoiceContainer" style={{zIndex: 100}}>
          <div className="border-b-2 border-b-[#bf8bff] sticky top-0 z-[05] flex items-center justify-between pb-3 pt-5 bg-white h-fit">
            <span className="text-sm font-semibold text-violet-500">Client - {clientName}</span>
            <button className="bg-[#9A55FF] text-white text-xs flex h-6 w-40 rounded items-center justify-center gap-2 ml-auto mr-3"
            onClick={openAddInvoiceModal}>
              Generate New Invoice
              <img src={IMAGES.AddIconWhite} alt="icon" />
            </button>
            {isAddInvoiceModalOpen && (
            <AddInvoiceModal clientID={clientID} companyData={company_data} onClose={() => {
              closeAddInvoiceModal();
              getData(); 
              }} />
             )}
            <img
              onClick={() => onClose((prev) => !prev)}
              className="cursor-pointer"
              src={IMAGES.CloseIcon}
              alt="close icon"
            />
          </div>

          {/* main div */}
          <div className="bg-[#F7F7F7] p-4">
            {invoiceData.data &&
              invoiceData.data.length > 0 &&
              invoiceData.data.map((item, index) => (
                /* start div */
                <div
                  key={index}
                  className="bg-white py-3 px-4 rounded-xl shadow-xl mb-4"
                >
                  <div className="flex items-center border-b border-b-[#F4F4F4] pb-3 justify-between gap-2">
                  <img
                      src={item.cancellation_date === null ? IMAGES.InvoiceYellow : IMAGES.InvoiceCan}
                      alt={item.cancellation_date === null ? "invoice yellow" : "Invoice Cancelled"}
                    />
                     <div>
                      <p className="text-xs">Brokerage :</p>
                      <p className="text-[#172B4C] text-xs mt-1 font-semibold">
                        {item.brokerage_type}
                      </p> 
                        <p className="text-[#44d67c] text-xs mt-1 font-semibold">
                        ({item.brokerage_percent} %)
                      </p>
                      
                    </div>
                    <div>
                      <p className="text-xs">Invoice Type:</p>
                      <p className="text-[#172B4C] text-xs mt-1 font-semibold">
                        {item.invoice_type}
                      </p> {item?.recent == "recent" && (
                        <p className="text-[#44d67c] text-xs mt-1 font-semibold">
                        {item.recent}!
                      </p>
                      ) }
                    </div>

                    <div>
                      <p className="text-xs">Company Name:</p>
                      <p className="text-[#172B4C] text-xs mt-1 font-semibold">
                        {item.company_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs">Invoice Value:</p>
                      <p className="text-[#172B4C] text-xs mt-1 font-semibold">
                        {item.invoice_value}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs">Invoice No:</p>
                      <p className="text-[#172B4C] text-xs mt-1 font-semibold">
                        {item.invoice_number + getFinancialYear(item.invoice_raise_date)}
                      </p>
                    </div>
                    
                  </div>

                  {/* progress bar div */}
                  <div className="flex justify-between mt-5 ml-2">
                    <div className="relative flex flex-1 flex-col justify-center ">
                      <div
                        className={`z-[01] bg-[#9A55FF] w-5 h-5 rounded-full flex justify-center items-center ${
                          item.post_raise_id >= 1 && item.post_raise_id !== 4
                              ? "bg-[#9A55FF]"
                              : item.post_raise_id == 4
                                  ? "bg-red-500" 
                                  : "bg-[#d8c0fb]"
                      }`}                      
                      >
                        <img src={IMAGES.TickWhite} alt="tick white " className="z-[01]"/>
                      </div>
                      <div
                        className={`z-[0] absolute top-[10px]  w-full   h-[2px] ${
                          item.post_raise_id >= 2 && item.post_raise_id !== 4
                            ? "bg-[#9A55FF]"
                            : item.post_raise_id == 4
                                  ? "bg-red-500" 
                                  : "bg-[#d8c0fb]"
                        }`}
                      ></div>

                        <p className={`mt-2 text-xs font-medium ${item.cancellation_date === null ? "text-[#9A55FF]" : "text-[#FF0000]"}`}>
                          Raised
                        <p className="text-xs font-light text-[#030105]">
                        {item?.invoice_raise_date}
                        </p>
                      </p>
                    </div>

                    <div className="relative flex flex-1 flex-col justify-center ">
                      <div
                        className={`z-[01] bg-[#9A55FF] w-5 h-5 rounded-full flex justify-center items-center ${
                          item.post_raise_id >= 2 && item.post_raise_id !== 4
                            ? "bg-[#9A55FF]"
                            : item.post_raise_id == 4
                                  ? "bg-red-500" 
                                  : "bg-[#d8c0fb]"
                        }`}
                      >
                        {item.post_raise_id >= 2 && ( <img src={IMAGES.TickWhite} alt="tick white " className="z-[01]" /> )}
                      </div>

                      <div
                        className={`z-[0] absolute top-[10px]  w-full h-[2px] ${
                          item.post_raise_id >= 3 && item.post_raise_id !== 4
                            ? "bg-[#9A55FF]"
                            : item.cancellation_date !== null
                                  ? "bg-red-500" 
                                  : "bg-[#d8c0fb]"
                        }`}
                      ></div>

                        <p className={`mt-2 text-xs font-medium ${item.cancellation_date === null ? "text-[#9A55FF]" : "text-[#FF0000]"}`}>
                        Submitted
                        <p className="text-xs font-light text-[#030105]">
                        {item.submit_date || "-"}
                        </p>
                      </p>
                    </div>

                    <div className="relative flex flex-1 flex-col justify-center w-3">
                      <div
                        className={`z-[01] bg-[#9A55FF] w-5 h-5 rounded-full flex justify-center items-center ${
                           item.received_date !== null  && item.cancellation_date == null
                            ? "bg-[#9A55FF]"
                            : item.cancellation_date !== null
                                  ? "bg-red-500" 
                                  : "bg-[#d8c0fb]"
                        }`}
                      >
                        {item.received_date !== null && ( <img src={IMAGES.TickWhite} alt="tick white " className="z-[01]" /> )}
                      </div>

                      <p className={`mt-2 text-xs font-medium ${item.cancellation_date === null && item.received_date === null && item.expected_receive_date !== null ? "text-green-500" : item.cancellation_date === null ? "text-[#9A55FF]" : "text-[#FF0000]"}`}>
                      {item.cancellation_date === null && item.received_date === null && item.expected_receive_date !== null ? "Expected" : item.cancellation_date === null ? "Received" : "Cancelled"}
                        <p className="text-xs font-light text-[#030105]">
                        {item.cancellation_date === null && item.received_date !== null
                           ? item.received_date
                           : item.cancellation_date !== null
                           ? item.cancellation_date
                           : item.cancellation_date === null && item.received_date === null && item.expected_receive_date !== null
                           ? <span>{item.expected_receive_date}<i class="fa-regular fa-pen-to-square ml-2 cursor-pointer" onClick={toggleDivVisibility}></i></span>
                           : "-"} 
                        </p>
                      </p>
                        
                     </div>

                    
                  </div>

                  
                  <div className="border-t-2 border-b-[#5B5B5B] w-full mt-2">

                  {isDivVisible && item.expected_receive_date !== null &&  (
                  <div className="mt-2 flex flex-1 gap-0 w-[100%] border-b border-gray pb-2">
                      <p className=" text-left ml-1 text-sm w-[30%] mt-1 ">Change Expected To : </p> 
                      <input
                        value={newExpectedDate}
                        onChange={(e) => setNewExpectedDate(e.target.value)}
                              type="date"
                              min={currentDate}
                              className="border border-[#CFCFCF] rounded w-44 text-[#9A9A9A] text-xs pl-2 outline-none h-[30px]"
                            />
                             <button
                            onClick={() => changeExpectedDate(item.client_id, item.invoice_number , item.submit_date , newExpectedDate)}
                            className="bg-[#9A55FF] z-0 text-white text-xs h-6 w-32 mt-1 rounded items-center justify-center gap-2 ml-6"
                          >
                            Change
                        </button>
                    </div>
                    )}
                  <div className="flex flex-1 z-0 justify-center items-left mt-2 gap-3 ">
                  {item.cancellation_date == null && item.post_raise_id !== 3 && (
                  <button
                      onClick={() => toggleUpdateArrayVisibility(index)}
                      className="bg-[#9A55FF] z-0 text-white text-xs  h-6 w-32 rounded items-center justify-center gap-2"
                    >
                      Change Status
                  </button>
                  )}
                  {item.invoice_type == "Proforma" && item.cancel_reason == "" && item.invoice_receive_date === null && (
                  <button
                      onClick={() => convertInvoice(item.client_id , item.invoice_value , item.company_id,  'Tax', item.invoice_raise_date)}
                      className="bg-[#9A55FF] z-0 text-white text-xs flex h-6 w-20 rounded items-center justify-center "
                    >
                      Convert
                  </button>
                  )}
                  {item.post_raise_id !== 5  && item.invoice_raise_date !== null && (
                  <button
                  onClick={() => openGenerateInvoiceModal(item.invoice_number)}
                  className="bg-[#9A55FF] z-0 text-white text-xs flex h-6 w-40 rounded items-center justify-center "
                    >
                      Download Invoice 
                      <img src={IMAGES.Pdf} alt="pdf" className="h-4 ml-1" />
                  </button>
                  )}
                  {isGenerateInvoiceModalOpen && (
                    <GenerateInvoiceModal clientID={clientID} invNO={selectedInvoiceNumber} onClose={() => {
                      closeGenerateInvoiceModal();
                      setSelectedInvoiceNumber(null); 
                    }} />
                  )}
                  </div>
                  </div>

                  {/* cancel reason div */}

                  {item.cancel_reason !== ""  && (
                  <div className="border-t-2 border-b-[#5B5B5B] w-full mt-4">
                    <p className="text-red-600 text-xs text-left mt-2">Cancellation Reason: {item.cancel_type}
                    </p>
                    <p className="text-sm mt-2">{item.cancel_reason}</p>
                  </div>
                  )}

                  {/* update array */}
                  {selectedInvoiceIndex === index && item.post_raise_id !== 3 && (
                    <div className="border-t-2 border-b-[#5B5B5B] w-full mt-4">
                      <div className="bg-grey flex flex-row gap-4 mt-4">
                        {/* Status */}
                        <div className="flex-1">
                        <p className="text-[#696969] font-medium text-sm mb-1">
                          Status
                        </p>
                        <select
                            onChange={(e) => setType(e.target.value)}
                            className="border border-[#CFCFCF] rounded w-full text-[#323030] text-xs pl-2 outline-none h-[30px]"
                          >
                            <option selected hidden>
                              Select Here
                            </option>

                            {item.post_raise_id <= 1 && (
                              <option value="2">
                                Submitted
                              </option>
                            )}

                            {item.post_raise_id === 2 && (
                              <>
                                <option value="3">Received</option>
                                <option value="4">Cancelled</option>
                              </>
                            )}
                          </select>
                        </div>


                        {/* Submit Date */}
                        <div className="flex-1">
                        <p className="text-[#696969] font-medium text-sm mb-1">
                              {type === "2"
                                ? "Submit Date"
                                : type === "3"
                                ? "Received Date"
                                : type === "4"
                                ? "Cancel Date"
                                : "Select Date"}
                            </p>
                            <input
                               value={givenDate}
                               onChange={(e) => setGivenDate(e.target.value)}
                              type="date"
                              min={
                                type === "2"
                                  ? item.invoice_raise_date
                                  : type === "3"
                                  ? item.submit_date
                                  : type === "4"
                                  ? item.submit_date
                                  : currentDate
                              }
                              max={type === "3" ? currentDate : currentDate}
                              className="border border-[#CFCFCF] rounded w-full text-[#9A9A9A] text-xs pl-2 outline-none h-[30px]"
                            />
                        </div>

                        {/* Expected Date */}
                        {type == "2"  && (
                        <div className="flex-1">
                          <p className="text-[#696969] font-medium text-sm mb-1">
                            Expected Date
                          </p>
                          <input
                             value={expectedDate}
                             onChange={(e) => setExpectedDate(e.target.value)}
                             type="date"
                             min={currentDate}
                             className="border border-[#CFCFCF] rounded w-full text-[#9A9A9A] text-xs pl-2 outline-none h-[30px]"
                           />
                        </div>
                        )}

                        {type == "4"  && (
                          <div className="flex-1">
                            <p className="text-[#696969] font-medium text-sm mb-1">
                            Cancel Reason
                          </p>
                          <select
                            onChange={(e) => setCancelType(e.target.value)}
                            className="border border-[#CFCFCF] rounded w-full text-[#323030] text-xs pl-2 outline-none h-[30px] "
                          >
                            <option selected hidden>
                              Select Cancel Reason
                            </option>
                            <option value="bymistake" >
                                Bymistake
                              </option>
                              <option value="from_developer" >
                                From Developer
                              </option>
                              <option value="other">
                                Other
                              </option>
                          </select>
                          </div>
                        )}

                      </div>

                      {/* cancelReason */}                    
                      {type === '4' && (
                          <div>
                           <input
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                type="text"
                                placeholder="Add Remark"
                                className="border border-[#CFCFCF] rounded w-full text-[#9A9A9A] text-xs mt-2 pl-2 outline-none h-[30px]"
                              />
                          </div>
                        )}
                        
                      <div className="flex justify-center align-middle mt-4">
                      <button
                          className="bg-[#9A55FF] text-white text-xs flex h-7 w-32 rounded items-center justify-center gap-2  mr-3"
                          onClick={() => updateData(item.client_id, item.invoice_number , item.invoice_id)}
                        >
                          Update
                        </button>
                      </div>
                        
                    </div>
                  )}
                </div>
                
              ))}
          </div>
          
        </div>
      </div>
      
    </>
  );
};

export default InvoiceModal;
