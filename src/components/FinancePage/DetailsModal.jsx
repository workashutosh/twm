import { useState , useEffect , useContext} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from 'react-select';
import IMAGES from "@images";
import useStore from '@store/index.jsx';
import { AppContext } from "@context/AppContext";
import apiInstance from "@api/apiInstance";
import { useLoggerStore } from "@store/log";




const DetailsModal = ({ detailsData, clientName,  onClose }) => {


  const { activeUserData } = useContext(AppContext);

  const {updateActivityLog , initializeLogData } = useLoggerStore();

  const handleLogCheck = async (log) => {
   updateActivityLog(log);
  } 

  useEffect(() => {
    initializeLogData(activeUserData);
  }, [activeUserData, initializeLogData]);



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

  const [accordion, setAccordion] = useState({
    unitDetails: false,
    costDetails: false,
    stage: false,
    invoice: false,
  });

  const {  updateTablec } = useStore();
  const [wing, setWing] = useState(detailsData?.generic_details?.wing);
  const [flatNo, setFlatNo] = useState(detailsData?.generic_details?.flat_no);
  const [typology, setTypology] = useState(
    configurationIdMapping[detailsData?.generic_details?.configuration_id]
  );
  const [carpetArea, setCarpetArea] = useState(
    detailsData?.generic_details?.carpet_area
  );
  const [agreementValue, setAgreementValue] = useState(
    detailsData?.generic_details?.agreement_value
  );
  const [bcvAV, setBscAV] = useState(
    detailsData?.generic_details?.bcvAV
  );
  const [cashback_amount , setCashbackAmount] = useState(
    detailsData?.generic_details?.cashback_amount
  );
  const [sourceByOptions, setSourceByOptions] = useState([]);
  const [closedByOptions, setClosedByOptions] = useState([]);
  const [configurationOptions, setConfigurationOptions] = useState([]);

  const [contactNumber , setContactNumber] = useState(detailsData?.generic_details?.number);
  const [selectedSourced, setSelectedSourced] = useState(detailsData?.generic_details?.sourced_by);
  const [selectedClosed, setSelectedClosed] = useState(detailsData?.generic_details?.closed_by);
  const [selectedConfiguration, setSelectedConfiguration] = useState(detailsData?.generic_details?.configuration_id);
  const [userActive , setUserACtive] = useState(detailsData?.generic_details?.active);

  const [dropdownData, setDropdownData] = useState(null);

  
  function calculateInvoiceValue(agreementValue, lp) {
    // Convert agreementValue to integer
    agreementValue = Number(agreementValue);
    
    // Calculate invoiceValue
    let invoiceValue = Number(agreementValue * lp / 100);
    
    return invoiceValue;
  }

  let invoiceValue = calculateInvoiceValue(agreementValue, Number(detailsData?.fetched_brokerage_percent));

  if(detailsData?.fetched_ladder_percent !== null && detailsData?.fetched_ladder_percent !== "0"
  ){
    invoiceValue +=  calculateInvoiceValue(agreementValue, detailsData?.fetched_ladder_percent);
  }

  const GSTAmount = invoiceValue * 0.18;
  
  let totalInvoiceValue;

  totalInvoiceValue = invoiceValue + GSTAmount; 
  
  const TDSAmount = invoiceValue * 0.05;

  const realizeAmount = totalInvoiceValue - TDSAmount - (detailsData?.generic_details?.cashback_amount || 0)  ;

  useEffect(() => {
    if (dropdownData) {
        const configOptions = dropdownData?.configuration.map(configuration => ({
            value: parseInt(configuration.id),
            label: configuration.name
        }));
       
        const sourceByOptions = dropdownData?.source_by_and_closed_by.map(item => ({
            value: parseInt(item.id),
            label: item.name
        }));
        const closedByOptions = dropdownData?.source_by_and_closed_by.map(item => ({
            value: parseInt(item.id),
            label: item.name
        }));

        setConfigurationOptions(configOptions);
        setSourceByOptions(sourceByOptions);
        setClosedByOptions(closedByOptions);
    }
}, [dropdownData]);



useEffect(() => {
  const getDropdownData = async () => {
    try {
      const response = await apiInstance('client/bookingdd.php', 'GET');
      if (response?.data) {
        setDropdownData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  getDropdownData();
}, []);

    const handleSortClick = (type, typeName) => {
      const sortData = { type, typeName };
      updateTablec(sortData);
    };

    const handleUpdate = async () => {
      // Check if any state has changed
      if (
        wing === detailsData?.generic_details?.wing &&
        flatNo === detailsData?.generic_details?.flat_no &&
        selectedConfiguration === detailsData?.generic_details?.configuration_id &&
        carpetArea === detailsData?.generic_details?.carpet_area &&
        selectedClosed === detailsData?.generic_details?.closed_by &&
        selectedSourced === detailsData?.generic_details?.sourced_by &&
        agreementValue === detailsData?.generic_details?.agreement_value &&
        bcvAV === detailsData?.generic_details?.bcvAV &&
        cashback_amount === detailsData?.generic_details?.cashback_amount &&
        userActive === detailsData?.generic_details?.active
      ) {
        toast.info('No changes to be updated');
        return;
      } else if (detailsData?.generic_details?.active == 'Y' && userActive == 'N') {
        const confirmed = window.confirm("Are you sure you want to cancel the booking status?");

        if (confirmed) {
          handleLogCheck(`Booking Status cancelled and  Updated Successfully ${new Date().toLocaleString()} for Booking ID ${detailsData?.generic_details?.booking_id} with details: ${JSON.stringify({ userActive })}`);
          try {
            const response = await apiInstance('client/main.php', 'PATCH', {
              client_id: detailsData?.generic_details?.client_id,
              wing: wing,
              flat_no: flatNo,
              typology: selectedConfiguration,
              carpet_area: carpetArea,
              closed_by: selectedClosed,
              sourced_by: selectedSourced,
              agreement_value: agreementValue,
              bcvAV: bcvAV,
              cashback_amount: cashback_amount || 0,
              user_active: userActive
            });
            let temp = {
              wing,
              flatNo,
              typology: selectedConfiguration,
              carpetArea,
              agreementValue,
              bcvAV: bcvAV,
              cashback_amount,
              closedBy: selectedClosed,
              sourcedBy: selectedSourced,
            };
    
            storeActivity(
              activeUserData?.id,
              activeUserData?.name,
              `Updated Details Modal for User Id ${detailsData?.generic_details?.client_id}. The Request Body was ${JSON.stringify(temp)}`
            );
            toast.success('Successfully Updated');
            handleSortClick('type', 'reload');
          } catch (error) {
            console.error('Error updating data:', error);
            toast.error('Cannot update the User Details');
          }
        } else {
          console.log('User cancelled the operation');
        }
      } else {
        try {
          const response = await apiInstance('client/main.php', 'PATCH', {
            client_id: detailsData?.generic_details?.client_id,
            wing: wing,
            flat_no: flatNo,
            typology: selectedConfiguration,
            carpet_area: carpetArea,
            closed_by: selectedClosed,
            sourced_by: selectedSourced,
            agreement_value: agreementValue,
            bcvAV: bcvAV,
            cashback_amount: cashback_amount || 0,
            user_active: userActive
          });
          let temp = {  
            wing,
            flatNo,
            typology: selectedConfiguration,
            carpetArea,
            agreementValue,
            bcvAV,
            cashback_amount,
            closedBy: selectedClosed,
            sourcedBy: selectedSourced,
          };
          handleLogCheck(`Booking Status Updated Successfully ${new Date().toLocaleString()} for Booking ID ${detailsData?.generic_details?.booking_id} with details: ${JSON.stringify({ userActive })} booking details updated with ${JSON.stringify(temp)}`);

          storeActivity(
            activeUserData?.id,
            activeUserData?.name,
            `Updated Details Modal for User Id ${detailsData?.generic_details?.client_id}. The Request Body was ${JSON.stringify(temp)}`
          );
          toast.success('Successfully Updated');
          handleSortClick('type', 'reload');
        } catch (error) {
          console.error('Error updating data:', error);
          toast.error('Cannot update the User Details');
        }
      }
    };
    
    
  return (
    <div className="fixed  inset-0 z-[100] flex items-start justify-center  overflow-x-hidden pt-20 font-ubuntu outline-none backdrop-brightness-50 focus:outline-none">
      <div className="modal mx-auto max-h-[80vh] w-[560px] overflow-y-scroll rounded-xl bg-white pb-4   pl-6 pr-6 outline-none ">
        <div className="sticky top-0 z-50 flex items-center justify-between py-5 bg-white h-fit">
          <span className="text-sm font-semibold text-[#9A55FF] underline decoration-[#9A55FF] decoration-solid underline-offset-[12px]">
            Details Of - {clientName}
          </span>
          <img
            onClick={() => {
              handleLogCheck(`Closed the details modal of booking_id ${detailsData?.generic_details?.booking_id} and name ${clientName}`);
              onClose((prev) => !prev);
            }}
            className="cursor-pointer"
            src={IMAGES.CloseIcon}
            alt="close icon"
          />
        </div>
        {/* <div className="flex gap-4 mt-4">
          <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
            <input
              value={detailsData?.location_name}
              type="text"
              disabled
              className="rounded pt-1 outline-none text-sm text-[#838383] pl-3 h-full w-full"
            />
            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
              Location
            </span>
          </div>
          <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
            <input
              value={detailsData?.location_name}
              type="text"
              disabled
              className="rounded pt-1 outline-none text-sm text-[#838383] pl-3 h-full w-full"
            />
            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
              Locality
            </span>
          </div>
        </div> */}  
        <div className="flex gap-4 mt-6">
          <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
            <input
              value={detailsData?.generic_details?.project_name}
              type="text"
              disabled
              className="rounded pt-1 outline-none text-sm text-[#838383] pl-3 h-full w-full"
            />
            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
              Project
            </span>
          </div>
          <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
            <input
              value={detailsData?.generic_details?.developer_name}
              type="text"
              disabled
              className="rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
            /> 
            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
              Developer
            </span>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 z-40">

              <Select
                  //value={selectedSourced}
                  onChange={(selectedOption) => {
                      setSelectedSourced(selectedOption?.value);
                      // setFormData({ ...formData, sourced: selectedOption.value });
                  }}
                  options={sourceByOptions}
                  classNamePrefix="react-select" 
                  placeholder={sourceByOptions.find(option => option.value === Number(detailsData?.generic_details?.sourced_by))?.label}
              />

            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
              Source By
            </span>
          </div>
          <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 z-40">
           {/*  <input
              type="text"
              disabled
              value={
                sourceByAndCloseBy[detailsData?.generic_details?.closed_by]
              }
              className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
            /> */}
            <Select
                  //value={selectedClosed}
                  onChange={(selectedOption) => {
                      setSelectedClosed(selectedOption?.value);
                  }}
                  options={closedByOptions}
                  classNamePrefix="react-select" 
                  placeholder={closedByOptions.find(option => option.value === Number(detailsData?.generic_details?.closed_by))?.label}
              />
            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
              Closed By
            </span>     
          </div>
        </div>

        <div className="flex gap-4 mt-6">

          <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
            <input
              type="text"
              disabled
              value={"Facebook"}
              className="rounded pt-1 outline-none text-sm text-[#838383] pl-3 h-full w-full"
            />
            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
              Lead Source
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center gap-6 relative border border-[#E0E0E0] rounded h-9 ">
            <label htmlFor="csop_retail" className="flex items-center gap-2">
              <span className="text-[#696969] text-sm">Retail</span>
              <input
                checked={detailsData?.generic_details?.csop === "retail"}
                type="radio"
                className="w-[14px] h-[14px]"
                name="csop"
                id="csop_retail"
              />
            </label>
            <label htmlFor="csop_mandate" className="flex items-center gap-2">
              <span className="text-[#696969] text-sm">Mandate</span>
              <input
                checked={detailsData?.generic_details?.csop === "mandate"}
                type="radio"
                className="w-[14px] h-[14px]"
                name="csop"
                id="csop_mandate"
              />
            </label>
            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
              Vertical
            </span>
          </div>

        </div>

        <div className="flex gap-4 mt-6">
        <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
            <input
              type="text"
              disabled
              value={contactNumber}
              className="rounded pt-1 outline-none text-sm text-[#838383] pl-3 h-full w-full"
            />
            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
              Contact Number
            </span>
          </div>
        
          {detailsData?.ob_status_details?.status_id < 3  && (
              <div className="relative">
              <select
                value={userActive}
                onChange={(e) => setUserACtive(e.target.value)}
                disabled={detailsData?.generic_details?.active === 'N'}
                className={`appearance-none border rounded h-9 pl-3 pr-8 bg-white text-[#696969] text-sm w-44 ${
                  detailsData?.generic_details?.active === 'N' ? 'border-red-500' : 'border-[#E0E0E0]'
                }`}>
                <option value="Y">Active</option>
                <option value="N">Cancelled</option>
              </select>
              <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
              Booking Status
            </span>
            </div>

             )}

        </div>

        {/* Unit Details */}
        <div>
          <div
            onClick={() =>
              setAccordion((prev) => ({
                ...prev,
                unitDetails: !prev.unitDetails,
              }))
            }
            className="cursor-pointer flex items-center mt-4"
          >
            <img src={IMAGES.InfoIcon} alt="info icon" />
            <p className="text-[#9A55FF] font-semibold ml-3 ">Unit Details</p>
            <img
              src={IMAGES.DownArrow}
              alt="down arrow"
              className={`ml-auto ${
                accordion?.unitDetails ? "rotate-180" : ""
              }`}
            />
          </div>

          {accordion?.unitDetails && (
            <>
              <div className="flex gap-4 mt-4">
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    onChange={(e) => setWing(e.target.value)}
                    value={wing}
                    placeholder="Enter Here.."
                    type="text"
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    Wing
                  </span>
                </div>

                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    onChange={(e) => setFlatNo(e.target.value)}
                    value={flatNo}
                    placeholder="Enter Here.."
                    type="text"
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    Flat
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 z-30">
                <Select
                  //value={selectedClosed}
                  onChange={(selectedOption) => {
                      setSelectedConfiguration(selectedOption?.value);
                      // setFormData({ ...formData, sourced: selectedOption.value });
                  }}
                  options={configurationOptions}
                  classNamePrefix="react-select" 
                  placeholder={configurationOptions.find(option => option.value === Number(detailsData?.generic_details?.configuration_id))?.label}
                />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    Typology
                  </span>
                </div>
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    onChange={(e) => setCarpetArea(e.target.value)}
                    value={carpetArea}
                    placeholder="Enter Here.."
                    type="text"
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    Carpet area
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Cost Details */}
        <div>
          <div
            onClick={() =>
              setAccordion((prev) => ({
                ...prev,
                costDetails: !prev.costDetails,
              }))
            }
            className="flex cursor-pointer items-center mt-4"
          >
            <img src={IMAGES.InfoIcon} alt="info icon" />
            <p className="text-[#9A55FF] font-semibold ml-3 ">Cost Details</p>
            <img
              src={IMAGES.DownArrow}
              alt="down arrow"
              className={`ml-auto ${
                accordion?.costDetails ? "rotate-180" : ""
              } `}
            />
          </div>
          {accordion?.costDetails && (
            <>
              <div className="flex gap-4 mt-4">
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    onChange={(e) => setAgreementValue(e.target.value)}
                    value={agreementValue}
                    placeholder="Enter Here.."
                    type="text"
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    AV
                  </span>
                </div>
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    onChange={(e) => setBscAV(e.target.value)}
                    value={bcvAV}
                    placeholder="Enter Here.."
                    type="text"
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    BCV AV
                  </span>
                </div>
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    value={detailsData?.fetched_brokerage_percent }
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

              <div className="flex gap-4 mt-6">
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    value={detailsData?.fetched_ladder_percent  ?? 0}
                    placeholder="Enter Here.."
                    type="text"
                    disabled
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    Ladder
                  </span>
                </div>
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9">
                  <input
                    value={detailsData?.fetched_kicker_percent ?? 0}
                    placeholder="Enter Here.."
                    type="text"
                    className="rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    Kicker
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
               <div className="flex-1 relative border border-[#E0E0E0] rounded h-9">
                  <input
                    value={detailsData?.ei_value ?? 0}
                    placeholder="Enter Here.."
                    type="text"
                    disabled
                    className="rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    EI Value
                  </span>
                </div>

                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9">
                  <input
                    value={detailsData?.kicker_value ?? 0}
                    placeholder="Enter Here.."
                    type="text"
                    disabled
                    className="rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    Kicker Value
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-6">

                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    value={detailsData?.fetched_ei_percent ?? 0}
                    placeholder="Enter Here.."
                    type="text"
                    className="rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    EI
                  </span>
                </div>

              {detailsData?.aop_percent && (
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    value={detailsData?.aop_percent ?? 0}
                    placeholder="Enter Here.."
                    type="text"
                    className="rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    AOP %
                  </span>
                </div>
              )}


                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    value={"18%"}
                    placeholder="Enter Here.."
                    type="text"
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    GST
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    value={"5%"}
                    placeholder="Enter Here.."
                    type="text"
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    TDS
                  </span>
                </div>
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    value={Math.round(GSTAmount)}
                    placeholder="Enter Here.."
                    type="text"
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    GST Amount
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    value={Math.round(TDSAmount)}
                    placeholder="Enter Here.."
                    type="text"
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    TDS Amount
                  </span>
                </div>
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                     onChange={(e) => setCashbackAmount(e.target.value)}
                     value={cashback_amount}
                    placeholder="Enter Here.."
                    type="text"
                    className=" pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    Cashback
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    value={Math.round(invoiceValue)}
                    placeholder="Enter Here.."
                    type="text"
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    Invoice Amount
                  </span>
                </div>
                <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                  <input
                    value={Math.round(realizeAmount)}
                    placeholder="Enter Here.."
                    type="text"
                    className="pt-1 rounded outline-none text-sm text-[#838383] pl-3 h-full w-full"
                  />
                  <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                    Realized Amount
                  </span>
                </div>
              </div>
            </>
          )}

          <button
            onClick={() => {
              handleUpdate();
            }}
            className="bg-[#9A55FF] text-white text-sm font-semibold h-[30px] rounded px-5 block mx-auto mt-3"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
