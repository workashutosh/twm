import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { toast } from "react-toastify";
import IMAGES from "@images";
import PerformaInvoice from "@financepage/PerformaInvoice.jsx";
import { AppContext } from "@context/AppContext";
import apiInstance from "@api/apiInstance";
import { useLoggerStore } from "@store/log";




const GenerateInvoiceModal = ({ clientID , invNO,  onClose }) => {
    //console.log("client id" , clientID);
    //console.log("invNO" , invNO);

  const [accordion, setAccordion] = useState({
    mainDetails: false,
    customerDetails: false,
    companyDetails: false,
    percentDetails: false,
    contactPersonDetails : false
  });
  
  const { activeUserData } = useContext(AppContext);

  const {updateActivityLog , initializeLogData } = useLoggerStore();

  const handleLogCheck = async (log) => {
   updateActivityLog(log);
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
      userName: activityName,
      activityName: userName,
      timing: timing
    };
  
    // Add the new activity to the activities array
    activities.push(newActivity);
  
    // Convert activities array to JSON string
    const activitiesJson = JSON.stringify(activities);
  
    // Store the JSON string in localStorage
    localStorage.setItem('userActivities', activitiesJson);
  }

  const currentDate = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    invoiceNumber: invNO,
    clientName: "",
    companyName: "",
    companyAddress: "",
    companyGST: "",
    projectName: "",
    towerName: "",
    wingName: "",
    flatNo: "",
    unitCost: "",
    brokeragePercent: "",
    invoicedate: "",
    data: [],
    invoice_type: "",
    invoiceRaiseDate: "",
    cn_title: "",
    cn_title_name: "",
    cn_title_number: "",
    cn_title_email: "",
    generatedBy : activeUserData?.user_id
  });

  const getFinancialYear = (inputDate) => {
    // Parse the input date
    const date = new Date(inputDate);
  
    // Check if the month is before April
    if (date.getMonth() < 3) {
      // If before April, consider the previous year as the start of the financial year
      return `${date.getFullYear() - 1}/${date.getFullYear() % 100}`;
    } else {
      // If on or after April, consider the current year as the start of the financial year
      return `${date.getFullYear()}/${(date.getFullYear() % 100) + 1}`;
    }
  };


  const getData = async () => {
    try {
      const response = await apiInstance('client/generateInvoice.php', 'PATCH', {
        client_id: clientID,
        invoice_number: invNO
      });
      setFormData((prevFormData) => ({
        ...prevFormData,
        data: response?.data?.data,
        clientName: response?.data?.data[0]?.name,
        companyName: response?.data?.data[0]?.company_name,
        companyAddress: response?.data?.data[0]?.address,
        companyGST: response?.data?.data[0]?.gst_no,
        projectName: response?.data?.data[0]?.project_name,
        towerName: response?.data?.data[0]?.tower,
        wingName: response?.data?.data[0]?.wing,
        flatNo: response?.data?.data[0]?.flat_no,
        unitCost: response?.data?.data[0]?.agreement_value,
        brokeragePercent: response?.data?.data[0]?.invoice_percent,
        invoice_type: response?.data?.data[0]?.invoice_type,
        invoiceRaiseDate: response?.data?.data[0]?.invoice_raise_date,
        cn_title: response?.data?.data[0]?.title,
        cn_title_name: response?.data?.data[0]?.title_name,
        cn_title_number: response?.data?.data[0]?.title_number,
        cn_title_email: response?.data?.data[0]?.title_email
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error or show an error message to the user
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleButtonClick = () => {
    const queryString = new URLSearchParams(formData).toString();
    window.open(`/performa-invoice?${queryString}`, '_blank');
    handleLogCheck(`Genrated Invoice for ${formData.clientName} and details of ${JSON.stringify(formData)}`);
    storeActivity(activeUserData?.id,  activeUserData?.name , `Genrated Invoice for ${formData.clientName}`);
  };

  return (
    <div className="fixed  inset-0 z-[1050] flex items-start justify-center overflow-x-hidden pt-10 font-ubuntu outline-none backdrop-brightness-50 focus:outline-none generateinv">
      <div className="modal mx-auto max-h-[80vh] min-h-[77vh] w-[700px] z-[1050] overflow-y-scroll rounded-xl bg-white pb-4 pl-6 pr-6 outline-none">
        <div className="sticky top-0 z-[1050] flex items-center justify-between py-5 bg-white h-fit">
          <span className=" text-sm font-semibold text-[#9A55FF] underline decoration-[#9A55FF] decoration-solid underline-offset-[12px]">
            Generate Invoice For {formData.clientName}
          </span>
          <img
            onClick={() => onClose((prev) => !prev)}
            className="cursor-pointer"
            src={IMAGES.CloseIcon}
            alt="close icon"
          />
        </div>

        {/* Main Details */}
        <div>
          <div
            onClick={() =>
              setAccordion((prev) => ({
                ...prev,
                mainDetails: !prev.mainDetails,
              }))
            }
            className="cursor-pointer flex items-center mt-4"
          >
            <img src={IMAGES.InfoIcon} alt="info icon" />
            <p className="text-[#9A55FF] font-semibold ml-3 ">Main Details</p>
            <img
              src={IMAGES.DownArrow}
              alt="down arrow"
              className={`ml-auto ${accordion?.mainDetails ? "rotate-180" : ""}`}
            />
          </div>
          {accordion?.mainDetails && (
            <div className="flex gap-4 mt-6">
              <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                <input
                  value={formData.invoiceNumber + getFinancialYear(formData.invoiceRaiseDate)}
                  placeholder="Enter Here.."
                  type="text"
                  disabled
                  className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                />
                <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                  Invoice Number
                </span>
              </div>

              <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                <input
                  value={currentDate}
                  placeholder="Enter Here.."
                  type="date"
                  disabled
                  className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                />
                <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                  Date
                </span>
              </div>
            </div>
          )}
        </div>

        {/*  Company Details */}
        <div>
          <div
            onClick={() =>
              setAccordion((prev) => ({
                ...prev,
                companyDetails: !prev.companyDetails,
              }))
            }
            className="cursor-pointer flex items-center mt-4"
          >
            <img src={IMAGES.InfoIcon} alt="info icon" />
            <p className="text-[#9A55FF] font-semibold ml-3 ">Company Details</p>
            <img
              src={IMAGES.DownArrow}
              alt="down arrow"
              className={`ml-auto ${accordion?.companyDetails ? "rotate-180" : ""}`}
            />
          </div>
          {accordion?.companyDetails && (
            <div className="flex gap-4 mt-6">
              <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                <input
                  value={formData.companyName}
                  placeholder="Enter Here.."
                  type="text"
                  disabled
                  className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                />
                <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                  Company Name
                </span>
              </div>
              <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                <input
                  value={formData.companyGST}
                  type="text"
                  disabled
                  className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                />
                <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                  Company GST
                </span>
              </div>
              <div className="flex-1 relative border border-[#E0E0E0] rounded h-12 ">
                <textarea
                  rows={5}
                  value={formData.companyAddress}
                  placeholder="Enter Here.."
                  type="text"
                  disabled
                  className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                />
                <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                  Company Address
                </span>
              </div>
            </div>
          )}
        </div>

        {/*  Customer Details */}
        <div>
          <div
            onClick={() =>
              setAccordion((prev) => ({
                ...prev,
                customerDetails: !prev.customerDetails,
              }))
            }
            className="cursor-pointer flex items-center mt-4"
          >
            <img src={IMAGES.InfoIcon} alt="info icon" />
            <p className="text-[#9A55FF] font-semibold ml-3 ">Customer Details</p>
            <img
              src={IMAGES.DownArrow}
              alt="down arrow"
              className={`ml-auto ${accordion?.customerDetails ? "rotate-180" : ""}`}
            />
          </div>
          {accordion?.customerDetails && (
            <>
              <div className="flex gap-4 mt-6">
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    value={formData.clientName}
                    placeholder="Enter Here.."
                    type="text"
                    disabled
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    Customer Name
                  </span>
                </div>

                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    value={formData.projectName}
                    placeholder="Enter Here.."
                    type="text"
                    disabled
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    Project Name
                  </span>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    value={formData.unitCost}
                    placeholder="Enter Here.."
                    type="number"
                    disabled
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    Unit Cost
                  </span>
                </div>
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    value={formData.flatNo}
                    placeholder="Enter Here.."
                    type="text"
                    disabled
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    Flat No
                  </span>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    value={formData.towerName}
                    placeholder="Enter Here.."
                    type="text"
                    disabled
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    Tower Name
                  </span>
                </div>
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    value={formData.wingName}
                    placeholder="Enter Here.."
                    type="text"
                    disabled
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    Wing
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Percent Details */}
        <div>
          <div
            onClick={() =>
              setAccordion((prev) => ({
                ...prev,
                percentDetails: !prev.percentDetails,
              }))
            }
            className="cursor-pointer flex items-center mt-4"
          >
            <img src={IMAGES.InfoIcon} alt="info icon" />
            <p className="text-[#9A55FF] font-semibold ml-3 ">Percentage Details</p>
            <img
              src={IMAGES.DownArrow}
              alt="down arrow"
              className={`ml-auto ${accordion?.percentDetails ? "rotate-180" : ""}`}
            />
          </div>
          {accordion?.percentDetails && (
            <>
              <div className="flex gap-4 mt-6">
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    value={formData.brokeragePercent}
                    placeholder="Enter Here.."
                    type="text"
                    disabled
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    Brokerage
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Contact Person Details */}
        <div>
          <div
            onClick={() =>
              setAccordion((prev) => ({
                ...prev,
                contactPersonDetails: !prev.contactPersonDetails,
              }))
            }
            className="cursor-pointer flex items-center mt-4"
          >
            <img src={IMAGES.InfoIcon} alt="info icon" />
            <p className="text-[#9A55FF] font-semibold ml-3 ">Contact Person Details</p>
            <img
              src={IMAGES.DownArrow}
              alt="down arrow"
              className={`ml-auto ${accordion?.contactPersonDetails ? "rotate-180" : ""}`}
            />
          </div>
          {accordion?.contactPersonDetails && (
            <>
              <div className="flex gap-3 mt-6">
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    value={formData.cn_title}
                    placeholder="Enter Here.."
                    type="text"
                    disabled
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    Title
                  </span>
                </div>
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    value={formData.cn_title_name}
                    placeholder="Enter Here.."
                    type="text"
                    disabled
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    Title Name
                  </span>
                </div>
                
              </div>
              
              <div className="flex gap-3 mt-6">
              <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    value={formData.cn_title_number}
                    placeholder="Enter Here.."
                    type="text"
                    disabled
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    Title Number
                  </span>
                </div>
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    value={formData.cn_title_email}
                    placeholder="Enter Here.."
                    type="text"
                    disabled
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    Title Email
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end mt-5">
          <button
            onClick={handleButtonClick}
            className="bg-[#9A55FF] text-white text-sm font-semibold h-[30px] rounded px-5 block mx-auto my-6"
          >
            Generate Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export { GenerateInvoiceModal };



