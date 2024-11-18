import { useEffect, useRef, useState , useContext } from "react";
import Select, { components } from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from "axios";
import IMAGES from "@images";
import DateRangePicker from "@common/DateRangePicker";
import { useFilterContext } from '@context/FilterContext';
import { AppContext } from "@context/AppContext";
import apiInstance from "@api/apiInstance";



const FilterContainer = ({ displayProperty , widthProperty }) => {
  // filter name state in the save filter input textbox
  const [filterName, setFilterName] = useState("");
  const { updateFilterData } = useFilterContext();
  const [activeElementIds, setActiveElementIds] = useState([]);
  const { activeUserData } = useContext(AppContext);
  const animatedComponents = makeAnimated();
 
  const [sliderValues, setSliderValues] = useState({});

  const handleElementClick = (id) => {
    setActiveElementIds((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((activeId) => activeId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  // state to toggle the between filters & saved filters
  const [filterOrSavedFilterVisible, setFilterOrSavedFilterVisible] =
    useState("filters");

  // state to maintain the selected filters eg. Name/contact, OCR, Project etc
  const [selectedFilter, setselectedFilter] = useState(null);

  // state to toggle save filter popoup in which the user will enter the filter name
  const [saveFilerVisible, setSaveFilterVisible] = useState(false);

  // ref of the container to close it if click outside
  const filterContainerRef = useRef(null);

  const [savedFilters, setSavedFilters] = useState([]);

  const [dropdownData, setDropdownData] = useState();

  const [name, setName] = useState();
  const [selectedProjectIds, setSelectedProjectIds] = useState();
  const [configuration, setConfiguration] = useState();
  const [sourcedBy, setSourcedBy] = useState([]);
  const [closedBy, setClosedBy] = useState([]);
  const [closureDate, setClosureDate] = useState(null);
  const [obDate, setObDate] = useState();
  const [obType , setObtype] = useState();
  const [invoiceType , setInvoiceType] = useState([]);
  const [followUpDate, setFollowUpDate] = useState();
  const [raiseDate , setRaiseDate] = useState();
  const [expectedDate , setExpectedDate] = useState();
  const [submittedDate , setSubmittedDate] = useState();
  const [receivedDate , setReceivedDate] = useState();
  const [tryselectedElements, settrySelectedElements] = useState([]);
  const [selectedConfigurations , setSelectedConfigurations] = useState([]);
  const [selectedDeveloper , setSelectedDeveloper] = useState([]);
  const [bookingStatus , setBookingStatus] = useState(null);
  const [sortType , setSortType] = useState();
  const [devProjectData, setDevProjectData] = useState({ developer: [], project: [] });
  const [originalProjectData, setOriginalProjectData] = useState([]);



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

  const saveFilter = () => {
    let requestBody = {
      name_number: name,
      user_active: bookingStatus.value,
      project_ids: tryselectedElements.map(element => parseInt(element.value, 10)).join(', '),
      developer_ids: selectedDeveloper.map(element => parseInt(element.value, 10)).join(', '),
      invoice_post_raise_status: invoiceType.map(element => parseInt(element.value, 10)).join(', '),
      sourced_by: sourcedBy.map(element => parseInt(element.value, 10)).join(', '),
      closed_by: closedBy.map(element => parseInt(element.value, 10)).join(', '),
      configurations: selectedConfigurations.map(element => parseInt(element.value, 10)).join(', '),
     /*  ...(activeElementIds != null && activeElementIds !== "" && {
        configurations: activeElementIds.join(","),
      }), */        
      closure_date: closureDate?.startDate != null
      ? closureDate.startDate + " - " + closureDate.endDate
      : null,
      ...(obType === '1' && obDate != null && {
        ba1_date: obDate.startDate + " - " + obDate.endDate,
      }),
      ...(obType === '2' && obDate != null && {
        ba2_date: obDate.startDate + " - " + obDate.endDate,
      }),
      ...(obType === '3' && obDate != null && {
        sdr_date: obDate.startDate + " - " + obDate.endDate,
      }),
      ...(obType === '4' && obDate != null && {
        composite_payment: obDate.startDate + " - " + obDate.endDate,
      }),
      ...(obType === '5' && obDate != null && {
        ba3_date: obDate.startDate + " - " + obDate.endDate,
      }),
      ...(obType !== undefined && {
        ba_status: obType.type ? obType.type : null,
      }),
      ...(sliderValues !== null && sliderValues !== "" && sliderValues !== undefined && {
        agreement_range: sliderValues.min + " - " + sliderValues.max,
      }), 
      followup_date: followUpDate?.startDate != null
      ? followUpDate.startDate + " - " + followUpDate.endDate
      : null,
      raise_Date: raiseDate?.startDate != null
      ? raiseDate.startDate + " - " + raiseDate.endDate
      : null,
      expected_Date: expectedDate?.startDate != null
      ? expectedDate.startDate + " - " + expectedDate.endDate
      : null,
      submitted_Date: submittedDate?.startDate != null
      ? submittedDate.startDate + " - " + submittedDate.endDate
      : null,
      received_Date: receivedDate?.startDate != null
      ? receivedDate.startDate + " - " + receivedDate.endDate
      : null
      };

    const obj  = {
      id: new Date().getTime(),
      filterContainerID: "Home",
      name: filterName,
      filter: requestBody,
    };
    if (localStorage.getItem("Homefilters")) {
      const filters = JSON.parse(localStorage.getItem("Homefilters"));
      filters.push(obj);
      localStorage.setItem("Homefilters", JSON.stringify(filters));
      const getfilters = JSON.parse(localStorage.getItem("Homefilters"));
      setSavedFilters(getfilters);
    } else {
      let temp = [obj];
      localStorage.setItem("Homefilters", JSON.stringify(temp));
      const getfilters = JSON.parse(localStorage.getItem("Homefilters"));
      setSavedFilters(getfilters);
    }
    setFilterName("");
    setSaveFilterVisible(false);
  };

  useEffect(() => {
   // console.log('Slider values changed:', sliderValues);
  }, [sliderValues]);

  useEffect(() => {
    apiInstance('client/ladderFilter.php', 'GET')
      .then(response => {
        setDevProjectData(response.data);
        setOriginalProjectData(response.data.project);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  

    let  requestBody = {
    name_number: name,
    user_active: bookingStatus?.value,
    project_ids: tryselectedElements.map(element => parseInt(element.value, 10)).join(', '),
    developer_ids: selectedDeveloper.map(element => parseInt(element.value, 10)).join(', '),
    invoice_post_raise_status: invoiceType.map(element => parseInt(element.value, 10)).join(', '),
    sourced_by: sourcedBy.map(element => parseInt(element.value, 10)).join(', '),
    closed_by: closedBy.map(element => parseInt(element.value, 10)).join(', '),
    ba_status : obType ? obType.map(element => parseInt(element.value, 10)).join(', ') : null,
    /* ...(activeElementIds != null && activeElementIds !== "" && {
      configurations: activeElementIds.join(","),
    }),  */       
    configurations: selectedConfigurations.map(element => parseInt(element.value, 10)).join(', '),
    closure_date: closureDate?.startDate != null
    ? closureDate.startDate + " - " + closureDate.endDate
    : null,
    ...(obType && obDate?.startDate != null && {
      ba_date: obDate.startDate + " - " + obDate.endDate,
    }),
    /* ...(obType === '2' && obDate != null && {
      ba2_date: obDate.startDate + " - " + obDate.endDate,
    }),
    ...(obType === '3' && obDate != null && {
      sdr_date: obDate.startDate + " - " + obDate.endDate,
    }),
    ...(obType === '4' && obDate != null && {
      composite_payment: obDate.startDate + " - " + obDate.endDate,
    }),
    ...(obType === '5' && obDate != null && {
      ba3_date: obDate.startDate + " - " + obDate.endDate,
    }), */
    //...(obType && obType !== undefined && {
    //  ba_status: obType.value,
    //}),
    ...(sliderValues !== null && sliderValues !== "" && sliderValues !== undefined && {
      agreement_range: sliderValues.min + " - " + sliderValues.max,
    }), 
    followup_date: followUpDate?.startDate != null
    ? followUpDate.startDate + " - " + followUpDate.endDate
    : null,
    raise_Date: raiseDate?.startDate != null
    ? raiseDate.startDate + " - " + raiseDate.endDate
    : null,
    expected_Date: expectedDate?.startDate != null
    ? expectedDate.startDate + " - " + expectedDate.endDate
    : null,
    submitted_Date: submittedDate?.startDate != null
    ? submittedDate.startDate + " - " + submittedDate.endDate
    : null,
    received_Date: receivedDate?.startDate != null
    ? receivedDate.startDate + " - " + receivedDate.endDate
    : null
    };

    const bookingstatusArray = [
      { value: 'Y', label: 'Active' },
      { value: 'N', label: 'Cancelled' }
    ];

    useEffect(() => {
      if (selectedDeveloper.length === 0) {
        // Reset to original project data when no developer is selected
        setDevProjectData(prevState => ({
          ...prevState,
          project: originalProjectData
        }));
      } else {
        // Filter projects based on selected developers
        const filteredProjects = originalProjectData.filter(project =>
          selectedDeveloper.some(dev => dev.value === project.developer_id)
        );
  
        setDevProjectData(prevState => ({
          ...prevState,
          project: filteredProjects
        }));
      }
    }, [selectedDeveloper, originalProjectData]);

  const handleFilter = async () => {
    try {
        updateFilterData(requestBody);
        storeActivity(activeUserData?.user_id, activeUserData?.user_name, `Applied Filter. The Filter Body Is: ${JSON.stringify(requestBody)}`);
      } catch (err) {
        console.log(err);
    }
    };

    const handleClearAll = async () => {
      setName('');
      setSelectedProjectIds([]);
      setActiveElementIds([]);
      setselectedFilter(null);
      setSourcedBy([]);
      setClosedBy([]);
      setClosureDate({ startDate: null, endDate: null });
      setObDate({ startDate: null, endDate: null });
      setObtype(null);
      setInvoiceType([]);
      setFollowUpDate({ startDate: null, endDate: null });
      settrySelectedElements([]);
      setSelectedDeveloper([]);
      setSortType('');
      setRaiseDate({ startDate: null, endDate: null });
      setSubmittedDate({ startDate: null, endDate: null });
      setReceivedDate({ startDate: null, endDate: null });
      setExpectedDate({ startDate: null, endDate: null });
      setBookingStatus(null);
      setSelectedConfigurations([]);
      requestBody = {}
      updateFilterData(requestBody);
      
    }
    const handleSaveFilterClick = (id , filterArray) => {
     // console.log(id, filterArray);
      updateFilterData(filterArray);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
              filterContainerRef.current &&
              !filterContainerRef.current.contains(event.target) &&
              !event.target.closest('.react-datepicker') &&
              !event.target.closest('.react-select__control') &&
              !event.target.closest('.react-select__menu')
            ) {
              filterContainerRef.current.style.display = "none";
            }
          };

      
        if (displayProperty === "block" && filterContainerRef.current) {
          setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside);
          }, 0);
        }
      
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [displayProperty]);

    const deleteFilter = (id, event) => {
      event.stopPropagation();
      const filters = savedFilters.filter((item) => item.id !== id);
      localStorage.setItem("Homefilters", JSON.stringify(filters));
      setSavedFilters(filters);
    };



  const fetchDropdownData = async () => {
    apiInstance('client/bookingdd.php', 'GET')
      .then((res) => {
        setDropdownData(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchDropdownData();
  }, []);

  const customStyles = {
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#bb86fc',
      fontSize: '14px',
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: '14px'
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      cursor: 'pointer',
    }),
    control: (provided) => ({
      ...provided,
      display: 'flex',
      flexWrap: 'nowrap',
    }),
    valueContainer: (provided) => ({
      ...provided,
      display: 'flex',
      flexWrap: 'nowrap',
      overflowX: 'auto',
    }),
  };

  const Option = ({ children, ...props }) => {
    return (
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        {children}
      </components.Option>
    );
  };



  return (
    <div
    ref={filterContainerRef}
    style={{ display: displayProperty }}
    className={`absolute w-[${widthProperty}%] pr-1 top-[16%] z-20 bg-white rounded shadow-gray-500 shadow-2xl border rounded-b-lg select-none border-[#E1E1E1]`}
    >
      {/* Heading Filters OR Saved Fitlers*/}
      <div className="sticky  top-0 flex pt-4 bg-white w-[100%] pl-2">
        <p
          onClick={() => setFilterOrSavedFilterVisible("filters")}
          className={`${
            filterOrSavedFilterVisible === "filters"
              ? "border-b-2 border-b-[#9A55FF] text-[#9A55FF]"
              : "text-[#919191]"
          } px-2 pb-1 text-sm font-medium  cursor-pointer`}
        >
          Filters
        </p>

        <p
          onClick={() => {
            setFilterOrSavedFilterVisible("savedFilters");
          }}
          className={`${
            filterOrSavedFilterVisible === "savedFilters"
              ? "border-b-2 border-b-[#9A55FF] text-[#9A55FF]"
              : "text-[#919191]"
          } px-2 pb-1 text-sm font-medium  cursor-pointer`}
        >
          Saved Filters
        </p>
      </div>

      {/* Filters Div's visible when filterOrSavedFilterVisible is filters*/}
      {filterOrSavedFilterVisible === "filters" && (
        <>
        <div className=" w-full flex flex-wrap gap-x-10 gap-y-2 px-3 py-3 mt-2 text-[#6F6B6B] z-50 font-normal ">

            <div className="w-[14%] ">
                <label htmlFor="Name" className="text-sm">Name</label>
                <input
                 value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  placeholder={"Name / Number"}
                  type="text"
                  className="border  border-[#E0E0E0] outline-none rounded h-8 pl-2 placeholder:text-[#9D9D9D] placeholder:text-xs text-sm w-[94%] "
                />
            </div>
            <div className="w-[14%]">
                <label htmlFor="Closure" className="text-sm">Closure Date</label>
                <DateRangePicker
                  value={closureDate || [null, null]}
                  setValue={setClosureDate}
                />
            </div>
            <div className="w-[14%] ">  
                <label htmlFor="Closure" className="text-sm">Follow-up Date</label>
                <DateRangePicker
                  value={followUpDate}
                  setValue={setFollowUpDate}
                />
            </div>
            <div className="w-[14%] ">  
                <label htmlFor="INv_raise" className="text-sm">INV Raise Date</label>     
                <DateRangePicker
                  value={raiseDate}
                  setValue={setRaiseDate}
                />
            </div>
            <div className="w-[14%] ">  
                <label htmlFor="INv_submit" className="text-sm">INV Submit Date</label>
                <DateRangePicker
                  value={submittedDate}
                  setValue={setSubmittedDate}
                />
            </div>
            <div className="w-[14%]">  
                <label htmlFor="INv_submit" className="text-sm">INV Receive Date</label>
                <DateRangePicker
                  value={receivedDate}
                  setValue={setReceivedDate}
                />
            </div>

            <div className="w-[14%] ">
                <label htmlFor="Developer" className="text-sm">Developer</label>
                <Select
                      options={devProjectData?.developer.map(developer => ({
                        value: developer.id,
                        label: developer.name  
                      }))}
                      isMulti
                      components={{ ...animatedComponents, Option }}
                      value={selectedDeveloper}
                      onChange={(selectedOptions) => setSelectedDeveloper(selectedOptions)}
                      styles={customStyles}
                      placeholder="Select"
                      hideSelectedOptions={false}
                      closeMenuOnSelect={false}
                      className="text-xs"
                    />
            </div>
            <div className="w-[14%] ">
                <label htmlFor="Project" className="text-sm">Project</label>
                <Select
                       options={devProjectData?.project.map(project => ({
                        value: project.project_id,
                        label: project.project_name  
                      }))}
                      isMulti
                      components={{ ...animatedComponents, Option }}
                      value={tryselectedElements}
                      onChange={(selectedOptions) => settrySelectedElements(selectedOptions)}
                      styles={customStyles}
                      placeholder="Select Project"
                      hideSelectedOptions={false}
                      closeMenuOnSelect={false}
                      className="text-xs"
                    />
            </div>
             <div className="w-[14%] ">
                <label htmlFor="Configuration" className="text-sm">Configurations</label>
                <Select
                       options={dropdownData?.configuration.map(config => ({
                        value: config.id,
                        label: config.name  
                      }))}
                      isMulti
                      components={{ ...animatedComponents, Option }}
                      value={selectedConfigurations}
                      onChange={(selectedOptions) => setSelectedConfigurations(selectedOptions)}
                      styles={customStyles}
                      placeholder="Select Config"
                      hideSelectedOptions={false}
                      closeMenuOnSelect={false}
                      className="text-xs"
                    />
            </div>
            <div className="w-[14%] ">
                <label htmlFor="Booking Status" className="text-sm">Booking Status</label>
                <Select
                       options={bookingstatusArray}
                      components={{ ...animatedComponents, Option }}
                      value={bookingStatus}
                      onChange={(selectedOptions) => setBookingStatus(selectedOptions)}
                      styles={customStyles}
                      placeholder="Select Status"
                      hideSelectedOptions={false}
                      closeMenuOnSelect={false}
                      isClearable={true}
                      className="text-xs"
                    />
            </div>
            <div className="w-[14%] ">
                <label htmlFor="OB Status" className="text-sm">OB Status</label>
                <Select
                    options={dropdownData?.ob_table.map(ob => ({
                        value: ob.id,
                        label: ob.name  
                      }))}
                      components={{ ...animatedComponents, Option }}
                      value={obType}
                      onChange={(selectedOptions) => setObtype(selectedOptions)}
                      styles={customStyles}
                      placeholder="Select"
                      hideSelectedOptions={false}
                      closeMenuOnSelect={false}
                      isClearable={true}
                      className="text-xs"
                      isMulti
                    />
            </div>
            {obType && (
                 <div className="w-[14%] ">
                     <label htmlFor="OB Status Date" className="text-sm">Select OB Date</label>
                  <DateRangePicker value={obDate} setValue={setObDate} />
                  </div>
            )}
             <div className="w-[14%] ">
                <label htmlFor="Sourced_by" className="text-sm">Sourcing</label>
                <Select
                       options={dropdownData?.source_by_and_closed_by.map(source_by_and_closed_by => ({
                        value: source_by_and_closed_by.id,
                        label: source_by_and_closed_by.name  
                      }))}
                      isMulti
                      components={{ ...animatedComponents, Option }}
                      value={sourcedBy}
                      onChange={(selectedOptions) => setSourcedBy(selectedOptions)}
                      styles={customStyles}
                      placeholder="Select Sourced"
                      hideSelectedOptions={false}
                      closeMenuOnSelect={false}
                      className="text-xs"
                    />
            </div>
            <div className="w-[14%] ">
                <label htmlFor="Sourced_by" className="text-sm">Closing</label>
                <Select
                       options={dropdownData?.source_by_and_closed_by.map(source_by_and_closed_by => ({
                        value: source_by_and_closed_by.id,
                        label: source_by_and_closed_by.name  
                      }))}
                      isMulti
                      components={{ ...animatedComponents, Option }}
                      value={closedBy}
                      onChange={(selectedOptions) => setClosedBy(selectedOptions)}
                      styles={customStyles}
                      placeholder="Select Closing"
                      hideSelectedOptions={false}
                      closeMenuOnSelect={false}
                      className="text-xs"
                    />
            </div>
            <div className="w-[14%] ">
                <label htmlFor="Invoice_status" className="text-sm">Invoice Status</label>
                <Select
                     options={dropdownData?.invoice_post_raise_status.map(invoice_post_raise_status => ({
                        value: invoice_post_raise_status.id,
                        label: invoice_post_raise_status.name  
                      }))}
                      isMulti
                      components={{ ...animatedComponents, Option }}
                      value={invoiceType}
                      onChange={(selectedOptions) => setInvoiceType(selectedOptions)}
                      styles={customStyles}
                      placeholder="Select INV Type"
                      hideSelectedOptions={false}
                      closeMenuOnSelect={false}
                      className="text-xs"
                    />
            </div>
            

            </div>

        <div className=" flex justify-end pb-3 gap-3 mr-3">
          <img
            onClick={handleFilter}
            className="cursor-pointer"
            src={IMAGES.SearchIcon}
            alt="search icon "
          />
          <img
            onClick={() => { 
              handleClearAll();
              }}
            className="cursor-pointer"
            src={IMAGES.ClearAllIcon}
            alt="clear all icon"
          />
          <img
            className="cursor-pointer"
            onClick={() => setSaveFilterVisible((prev) => !prev)}
            src={IMAGES.SaveIcon}
            alt="save icon"
          />
        </div>

        </>
        


      )}

      {/* Saved Filters Div */}
        {filterOrSavedFilterVisible === "savedFilters" && (
          <div className="p-2 ">
            {savedFilters.length === 0 ? (
              <p className="text-[#919191] text-base font-normal">
                No Saved Filters
              </p>
            ) : (
              <div className="mt-2">
                {savedFilters.map(filter => (
                  <div key={filter.id}  className="flex items-center justify-between px-1 mt-4">
                    <span
                    className="cursor-pointer"
                    onClick={() =>
                      handleSaveFilterClick(
                        filter?.id,
                        filter?.filter
                      )
                    }
                    >{filter.name}</span>
                   <img
                      className="cursor-pointer"
                      onClick={(event) => deleteFilter(filter?.id, event)}
                      src={IMAGES.DeleteIcon}
                      alt="delete icon"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}


        <div className={`absolute w-52 h-fit left-[104%] bg-white top-[72%] rounded-md py-2 px-3 shadow-lg ${saveFilerVisible ? 'block' : 'hidden'}`}>
          <span className="text-sm font-medium text-[#9A55FF] underline decoration-[#9A55FF] decoration-solid decoration-2 underline-offset-[8px]">
            Save Filter
          </span>
          <div>
            <p className="text-[#696969] text-sm pt-3 pb-2">Filter Name</p>
            <input
              onChange={(e) => {
                setFilterName(e.target.value);
              }}
              value={filterName}
              placeholder="Name Here"
              type="text"
              className="border border-[#B4B4B4] rounded w-full h-8 placeholder:text-xs text-sm text-[#696969] outline-none placeholder:text-[#818181] pl-3"
            />
          </div>
          <button className="bg-[#9A55FF] text-white font-medium text-sm h-6  rounded px-4 mt-4 block mx-auto" onClick={saveFilter}>
            Save
          </button>
        </div>

    </div>
  );
};

export default FilterContainer;
