import React, { useEffect, useState , useContext } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { toast } from "react-toastify";
import IMAGES from "@images";
import { AppContext } from "@context/AppContext";
import apiInstance from "@api/apiInstance";
import { useLoggerStore } from "@store/log.jsx";




function AddClient({ onClose }) {
    const [isChecked, setIsChecked] = useState(false);
    const { activeUserData } = useContext(AppContext);
    const { updateActivityLog , initializeLogData } = useLoggerStore();

    const handleLogCheck = async (log) => {
        updateActivityLog(log);
    }

    useEffect(() => {
        initializeLogData(activeUserData);
    }, [activeUserData, initializeLogData]);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        Email: '',
        agreementValue: '',
        bcvAV: '',
        wing: '',
        tower: '',
        flatNo: '',
        carpet: '',
        configuration: '',
        project: '',
        closure: '',
        sourced: '',
        closed : '',
        token: '',
        added_by : activeUserData.user_id
    });

    const hitCron = async () => {
        try {
          const response = await apiInstance('client/ladderCronjob.php', 'POST');
      
          if (response?.status === 200) {
            console.log('POST request was successful.');
          } else {
            console.error('POST request failed with status:', response.status);
          }
        } catch (error) {
          console.error('Error:', error);
        }
    };

    const hitCron2 = async () => {
        try {
          const response = await apiInstance('client/productivity_report_cronjob.php', 'POST');
      
          if (response?.status === 200) {
            console.log('POST request was successful.');
          } else {
            console.error('POST request failed with status:', response.status);
          }
        } catch (error) {
          console.error('Error:', error);
        }
    };
    
    const currentDate = new Date().toISOString().split('T')[0];

    const [dropdownData, setDropdownData] = useState(null);

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
        hitCron();
        hitCron2();
      }, []);
      
    const [configurationOptions, setConfigurationOptions] = useState([]);
    const [projectOptions, setProjectOptions] = useState([]);
    const [sourceByOptions, setSourceByOptions] = useState([]);
    const [closedByOptions, setClosedByOptions] = useState([]);
    const [selectedConfiguration, setSelectedConfiguration] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedSourced, setSelectedSourced] = useState(null);
    const [selectedClosed, setSelectedClosed] = useState(null);

    useEffect(() => {
        if (dropdownData) {
            const configOptions = dropdownData?.configuration.map(configuration => ({
                value: configuration.id,
                label: configuration.name
            }));
            const projOptions = dropdownData?.project.map(project => ({
                value: project.id,
                label: project.name
            }));
            const sourceByOptions = dropdownData?.source_by_and_closed_by.map(item => ({
                value: item.id,
                label: item.name
            }));
            const closedByOptions = dropdownData?.source_by_and_closed_by.map(item => ({
                value: item.id,
                label: item.name
            }));

            setConfigurationOptions(configOptions);
            setProjectOptions(projOptions);
            setSourceByOptions(sourceByOptions);
            setClosedByOptions(closedByOptions);
        }
    }, [dropdownData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (number) => {
      const phoneRegex = /^\d{10}$/;
      return phoneRegex.test(number);
    };

    const clearForm = (e) => {
        setFormData({
            name: '',
            Email: '',
            phoneNumber: '',
            agreementValue: '',
            bcvAV: '',
            wing: '',
            tower: '',
            flatNo: '',
            carpet: '',
            configuration: '',
            project: '',
            closure: '',
            sourced: '',
            closed : '',
            token: '',
            added_by: formData.added_by
        });
        setSelectedConfiguration(null);
        setSelectedProject(null);
        setSelectedSourced(null);
        setSelectedClosed(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Check if any required field is empty
        const requiredFields = ['name', 'phoneNumber', 'agreementValue', 'carpet', 'token', 'configuration', 'project', 'closure', 'sourced', 'closed'];
        const emptyFields = requiredFields.filter(field => !formData[field]);
    
        if (emptyFields.length > 0) {
            // Show toast error if any required field is empty
            toast.error(`Please fill in all required fields: ${emptyFields.join(', ')}`);
        } else if (formData.phoneNumber !== '' && !validatePhoneNumber(formData.phoneNumber)) {
            toast.error('Please enter a valid phone number');
        } else if (isChecked && formData.Email === '') {
            toast.error('Please fill in the email field');
        } else if (isChecked && formData.Email !== '' && !validateEmail(formData.Email)) {
            toast.error('Please enter a valid email address');
        } 
        // else if (Number(formData.token) >= Number(formData.agreementValue)) {
        //     toast.error('Token Amount cannot be greater or equal to agreement value ');
        // }
        else {
            // Construct the body for the POST request
            const requestBody = {
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                email: formData.Email,
                agreementValue: formData.agreementValue,
                bcvAV: formData.bcvAV.trim() === '' || formData.bcvAV === null ? 0 : formData.bcvAV,
                wing: formData.wing.trim() === '' || formData.wing === null ? null : formData.wing,
                tower: formData.tower.trim() === '' || formData.tower === null ? null : formData.tower,
                flatNo: formData.flatNo.trim() === '' || formData.flatNo === null ? null : formData.flatNo,
                carpet: formData.carpet,
                configuration: formData.configuration,
                project: formData.project,
                closure: formData.closure,
                sourced: formData.sourced,
                closed: formData.closed,
                token: formData.token,
                added_by: formData.added_by
            };
            handleLogCheck(`AddClient ${new Date().toLocaleString()} new client added with requestBody: ${JSON.stringify(requestBody)}`);
            // Send POST request using the apiInstance
            apiInstance('client/addClient.php', 'POST', requestBody)
                .then(response => {
                    if (response) {
                        // Handle success
                        clearForm();
                        const message = document.createElement('p');
                        message.innerHTML = 'Client Added Successfully!';
                        message.style.color = 'green';
                        message.style.fontSize = '13px';
                        successDivContent.appendChild(message);
                        setTimeout(() => {
                            successDivContent.removeChild(message);
                        }, 3000);
                        hitCron();
                        console.log(response);
                        if (response.data === "record already exists") {
                            toast.error("Client already exists!");
                        }
                        // You can perform further actions here after a successful request
                    } else {
                        // Handle error
                        console.error('Request failed');
                        toast.error("Request failed!");
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    };
    
    

    return (
       
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-x-hidden pt-20 font-ubuntu outline-none backdrop-brightness-50 focus:outline-none">
            <div className="modal mx-auto max-h-[100vh] w-[690px] overflow-y-scroll rounded-xl bg-white pb-4 pl-6 pr-6 outline-none handle">
                <div className="sticky top-0 z-50 flex items-center justify-between py-5 bg-white h-fit">
                    <span className="text-sm font-semibold text-[#0d0d0d] underline decoration-[#0b0a0c] decoration-solid underline-offset-[12px]">
                        Add New Client
                    </span>
                    <img
                        onClick={() => onClose((prev) => !prev)}
                        className="cursor-pointer"
                        src={IMAGES.CloseIcon}
                        alt="close icon"
                    />
                </div>

                <form >
                    <div className='flex 1 gap-3 mt-4'>
                        <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                            <input
                                value={formData.name}
                                type="text"
                                name="name"
                                placeholder='Name'
                                onChange={handleChange}
                                className="rounded pt-1 outline-none text-sm text-[#838383] pl-3 h-full w-full"
                            />
                            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                                Name
                            </span>
                        </div>
                        <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                            <input
                                value={formData.phoneNumber}
                                type="text"
                                name="phoneNumber"
                                placeholder='Phone Number'
                                onChange={handleChange}
                                className="rounded pt-1 outline-none text-sm text-[#838383] pl-3 h-full w-full"
                            />
                            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                                Phone Number
                            </span>
                        </div>
                        <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                            <input
                                value={formData.agreementValue}
                                type="number"
                                name="agreementValue"
                                placeholder='Agreement Value'
                                onChange={handleChange}
                                className="rounded pt-1 outline-none text-sm text-[#838383] pl-3 h-full w-full"
                            />
                            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                                AV
                            </span>
                        </div>
                        <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                            <input
                                value={formData.bcvAV}
                                type="number"
                                name="bcvAV"
                                placeholder='BCV Value'
                                onChange={handleChange}
                                className="rounded pt-1 outline-none text-sm text-[#838383] pl-3 h-full w-full"
                            />
                            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                                BCV AV
                            </span>
                        </div>
                    </div>

                    <div className='flex 1 gap-3 mt-5'>
                        <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                            <input
                                value={formData.wing}
                                type="text"
                                name="wing"
                                placeholder='Wing'
                                onChange={handleChange}
                                className="rounded pt-1 outline-none text-sm text-[#838383] pl-3 h-full w-full"
                            />
                            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                                Wing
                            </span>
                        </div>
                        <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                            <input
                                value={formData.tower}
                                type="text"
                                name="tower"
                                placeholder='Tower'
                                onChange={handleChange}
                                className="rounded pt-1 outline-none text-sm text-[#838383] pl-3 h-full w-full"
                            />
                            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                                Tower
                            </span>
                        </div>
                        <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                            <input
                                value={formData.flatNo}
                                type="number"
                                name="flatNo"
                                placeholder='Flat No'
                                onChange={handleChange}
                                className="rounded pt-1 outline-none text-sm text-[#838383] pl-3 h-full w-full"
                            />
                            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                                Flat No
                            </span>
                        </div>
                    </div>

                    <div className='flex 1 gap-3 mt-5'>
                        <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                            <input
                                value={formData.carpet}
                                type="text"
                                name="carpet"
                                placeholder='Carpet Area'
                                onChange={handleChange}
                                className="rounded pt-1 outline-none text-sm text-[#838383] pl-3 h-full w-full"
                            />
                            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                                Carpet Area
                            </span>
                        </div>
                        <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 z-50">
                        <Select
                            value={selectedConfiguration}
                            onChange={(selectedOption) => {
                                setSelectedConfiguration(selectedOption);
                                setFormData({ ...formData, configuration: selectedOption.value });
                            }}
                            options={configurationOptions}
                            classNamePrefix="react-select" 
                        />
                            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                                Configuration
                            </span>
                        </div> 
                        <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 z-50">
                        <Select
                            value={selectedProject}
                            onChange={(selectedOption) => {
                                setSelectedProject(selectedOption);
                                setFormData({ ...formData, project: selectedOption.value });
                            }}
                            options={projectOptions}
                            classNamePrefix="react-select" 
                        />
                            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                                Project
                            </span>
                        </div>
                    </div>

                    <div className='flex 1 gap-3 mt-5'>
                        <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 ">
                            <input
                                value={formData.closure}
                                type="date"
                                name="closure"
                                max={currentDate}
                                onChange={handleChange}
                                className="rounded pt-1 outline-none text-sm text-[#838383] pl-3 h-full w-full"
                            />
                            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                                Closure Date
                            </span>
                        </div>
                        <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 z-10">
                        <Select
                            value={selectedSourced}
                            onChange={(selectedOption) => {
                                setSelectedSourced(selectedOption);
                                setFormData({ ...formData, sourced: selectedOption.value });
                            }}
                            options={sourceByOptions}
                            classNamePrefix="react-select" 
                        />
                            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                                Sourced By
                            </span>
                        </div>
                        <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 z-10">
                        <Select
                            value={selectedClosed}
                            onChange={(selectedOption) => {
                                setSelectedClosed(selectedOption);
                                setFormData({ ...formData, closed: selectedOption.value });
                            }}
                            options={closedByOptions}
                            classNamePrefix="react-select" 
                        />
                            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                                Closed By
                            </span>
                        </div>
                    </div>

                    <div className='flex 1 gap-3 mt-5'>
                    <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 w-[100px]">
                            <input
                                value={formData.token}
                                type="number"
                                name="token"
                                onChange={handleChange}
                                className="rounded pt-1 outline-none text-sm text-[#838383] pl-3 h-full "
                                placeholder='Token Amount'
                            />
                            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                                Token Amount
                            </span>
                        </div>
                        {isChecked && (
                        <div>
                        <div className="flex-1 relative border border-[#E0E0E0] rounded h-9 mr-4">
                            <input
                                value={formData.Email }
                                type="email"
                                name="Email"
                                placeholder='Email'
                                onChange={handleChange}
                                className="rounded pt-1 outline-none text-sm text-[#838383] pl-3 h-full w-full min-w-[300px]"
                            />
                            <span className="absolute -top-3 z-10 left-4 bg-white px-3 text-[#696969] text-sm">
                                Client Email
                            </span>
                        </div>
                        </div>
                        )}
                    </div>

                    {/* last row  */}

                    <div className=" mt-4 flex flex-row gap-2">
                        {/* email div  */}
                       
                       

                        {/* check box div  */}
                        <div className='flex mt-2'>
                        <p className=' text-xs'>Is this client CP Friendly?</p>
                        <input 
                            type="checkbox" 
                            className='h-4 w-4 ml-2' 
                            checked={isChecked} 
                            onChange={handleCheckboxChange} 
                        />
                        </div>

                        
                     
                    </div>

                    <div className='flex 1 justify-center mt-12 '>
                    <button  className="bg-[#9A55FF] text-white text-sm font-semibold h-[30px] rounded px-5 block mr-2"
                     onClick={(e) => { 
                        handleSubmit(e);
                        }}
                    >
                        Add
                    </button>


                    <button  className="bg-[#000000] flex text-white items-center gap-2 text-sm font-semibold h-[30px] rounded pr-2 mr-2" 
                     onClick={(e) => {
                        e.preventDefault(); 
                        clearForm(); 
                    }}>
                    <span className=' justify-start'>
                        <img  className="cursor-pointer"
                      src={IMAGES.ClearAllIcon}
                      alt="clear all icon"/></span> 
                      Clear
                    </button>
                    
                    </div>

                    <div className=" text-center" id="successDivContent"></div>
                    
                </form>
            </div>
        </div>
      

    )
}

export default AddClient;
