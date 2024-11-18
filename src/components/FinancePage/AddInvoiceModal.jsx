import axios from "axios";
import { useState, useEffect , useContext } from "react";
import { toast } from "react-toastify";
import Draggable from 'react-draggable';
import IMAGES from "@images";
import apiInstance from "@api/apiInstance";
import { useLoggerStore } from "@store/log";
import { AppContext } from "@context/AppContext";




const AddInvoiceModal = ({ clientID, companyData, onClose }) => {
  //console.log("company - data" , companyData);
  const [company, setCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceValue, setInvoiceValue] = useState('');
  const [raiseDate, setRaiseDate] = useState('');
  const [invoiceType  , setInvoiceType] = useState('');
  const [mcData , setMcData] = useState([]);
  const [costDetails , setcostDetails] = useState([]);
  const [av , setAv] =  useState(null);
  const [realizedAmount , setRealizedAmount] = useState(null);

  const [isChecked, setIsChecked] = useState(false);
  const [cpDate , setcpDAte] = useState(null);
  const [existingInvNo , setExistingInvNo] = useState(null);

  // State to store the value based on the checkbox
  const [storageValue, setStorageValue] = useState('Full');

  const [baseBrokerage , setBaseBrokerage] = useState(null);
  const [ladderBrokerage , setLadderBrokerage] = useState(null);
  const [aopBrokerage , setAopBrokerage] = useState(null);
  const [customPercent , setCustomPercent] = useState(null);
  const [brokerageType , setBrokerageType] = useState('base');
  const [cashBackAmount  , setCashBackAmount] = useState(null);
  const [agreementValue , setAgreementValue] = useState(null);


  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); 
    setStorageValue(!isChecked ? 'Partial' : 'Full');
  //  console.log(storageValue); 
  };

  const currentDate = new Date().toISOString().split('T')[0];

  const { activeUserData } = useContext(AppContext);

  const {updateActivityLog , initializeLogData } = useLoggerStore();

  const handleLogCheck = async (log) => {
   updateActivityLog(log);
  } 

  useEffect(() => {
    initializeLogData(activeUserData);
  }, [activeUserData, initializeLogData]);


  function calculateRealizedAmount(agreementValue, fetchedBrokeragePercent, cashbackAmount) {
    const invoiceValue = Math.round(agreementValue * (fetchedBrokeragePercent / 100));

    const GSTAmount = invoiceValue * 0.18;
  
    const totalInvoiceValue = invoiceValue + GSTAmount;
  
    const TDSAmount = invoiceValue * 0.05;
  
    const realizeAmount = Math.round(totalInvoiceValue - TDSAmount - (cashbackAmount || 0));
  
    return realizeAmount;
  }

  const clearForm = () => {
    setInvoiceType('');
    setInvoiceNumber('');
    setInvoiceValue('');
    setRaiseDate('');
    setBrokerageType(null);
    setRealizedAmount(null);
  }
 
  useEffect(() => {
    if (companyData !== null) {
      setCompany(companyData[0].id);
    }
  }, [companyData]);

  useEffect(() => {
    const getCost = async () => {
      try {
        const response = await apiInstance (
          'client/getCost.php',
          'POST',
          { client_id: clientID }
        );
        if (response?.data) {
          setcostDetails(response.data);
          setcpDAte(response.data[0]?.composite_date);
          const agreementValue = response.data[0]?.agreement_value;
          setAgreementValue(agreementValue);
          const baseBrokerage = Math.round(Number(response.data[0]?.base_brokerage));
          const cashbackAmount = Math.round(Number(response.data[0]?.cashback_amount)) || 0;
          setAopBrokerage(response.data[0]?.aop_percent);
          setBaseBrokerage(Number(response.data[0]?.base_brokerage));
          setLadderBrokerage(Number(response.data[0]?.ladder_stage));
          setCashBackAmount(Number(Math.round(Number(response.data[0]?.cashback_amount)) || 0));
          let realizedAmountt = Math.round(calculateRealizedAmount(agreementValue, baseBrokerage, cashbackAmount));
          setRealizedAmount(realizedAmountt);
         // console.log(response.data);
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    getCost();
  }, [clientID]);


  useEffect(() => {
    const getMicroserviceData = async () => {
      try {
        const response = await apiInstance(
          'client/invmicroservice.php',
          'GET'
        );
        setExistingInvNo(response.data?.invno_array)
        setMcData(response.data);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    getMicroserviceData();
  }, []);

  function checkInvoiceExists(invoiceNumber) {
    return existingInvNo.some(inv => inv.invoice_number === invoiceNumber);
  }

  function handleBrokerageClick(type) {
    setBrokerageType(type);
    if (type === 'base') {
      dynamicRealizedAmount('base', baseBrokerage);
      setCustomPercent(null);
    } else if (type === 'ladder') {
      setCustomPercent(null);
      dynamicRealizedAmount('ladder', ladderBrokerage);
    } else if (type === 'aop') {
      setCustomPercent(null);
      dynamicRealizedAmount('aop', aopBrokerage);
    } else if (type === 'custom') {
      // Pass a custom percentage or value here
      dynamicRealizedAmount('custom');
    }
  }
  
  // Your dynamicRealizedAmount function
  function dynamicRealizedAmount(type) {
    if (type === 'base') {
      setRealizedAmount(calculateRealizedAmount(agreementValue, baseBrokerage , cashBackAmount));
    } else if (type === 'ladder') {
      setRealizedAmount(calculateRealizedAmount(agreementValue, ladderBrokerage , cashBackAmount));
    } else if (type === 'aop') {
      setRealizedAmount(calculateRealizedAmount(agreementValue, aopBrokerage , cashBackAmount));
    } else if (type === 'custom') {
        setRealizedAmount(calculateRealizedAmount(agreementValue, customPercent , cashBackAmount));
    }
  }

          useEffect(() => {
            const fetchCompanyData = async () => {
              try {
                const response = await apiInstance('dropdown.php', 'GET');
                const data = response.data;
              
                const companyData = [];
              
                data.forEach((location) => {
                  location.developers.forEach((developer) => {
                    developer.companies.forEach((company) => {
                      companyData.push({
                        value: company.company_id,
                        label: company.company_name,
                      });
                    });
                  });
                });
              
                setFilteredOptions(companyData);
              } catch (error) {
                console.error('Error fetching company data:', error);
              }
            };
          
            fetchCompanyData();
          }, []);

  const getFinancialYear = (inputDate) => {
    const date = new Date(inputDate);
  
    if (date.getMonth() < 3) {
      return `/${date.getFullYear() - 1}/${date.getFullYear() % 100}`;
    } else {
      return `/${date.getFullYear()}/${(date.getFullYear() % 100) + 1}`;
    }
  };


  const addData = async () => {
    try {
      if (!invoiceNumber || !realizedAmount || !invoiceType || !raiseDate) {
        toast.error("Please fill all the value");
        return;
      } 

      if (invoiceNumber && checkInvoiceExists(invoiceNumber)){
        toast.error("Invoice number exits");
      }
  
      if(realizedAmount <= 0){
        toast.error("Invalid invoice value");
      }

      handleLogCheck(`Generating Invoice for client_id ${clientID} with invoice type ${invoiceType} and invoice number ${invoiceNumber} and invoice value ${invoiceValue} and raise date ${raiseDate}`);
      const response = await apiInstance(
        'client/invoice.php',
        'PUT',
        {
          client_id: clientID,
          invoice_value: storageValue === 'Full' ? realizedAmount : invoiceValue,
          company_id: costDetails[0]?.company_id,
          invoice_number: invoiceNumber,
          invoice_type: invoiceType,
          raise_date: raiseDate,
          brokerage_type : brokerageType,
          brokerage_percent: brokerageType === 'base' ? baseBrokerage : 
          brokerageType === 'ladder' ? ladderBrokerage : 
          brokerageType === 'aop' ? aopBrokerage : 
          brokerageType === 'custom' ? customPercent : 0
        }
      );
  
      // console.log(response);
  
      if (response.data.message === 'Data inserted successfully.') {
        //toast.success("Invoice Added Successfully");
        const message = document.createElement('p');
        message.innerHTML = 'Added Successfully!';
        message.style.color = 'green';
        message.style.fontSize = '13px';
        successDivContent.appendChild(message);
        setTimeout(() => {
          successDivContent.removeChild(message);
        }, 3000);
        clearForm();

      }
    } catch (error) {
      console.error('Error adding data:', error);
      toast.error("Error adding data");
    }
  };
  
  

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-x-hidden pt-20 font-ubuntu outline-none backdrop-brightness-50 focus:outline-none">
      <div className="modal mx-auto max-h-[80vh]  w-[560px] z-[100] overflow-y-scroll rounded-xl bg-white pb-4 pl-6 pr-6 outline-none">
        <div className="sticky top-0 z-10 flex items-center justify-between py-5 bg-white h-fit">
          <span className="text-lg font-semibold text-[#9A55FF] underline decoration-[#9A55FF] decoration-solid underline-offset-[12px]">
            Add Invoice
          </span>
          <img
            onClick={() => onClose((prev) => !prev)}
            className="cursor-pointer"
            src={IMAGES.CloseIcon}
            alt="close icon"
          />
        </div>

        {/* FIRST ROW */}
        <div className="flex gap-8 mt-3 ">
        
          <div className="flex-1">
            <p className="text-[#696969] font-medium text-sm mb-1">Select Type</p>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-[#CFCFCF] rounded w-full text-[#9A9A9A] text-xs pl-2 outline-none h-[30px]"
              />
              <div className="absolute inset-0 cursor-pointer">
                <select
                value={invoiceType}
                  onChange={(e) => setInvoiceType(e.target.value)}
                  className="w-full h-full appearance-none bg-transparent border-none text-[#9A9A9A] text-xs pl-2 outline-none"
                >
                   <option value="" selected hidden>
                      Select Here
                    </option>
                    <option value="Proforma" >
                    Proforma
                    </option>
                    <option value="Tax" >
                      Tax
                    </option>
                    <option value="Advance" >
                      Advance
                    </option>
                </select>
              </div>
            </div>
          </div>


          <div className="flex-1">
            <p className="text-[#696969] font-medium text-sm mb-1">
              Invoice No
            </p>
            <input
             value={invoiceNumber}
             onChange={(e) => setInvoiceNumber(e.target.value)}
              type="number"
              placeholder="Invoice Number"
              className={`border rounded w-full text-[#9A9A9A] text-xs pl-2 outline-none h-[30px] ${invoiceNumber && checkInvoiceExists(invoiceNumber) ? 'border-red-500' : 'border-[#CFCFCF]'}`}
            />
            <p className="text-[#696969] font-medium text-xs mb-1 mt-1 ml-1">
              {invoiceNumber +   getFinancialYear(raiseDate)}
              {invoiceNumber && checkInvoiceExists(invoiceNumber) && (<span className="text-[10px] text-red-500 ml-2">INV Exists</span>)}
            </p>
            
          </div>
        </div>

        <div className="flex gap-3 mt-3">

          <div>
                <label className="relative inline-flex items-center cursor-pointer ">
                    <span className="mr-2 text-sm font-semibold  leading-none">
                      Full
                    </span>

                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />

                    <div className="w-7 h-[14px] bg-gray-200 peer-focus:outline-none  rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px]  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[10px] after:w-[14px] after:transition-all  peer-checked:bg-[#9A55FF]"></div>
                    <span className="ml-3 text-sm font-semibold  leading-none">
                      Partial
                    </span> 
                  </label>

          </div>

          <div className="">
          <p className="text-[11px] mt-1 gap-2 text-[#9A55FF] flex select-none">
                     (
                     <span
                       className="underline-offset-0 underline decoration-[#9A55FF] cursor-pointer"
                       onClick={() => handleBrokerageClick('base')}
                     >
                       Base %
                     </span>

                     <span
                       className="underline-offset-0 underline decoration-[#9A55FF] cursor-pointer"
                       onClick={() => handleBrokerageClick('ladder')}
                     >
                       Ladder %
                     </span>

                     <span
                       className="underline-offset-0 underline decoration-[#9A55FF] cursor-pointer"
                       onClick={() => handleBrokerageClick('aop')}
                     >
                       Aop %
                     </span>

                     <span
                       className="underline-offset-0 underline decoration-[#9A55FF] cursor-pointer"
                       onClick={() => handleBrokerageClick('custom')}
                     >
                       Custom %
                     </span>
                     )  
                     
            </p>
          </div>
          
          </div>

        {/* SECOND ROW */}
        <div className="flex gap-8 mt-3">
        {brokerageType && brokerageType == 'custom' && (
            <div className="flex-1">
                     <p className="text-[#696969] font-medium text-sm mb-1">
                    custom %
                    </p>
                         <input type="text" 
                         className="border w-12 ml-1 rounded p-1 border-[#9A55FF] "
                         placeholder="%"
                         onChange={(e) => setCustomPercent(e.target.value)}
                         max={10}
                         />
                         <span className="ml-2 text-[19px] cursor-pointer text-[#9A55FF] text-sm"
                         onClick={() => handleBrokerageClick('custom')}
                         >
                                <i class="fa-regular fa-square-check"></i>
                         </span>


            </div>
           
            
          )}

          <div className="flex-1">
            <p className="text-[#696969] font-medium text-sm mb-1">
              Invoice Value ({brokerageType} %)
            </p>
            <input
              onChange={(e) => {
                  const newValue = Math.min(e.target.value, realizedAmount);
                  setInvoiceValue(newValue);
              }}
              type="number"
              placeholder="Invoice Value"
              value={storageValue === 'Full' ? Math.round(realizedAmount) : Math.round(invoiceValue)}
              max={realizedAmount}
              disabled={storageValue === 'Full'}
              className={`border border-[#CFCFCF] rounded w-full text-[#000000] text-xs pl-2 outline-none h-[30px] ${storageValue === 'Full' ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
          </div>

          

          <div className="flex-1">
              <p className="text-[#696969] font-medium text-sm mb-1">
                Raise Date
              </p>
              <input
              onChange={(e) => setRaiseDate(e.target.value)}
              value={raiseDate}
              type="date"
              max={currentDate}
              min={cpDate}
              placeholder="Raise Date"
              className="border border-[#CFCFCF] rounded w-full text-[#9A9A9A] text-xs pl-2 outline-none h-[30px]"
            />
            </div>
            <div className="flex-1">
           <p className="text-[#696969] font-medium text-sm mb-1">Company</p>
           
          <input
            type="text"
            value={costDetails[0]?.company_name ? costDetails[0]?.company_name : ''}
            className="border border-[#CFCFCF] rounded w-full text-[#9A9A9A] text-xs pl-2 outline-none h-[30px]"
            readOnly
          />
        
        </div>


        </div>
        <div className="flex flex-1 items-center justify-center"> 
            <button
                onClick={addData}
                className="bg-[#9A55FF] text-white text-sm font-semibold h-[30px] rounded px-5 mr-2 my-6"
            >
                Generate
            </button>
            <img
                onClick={clearForm} 
                className="cursor-pointer mr-8" 
                src={IMAGES.ClearAllIcon}
                alt="clear all icon"
            />
        </div>
        <div className=" text-center" id="successDivContent"></div>

        
     
      </div>
    </div>
  );
};

export { AddInvoiceModal };
