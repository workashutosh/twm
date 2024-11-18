import { useEffect, useRef, useState , useContext } from "react";
import Multiselect from 'multiselect-react-dropdown';
import axios from "axios";
import IMAGES from "@images";
import CustomMultiSelect from "@financepage/CustomMultiSelect";
import CustomSingleSelect  from "@financepage/CustomSingleSelect";
import DateRangePicker from "@common/DateRangePicker";
import CustomSlider from "@common/CustomSlider";
import { useFilterContext } from '@context/FilterContext';
import useStore from '@store/index.jsx';
import { AppContext } from "@context/AppContext";
import apiInstance from "@api/apiInstance";


const FilterContainer = ({ displayProperty  }) => {
  // filter name state in the save filter input textbox
  const [filterName, setFilterName] = useState("");
  const { updateFilterData } = useFilterContext();
  const [activeElementIds, setActiveElementIds] = useState([]);
  const { activeUserData } = useContext(AppContext);


 // console.log(sortByRefData);
 
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
      user_active: bookingStatus,
      project_ids: tryselectedElements.map(element => parseInt(element.value, 10)).join(', '),
      developer_ids: selectedDeveloper.map(element => parseInt(element.value, 10)).join(', '),
      invoice_post_raise_status: invoiceType.map(element => parseInt(element.value, 10)).join(', '),
      sourced_by: sourcedBy.map(element => parseInt(element.value, 10)).join(', '),
      closed_by: closedBy.map(element => parseInt(element.value, 10)).join(', '),
      ...(activeElementIds != null && activeElementIds !== "" && {
        configurations: activeElementIds.join(","),
      }),        
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
      ...(obType !== null && obDate == null && {
        ba_status: obType,
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
  


/*   useEffect(() => {
    if (localStorage?.getItem("Homefilters")) {
      const filters = JSON.parse(localStorage.getItem("Homefilters"));
      setSavedFilters(filters);
    }
  }, []); */


    let  requestBody = {
    name_number: name,
    user_active: bookingStatus,
    project_ids: tryselectedElements.map(element => parseInt(element.value, 10)).join(', '),
    developer_ids: selectedDeveloper.map(element => parseInt(element.value, 10)).join(', '),
    invoice_post_raise_status: invoiceType.map(element => parseInt(element.value, 10)).join(', '),
    sourced_by: sourcedBy.map(element => parseInt(element.value, 10)).join(', '),
    closed_by: closedBy.map(element => parseInt(element.value, 10)).join(', '),
    ...(activeElementIds != null && activeElementIds !== "" && {
      configurations: activeElementIds.join(","),
    }),        
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
    ...(obType !== null && obDate == null && {
      ba_status: obType,
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

    const bookingstatusArray = [
      { id: 'Y', name: 'Active' },
      { id: 'N', name: 'Cancelled' }
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
      setClosureDate(null);
      setObDate(null);
      setObtype(null);
      setInvoiceType([]);
      setFollowUpDate(null);
      settrySelectedElements([]);
      setSelectedDeveloper([]);
      setSortType('');
      setRaiseDate(null);
      setSubmittedDate(null);
      setReceivedDate(null);
      setExpectedDate(null);
      setBookingStatus(null);
      requestBody = {}
      updateFilterData(requestBody);
      
    }
    const handleSaveFilterClick = (id , filterArray) => {
     // console.log(id, filterArray);
      updateFilterData(filterArray);
    }

    useEffect(() => {
      // Function to close the dropdown when clicking outside
      const handleClickOutside = (event) => {
        if (
          filterContainerRef.current &&
          !filterContainerRef.current.contains(event.target)
        ) {
          filterContainerRef.current.style.display = "none";
        }
      };
  
      if (displayProperty === "block" && filterContainerRef.current) {
        document.addEventListener("click", handleClickOutside);
      }
  
      // Cleanup function to remove event listener when component unmounts
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, [displayProperty]);


    const deleteFilter = (id, event) => {
      event.stopPropagation();
      const filters = savedFilters.filter((item) => item.id !== id);
      localStorage.setItem("Homefilters", JSON.stringify(filters));
      setSavedFilters(filters);
    };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    apiInstance('client/bookingdd.php', 'GET')
      .then((res) => {
        setDropdownData(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  



  return (
    <div
    ref={filterContainerRef}
    style={{ display: displayProperty }}
    className="absolute w-[250px] pr-1 top-9 z-20 bg-white rounded drop-shadow-2xl border border-[#E1E1E1]"
    >
      {/* Heading Filters OR Saved Fitlers*/}
      <div className="sticky top-0 flex pt-4 bg-white justify-evenly">
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
        <div
          id="filter-container"
          className="pl-4 pr-4 h-[440px]  overflow-auto pt-1 filterContainer"
        >
          <div className="border-b border-b-[#F7F7F7] py-2 pb-8">
            {/* Name  */}
            <div
              onClick={() =>
                setselectedFilter((prev) => (prev === "name" ? "" : "name"))
              }
              className="flex mt-1  justify-between cursor-pointer"
            >
              <p
                className={` ${
                  selectedFilter === "name"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B] "
                }  text-base text-[15px]  select-none cursor-pointer`}
              >
                Name
              </p>
              {selectedFilter === "name" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-3 "
                />
              )}
            </div>
            {selectedFilter === "name" && (
              <div className="pt-2 pb-1">
                <input
                 value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  placeholder={"Enter Here"}
                  type="text"
                  className="border  border-[#E0E0E0] outline-none rounded h-8 pl-2 placeholder:text-[#9D9D9D] placeholder:text-xs text-[#6F6B6B] text-sm w-[94%] font-normal"
                />
              </div>
            )}

            {/* Developer */}

            <div
              onClick={() =>
                setselectedFilter((prev) =>
                  prev === "developer" ? "" : "developer"
                )
              }
              className="flex mt-3 justify-between cursor-pointer"
            >
              <p
                className={` ${
                  selectedFilter === "developer"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B] "
                }  text-base text-[15px]  select-none cursor-pointer`}
              >
                Developer
              </p>
              {selectedFilter === "developer" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-3 "
                />
              )}
            </div>
            {selectedFilter === "developer" && (
              <div className="pt-2 pb-1">
              <Multiselect
                options={devProjectData?.developer.map(developer => ({
                  value: developer.id,
                  name: developer.name  
                }))}
                showCheckbox
                selectedValues={selectedDeveloper}
                onSelect={(selectedList) => setSelectedDeveloper(selectedList)}
                onRemove={(selectedList) => setSelectedDeveloper(selectedList)}
                displayValue="name"  
                placeholder="Select Developer"
                style={{
                  chips: {
                    background: '#bb86fc',
                    fontSize: '12px'
                  },
                  multiselectContainer: {
                    color: 'black',
                  },
                  searchBox: {
                    border: 'none',
                    'border-bottom': '1px solid blue',
                  },
                  option: {
                    height: '35px',
                    fontSize: '12px'
                  }
                  
                  
                }}
              />
              </div>
            )}

            {/* Project */}
            <div
              onClick={() =>
                setselectedFilter((prev) =>
                  prev === "project" ? "" : "project"
                )
              }
              className="flex mt-3 justify-between cursor-pointer"
            >
              <p
                className={` ${
                  selectedFilter === "project"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B] "
                }  text-base text-[15px]  select-none cursor-pointer`}
              >
                Project
              </p>
              {selectedFilter === "project" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-3 "
                />
              )}
            </div>
            {selectedFilter === "project" && (
              <div className="pt-2 pb-1">
              <Multiselect
                options={devProjectData?.project.map(project => ({
                  value: project.project_id,
                  name: project.project_name  
                }))}
                showCheckbox
                selectedValues={tryselectedElements}
                onSelect={selectedList => settrySelectedElements(selectedList)}
                onRemove={selectedList => settrySelectedElements(selectedList)}
                displayValue="name"  
                placeholder="Select Project"
                style={{
                  chips: {
                    background: '#bb86fc',
                    fontSize: '12px'
                  },
                  multiselectContainer: {
                    color: 'black',
                  },
                  searchBox: {
                    border: 'none',
                    'border-bottom': '1px solid blue',
                  },
                  option: {
                    height: '35px',
                    fontSize: '12px'
                  }
                  
                  
                }}
              />
              </div>
            )}

            {/* Configuration */}
            <div
              onClick={() =>
                setselectedFilter((prev) =>
                  prev === "configuration" ? "" : "configuration"
                )
              }
              className="mt-3 flex justify-between cursor-pointer"
            >
              <p
                className={` ${
                  selectedFilter === "configuration"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B] "
                }  text-base text-[15px]  select-none cursor-pointer`}
              >
                Configuration
              </p>
              {selectedFilter === "configuration" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-3 "
                />
              )}
            </div>
            {selectedFilter === "configuration" && (
              <div className="pt-2 pb-1">
                <div className="flex flex-wrap gap-2 mt-4">
                  {dropdownData?.configuration.map((value, id) => (
                    <div
                      key={value.id}
                      onClick={() => {
                        handleElementClick(value.id);
                      }}
                      className={`text-xs text-[#6F6B6B]   ${
                        activeElementIds.includes(value.id)
                          ? "bg-[#F8EFFF]"
                          : "bg-white"
                      } cursor-pointer rounded  border border-[#E0E0E0] px-2 py-[5px] font-medium shadow-sm`}
                    >
                      {value.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

             {/* Booking Status */}

             <div
              onClick={() =>
                setselectedFilter((prev) =>
                  prev === "booking_status" ? "" : "booking_status"
                )
              }
              className="mt-3 flex justify-between cursor-pointer"
            >
              <p
                className={` ${
                  selectedFilter === "booking_status"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B] "
                }  text-base text-[15px]  select-none cursor-pointer`}
              >
                Booking Status
              </p>
              {selectedFilter === "booking_status" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-3 "
                />
              )}
            </div>
            {selectedFilter === "booking_status" && (
              <div className="pt-2 pb-1 ">
              <CustomSingleSelect setValue={setBookingStatus} options={bookingstatusArray} />
            </div>
            )}
            


            {/*   OB Status */}
            <div
              onClick={() =>
                setselectedFilter((prev) =>
                  prev === "ob_status" ? "" : "ob_status"
                )
              }
              className="mt-3 flex justify-between cursor-pointer"
            >
              <p
                className={` ${
                  selectedFilter === "ob_status"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B] "
                }  text-base text-[15px]  select-none cursor-pointer`}
              >
                OB Status
              </p>
              {selectedFilter === "ob_status" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-3 "
                />
              )}
            </div>
            {selectedFilter === "ob_status" && (
              <div className="pt-2 pb-1 ">
              <CustomSingleSelect setValue={setObtype} options={dropdownData?.ob_table} />
            </div>
            )}
            <div>
            {obType && (
                <div className="custom-daterange pt-2 pb-1">
                  <DateRangePicker value={obDate} setValue={setObDate} />
                </div>
              )}
            </div>


            

            {/* Sourced By */}
            <div
              onClick={() =>
                setselectedFilter((prev) =>
                  prev === "sourced_by" ? "" : "sourced_by"
                )
              }
              className="mt-3 flex justify-between cursor-pointer"
            >
              <p
                className={` ${
                  selectedFilter === "sourced_by"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B] "
                }  text-base text-[15px]  select-none cursor-pointer`}
              >
                Sourced By
              </p>
              {selectedFilter === "sourced_by" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-3 "
                />
              )}
            </div>
            {selectedFilter === "sourced_by" && (
               <div className="pt-2 pb-1">
               <Multiselect
                 options={dropdownData?.source_by_and_closed_by.map(source_by_and_closed_by => ({
                   value: source_by_and_closed_by.id,
                   name: source_by_and_closed_by.name  
                 }))}
                 showCheckbox
                 selectedValues={sourcedBy}
                 onSelect={selectedList => setSourcedBy(selectedList)}
                 onRemove={selectedList => setSourcedBy(selectedList)}
                 displayValue="name"  
                 placeholder="Select Source By"
                 style={{
                  chips: {
                    background: '#bb86fc',
                    fontSize: '12px'
                  },
                  multiselectContainer: {
                    color: 'black',
                  },
                  searchBox: {
                    border: 'none',
                    'border-bottom': '1px solid blue',
                  },
                  option: {
                    height: '30px',
                    fontSize: '12px'
                  }
                }}
               />
               </div>
            )}

            {/* Invoice Status */}
            <div
              onClick={() =>
                setselectedFilter((prev) =>
                  prev === "invoice_status" ? "" : "invoice_status"
                )
              }
              className="mt-3 flex justify-between cursor-pointer"
            >
              <p
                className={` ${
                  selectedFilter === "invoice_status"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B] "
                }  text-base text-[15px]  select-none cursor-pointer`}
              >
                Invoice Status
              </p>
              {selectedFilter === "invoice_status" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-3 "
                />
              )}
            </div>
            {selectedFilter === "invoice_status" && (
               <div className="pt-2 pb-1">
               <Multiselect
                 options={dropdownData?.invoice_post_raise_status.map(invoice_post_raise_status => ({
                   value: invoice_post_raise_status.id,
                   name: invoice_post_raise_status.name  
                 }))}
                 showCheckbox
                 selectedValues={invoiceType}
                 onSelect={selectedList => setInvoiceType(selectedList)}
                 onRemove={selectedList => setInvoiceType(selectedList)}
                 displayValue="name"  
                 placeholder="Select Invoice Status"
                 style={{
                  chips: {
                    background: '#bb86fc',
                    fontSize: '12px'
                  },
                  multiselectContainer: {
                    color: 'black',
                  },
                  searchBox: {
                    border: 'none',
                    'border-bottom': '1px solid blue',
                  },
                  option: {
                    height: '30px',
                    fontSize: '12px'
                  }
                }}
               />
               </div>
            )}

            {/* Closed By */}
            <div
              onClick={() =>
                setselectedFilter((prev) =>
                  prev === "closed_by" ? "" : "closed_by"
                )
              }
              className="mt-3 flex justify-between cursor-pointer"
            >
              <p
                className={` ${
                  selectedFilter === "closed_by"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B] "
                }  text-base text-[15px]  select-none cursor-pointer`}
              >
                Closed By
              </p>
              {selectedFilter === "closed_by" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-3 "
                />
              )}
            </div>
            {selectedFilter === "closed_by" && (
               <div className="pt-2 pb-1">
               <Multiselect
                 options={dropdownData?.source_by_and_closed_by.map(source_by_and_closed_by => ({
                   value: source_by_and_closed_by.id,
                   name: source_by_and_closed_by.name  
                 }))}
                 showCheckbox
                 selectedValues={closedBy}
                 onSelect={selectedList => setClosedBy(selectedList)}
                 onRemove={selectedList => setClosedBy(selectedList)}
                 displayValue="name"  
                 placeholder="Select Closed By"
                 style={{
                  chips: {
                    background: '#bb86fc',
                    fontSize: '12px'
                  },
                  multiselectContainer: {
                    color: 'black',
                  },
                  searchBox: {
                    border: 'none',
                    'border-bottom': '1px solid blue',
                  },
                  option: {
                    height: '30px',
                    fontSize: '12px'
                  }
                }}
               />
               </div>
            )}


              {/* Agreement */}

              <div
              onClick={() =>
                setselectedFilter((prev) =>
                  prev === "agreement_value" ? "" : "agreement_value"
                )
              }
              className="mt-3 flex justify-between cursor-pointer"
            >
              <p
                className={` ${
                  selectedFilter === "agreement_value"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B] "
                }  text-base text-[15px]  select-none cursor-pointer`}
              >
                Agreement Value Range
              </p>
              {selectedFilter === "agreement_value" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-3 "
                />
              )}
            </div>
            {selectedFilter === "agreement_value" && (
              <div className="pt-2 pb-1">
                <CustomSlider name={"agreement_value"} onValuesChange={setSliderValues} />
              </div>
            )}


            

            {/* Closure Date */}
            <div
              onClick={() =>
                setselectedFilter((prev) =>
                  prev === "closure_date" ? "" : "closure_date"
                )
              }
              className="mt-3 flex justify-between cursor-pointer"
            >
              <p
                className={` ${
                  selectedFilter === "closure_date"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B] "
                }  text-base text-[15px]  select-none cursor-pointer`}
              >
                Closure Date
              </p>
              {selectedFilter === "closure_date" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-3 "
                />
              )}
            </div>
            {selectedFilter === "closure_date" && (
              <div className="custom-daterange pt-2 pb-1">
                <DateRangePicker
                  value={closureDate}
                  setValue={setClosureDate}
                />
              </div>
            )}

            {/* Follow Up Date */}
            <div
              onClick={() =>
                setselectedFilter((prev) =>
                  prev === "follow_up_date" ? "" : "follow_up_date"
                )
              }
              className="mt-3 flex justify-between cursor-pointer"
            >
              <p
                className={` ${
                  selectedFilter === "follow_up_date"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B] "
                }  text-base text-[15px]  select-none cursor-pointer`}
              >
                Follow Up Date
              </p>
              {selectedFilter === "follow_up_date" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-3 "
                />
              )}
            </div>
            {selectedFilter === "follow_up_date" && (
              <div className="custom-daterange pt-2 pb-3">
                <DateRangePicker
                  value={followUpDate}
                  setValue={setFollowUpDate}
                />
              </div>
            )}

            <div
              onClick={() =>
                setselectedFilter((prev) =>
                  prev === "raise_date" ? "" : "raise_date"
                )
              }
              className="mt-3 flex justify-between cursor-pointer"
            >
              <p
                className={` ${
                  selectedFilter === "raise_date"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B] "
                }  text-base text-[15px]  select-none cursor-pointer`}
              >
                INV Raise Date
              </p>
              {selectedFilter === "raise_date" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-3 "
                />
              )}
            </div>
            {selectedFilter === "raise_date" && (
              <div className="custom-daterange pt-2 pb-3">
                <DateRangePicker
                  value={raiseDate}
                  setValue={setRaiseDate}
                />
              </div>
            )}

            <div
              onClick={() =>
                setselectedFilter((prev) =>
                  prev === "submit_date" ? "" : "submit_date"
                )
              }
              className="mt-3 flex justify-between cursor-pointer"
            >
              <p
                className={` ${
                  selectedFilter === "submit_date"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B] "
                }  text-base text-[15px]  select-none cursor-pointer`}
              >
                INV Submit Date
              </p>
              {selectedFilter === "submit_date" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-3 "
                />
              )}
            </div>
            {selectedFilter === "submit_date" && (
              <div className="custom-daterange pt-2 pb-3">
                <DateRangePicker
                  value={submittedDate}
                  setValue={setSubmittedDate}
                />
              </div>
            )}

            <div
              onClick={() =>
                setselectedFilter((prev) =>
                  prev === "rcv_date" ? "" : "rcv_date"
                )
              }
              className="mt-3 flex justify-between cursor-pointer"
            >
              <p
                className={` ${
                  selectedFilter === "rcv_date"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B] "
                }  text-base text-[15px]  select-none cursor-pointer`}
              >
                INV Received Date
              </p>
              {selectedFilter === "rcv_date" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-3 "
                />
              )}
            </div>
            {selectedFilter === "rcv_date" && (
              <div className="custom-daterange pt-2 pb-3">
                <DateRangePicker
                  value={receivedDate}
                  setValue={setReceivedDate}
                />
              </div>
            )}

            <div
              onClick={() =>
                setselectedFilter((prev) =>
                  prev === "expect_date" ? "" : "expect_date"
                )
              }
              className="mt-3 flex justify-between cursor-pointer"
            >
              <p
                className={` ${
                  selectedFilter === "expect_date"
                    ? "text-[#9A55FF] font-medium"
                    : "text-[#6F6B6B] "
                }  text-base text-[15px]  select-none cursor-pointer`}
              >
                INV Expected Date
              </p>
              {selectedFilter === "expect_date" && (
                <img
                  src={IMAGES.ArrowIcon}
                  alt="arrow icon"
                  className="mr-3 "
                />
              )}
            </div>
            {selectedFilter === "expect_date" && (
              <div className="custom-daterange pt-2 pb-3">
                <DateRangePicker
                  value={expectedDate}
                  setValue={setExpectedDate}
                />
              </div>
            )}
          </div>

          {/* Icon's Container (search, clear all, save filters)*/}
          <div className="sticky bottom-0 flex items-center justify-end gap-3 py-1 bg-white ">
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
        </div>
      )}

    {  /* console.log(savedFilters.map(filter => filter.name)); */}
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
