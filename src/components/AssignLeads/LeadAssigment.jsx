import React, { useEffect, useState , useMemo, useContext } from "react";
import Header from "@components/common/Header";
import Sidebar from "@components/common/Sidebar";
import LoaderComponent from "@components/common/LoaderComponent.jsx";
import { useTable, usePagination, useSortBy } from 'react-table';
import apiInstance from "@api/apiInstance";
import { RefreshCcw, Filter, FilterX, Search, SearchX , CircleX , UserPen  } from "lucide-react";
import Select, { components } from 'react-select';
import makeAnimated from 'react-select/animated';
import DateRangePicker from "@common/DateRangePicker";
import Assignlead from "@components/AssignLeads/Assignlead.jsx";
import { AppContext } from "@context/AppContext";



const LeadAssign = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [switchState, setSwitchState] = useState("all");
  const [loaderActive, setLoaderActive] = useState(false);
  const [data, setTotalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [dropdownData, setDropdownData] = useState(null);
  const [daterange, setDaterange] = useState([]);
  const [renderedFilter, setRenderedFilter] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null); 
  const [checkedLeads , setCheckedLeads] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usersData , setUsersData] = useState(null);
  const [remark , setRemark] = useState(null);
  const [assignTo , setAssignTo] = useState(null);
  const { activeUserData } = useContext(AppContext);
  const [filterSelectedValues, setSelectedValues] = useState({
    language: [],
    state: [],
    option_type: [],
    amount_range: [],
    utc: [],
    start_date: null,
    end_date: null
  });
  const animatedComponents = makeAnimated();

  const customStyles = {
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#0052CC',
      fontSize: '10px',
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: '10px',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      cursor: 'pointer',
    }),
    control: (provided) => ({
      ...provided,
      display: 'flex',
      flexWrap: 'nowrap',
      minHeight: '33px',
      height: '33px',
      width: '200px',
    }),
    valueContainer: (provided) => ({
      ...provided,
      display: 'flex',
      flexWrap: 'nowrap',
      overflowX: 'auto',
      minHeight: '35px',
      height: '35px',
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

  const handleChange = (selectedOption, field) => {
    setSelectedValues({
      ...filterSelectedValues,
      [field]: selectedOption,
    });
  };

  const fetchData = async (filterToApply = null) => {
    setLoaderActive(true);
    try {
      const response = await apiInstance('/total_data.php', 'POST', filterToApply);
      setTotalData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoaderActive(false);
    }
  };

  const fetchDropdownData = async () => {
    setLoaderActive(true);
    try {
      const response = await apiInstance('/dropdowndata.php', 'POST');
      setDropdownData(response.data);
      setUsersData(response.data.users)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoaderActive(false);
    }
  };

  // Initial fetch without filters
  useEffect(() => {
    fetchData();
    fetchDropdownData();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = data.filter((item) =>
      Object.values(item).some((field) =>
        field?.toString().toLowerCase().includes(value)
      )
    );

    setFilteredData(filtered);
  };

  const handleReload = async () => {
    setLoaderActive(true);
    try {
      await apiInstance('/cron_job.php', 'POST');
      await fetchData(activeFilter);  // Use the active filter when reloading
    } catch (error) {
      console.error('Error reloading data:', error);
    } finally {
      setLoaderActive(false);
    }
  };

  // Update renderedFilter when filterSelectedValues or daterange changes
  useEffect(() => {
    const newRenderedFilter = {};

    if (daterange.startDate && daterange.endDate) {
      setSelectedValues(prev => ({
        ...prev,
        start_date: daterange.startDate,
        end_date: daterange.endDate,
      }));
    }

    Object.keys(filterSelectedValues).forEach(key => {
      const values = filterSelectedValues[key];

      if (Array.isArray(values) && values.length > 0) {
        const formattedValues = values.map(item => item.value || item).join("','");
        newRenderedFilter[key] = `('${formattedValues}')`;
      }
      else if (key === 'start_date' && values) {
        newRenderedFilter[key] = `'${values}'`;
      }
      else if (key === 'end_date' && values) {
        newRenderedFilter[key] = `'${values}'`;
      }
    });

    setRenderedFilter(newRenderedFilter);
  }, [filterSelectedValues, daterange]);

  const handleResetFilters = () => {
    setSelectedValues({
      language: [],
      state: [],
      option_type: [],
      amount_range: [],
      utc: [],
      start_date: null,
      end_date: null
    });
    setDaterange([]);
    setActiveFilter(null);
    fetchData(null);  // Fetch data without filters
  };

  // New function to handle search button click
  const handleSearchClick = () => {
    setActiveFilter(renderedFilter);
    fetchData(renderedFilter);
  };
  
  // Table columns configuration
  const columns = useMemo(
    () => [
      {
        Header: ({ data = [] }) => (
          <input
            type="checkbox"
            className="h-4 w-4 ml-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={data.length > 0 && checkedLeads.length === data.length}
            onChange={(e) => {
              if (e.target.checked) {
                // Check all rows
                const allLeads = data.map(row => ({
                  ID: row.ID,
                  form_id: row.form_id
                }));
                setCheckedLeads(allLeads);
              } else {
                // Uncheck all rows
                setCheckedLeads([]);
              }
            }}
          />
        ),
        id: 'selection',
        Cell: ({ row }) => (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={checkedLeads.some(lead => 
              lead.ID === row.original.ID && lead.form_id === row.original.form_id
            )}
            onChange={(e) => {
              if (e.target.checked) {
                setCheckedLeads([...checkedLeads, {
                  ID: row.original.ID,
                  form_id: row.original.form_id
                }]);
              } else {
                setCheckedLeads(checkedLeads.filter(lead => 
                  !(lead.ID === row.original.ID && lead.form_id === row.original.form_id)
                ));
              }
            }}
          />
        )
      },
      { Header: 'ID', accessor: 'ID' },
      { Header: 'Form ID', accessor: 'form_id' },
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value }) => (
          <div className="whitespace-normal break-words max-w-[100px]">
            {value}
          </div>
        ),
      },
      {
        Header: 'Phone',
        accessor: 'phone',
        Cell: ({ value }) => value.replace(/\s/g, '').slice(3),
      },
      { Header: 'Email', accessor: 'email' },
      { Header: 'State', accessor: 'state' },
      { Header: 'IP', accessor: 'ip' },
      { Header: 'Language', accessor: 'language_chosen' },
      { Header: 'Option Type', accessor: 'option_Type' },
      { Header: 'Amount Range', accessor: 'amount_Range' },
      { Header: 'Submission Date', accessor: 'Submission_Date' },
      { Header: 'UTC', accessor: 'utc' },
    ],
    [checkedLeads]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageSize: 20 },
    },
    useSortBy,
    usePagination
  );

  const handleAssignLeads = async () => {

      if(checkedLeads.length > 0 && assignTo && remark) {
        const requestBody = {
          leads: checkedLeads.map(lead => lead.ID).join(','),
          assign_to: assignTo,  
          assigned_by: activeUserData?.user_id.split('')[5],
          remark: remark
        };

        const response = await apiInstance('/assign_lead.php', 'POST', requestBody);
        if(response.status === 200) {
          setCheckedLeads([]);
          setRemark(null);
          setAssignTo(null);
          setIsModalOpen(false);
        }
      }   
  }

  return (
    <>
      <Header />
      {loaderActive && <LoaderComponent />}
      <main className="flex">
        <Sidebar
          isSidebarVisible={isSidebarVisible}
          setIsSidebarVisible={setIsSidebarVisible}
        />
        <section className="flex-1 my-4 ml-4 mr-7">
          <div className="w-full border p-1 bg-white shadow-sm rounded-md flex justify-between">

            {/* Switch tabs  */}
            <div className="flex text-xs gap-2 bg-gray-200 p-1 rounded pl-1">
              <span
                className={`${switchState === "all" ? "bg-[#0052CC] text-white" : ""} p-1 rounded-md cursor-pointer`}
                onClick={() => setSwitchState("all")}
              >
                All Leads
              </span>
              <span
                className={`${switchState === "assign" ? "bg-[#0052CC] text-white" : ""} p-1 rounded-md cursor-pointer`}
                onClick={() => setSwitchState("assign")}
              >
                
                Assigned Leads
              </span>
              <span
                className={`${switchState === "rotation" ? "bg-[#0052CC] text-white" : ""} p-1 rounded-md cursor-pointer`}
                onClick={() => setSwitchState("rotation")}
              >
                Rotated Leads
              </span>
            </div>

            {/* filter or assign button  */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search..."
                className="border rounded-md px-2 w-[200px] py-1 text-xs"
              />
             {checkedLeads && checkedLeads?.length > 0 && (
                <>
                <button
                className="bg-[#0052CC] text-white p-1 rounded-md flex gap-2 cursor-pointer text-xs"
                onClick={() => setIsModalOpen(true)} 
                 >
                 Assign Leads
                  <UserPen size={18} />
               </button>
                </>
              )}
              <button 
                className="bg-[#0052CC] text-white p-1 rounded-md flex gap-2 cursor-pointer text-xs"
                onClick={() => setFilterVisible(!filterVisible)}
              >
                Filter
                {filterVisible ? <FilterX size={16} /> : <Filter size={16} />}
              </button>
              <button
                className="bg-[#0052CC] text-white p-1 rounded-md flex gap-2 cursor-pointer text-xs"
                onClick={handleReload}
              >
                Reload
                <RefreshCcw size={16} />
              </button>
            </div>

          </div>

          <div>
            {filterVisible && (
              <div className="w-full justify-between flex gap-2 rounded-md p-1 mt-1 bg-white shadow-md">
                <div className="flex gap-2">
                  <DateRangePicker value={daterange} setValue={setDaterange} />
                  {['language', 'state', 'option_type', 'amount_range', 'utc'].map((field) => (
                    <div key={field} className="mb-1">
                      <Select
                        options={dropdownData && dropdownData[field]?.map((item) => ({
                          label: item,
                          value: item,
                        }))}
                        isMulti
                        closeMenuOnSelect={false}
                        components={{ AnimatedMulti: animatedComponents, Option }}
                        styles={customStyles}
                        value={filterSelectedValues[field]}
                        onChange={(selectedOption) => handleChange(selectedOption, field)}
                        placeholder={`Select ${field.replace('_', ' ')}`}
                        className="text-xs"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-1 h-[25px] mt-1">
                  <button 
                    className="bg-[#0052CC] text-white p-1 rounded-md flex gap-2 cursor-pointer text-xs"
                    onClick={handleSearchClick}  
                  >
                    <Search size={16} />
                    Search
                  </button>
                  <button 
                    className="bg-[#0052CC] text-white p-1 rounded-md flex gap-2 cursor-pointer text-xs"
                    onClick={handleResetFilters}
                  >
                    <SearchX size={16} />
                    Reset
                  </button>
                </div>
              </div>
            )}

            {switchState === "all" && (
                <div className="w-full border p-1 bg-white shadow-sm rounded-md mt-1">
                  <table {...getTableProps()} className="min-w-full bg-white">
                    <thead>
                      {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map((column) => (
                            <th
                              {...column.getHeaderProps(column.getSortByToggleProps())}
                              className="py-2 px-2 border-b-2 border divide-x-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600"
                            >
                              {column.render('Header')}
                              <span>
                                {column.isSorted
                                  ? column.isSortedDesc
                                    ? ' 🔽'
                                    : ' 🔼'
                                  : ''}
                              </span>
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                      {page.map((row) => {
                        prepareRow(row);
                        return (
                          <tr {...row.getRowProps()} className="text-gray-700">
                            {row.cells.map((cell) => (
                              <td
                                {...cell.getCellProps()}
                                className="py-2 px-4 border divide-x-2 border-gray-200 text-xs"
                              >
                                {cell.render('Cell')}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div className="flex justify-between mt-2">
                    <button
                      onClick={() => previousPage()}
                      disabled={!canPreviousPage}
                      className="bg-gray-300 px-4 py-2 text-xs rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm font-semibold">Page {pageIndex + 1} Total {data?.length}</span>
                    <button
                      onClick={() => nextPage()}
                      disabled={!canNextPage}
                      className="bg-gray-300 px-4 py-2 rounded text-xs disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
            )}

             {switchState === "assign" && (
                <Assignlead />
            )} 
          </div>

        </section>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 flex w-full z-50 items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-2 rounded-md shadow-md w-[900px]">
              <div className="bg-white flex justify-end">
                  <CircleX size={23} onClick={() => setIsModalOpen(false)} className="cursor-pointer"  />
              </div>

              {/* Assign div  */}
              <div className="w-full flex gap-2 p-2 select-none">


            {/* Selected Leads div  */}
            <div className=" border border-gray-300 w-full rounded-md p-1">
              <p className="text-center font-semibold">Selected Leads</p>
              <hr />
              <p className="flex gap-2 font-semibold text-wrap">
                  {checkedLeads.map((lead, index) => (
                    <p key={index}>ID: {lead.ID}</p>
                  ))} 
              </p>
            </div>

            {/* Assign to div  */}
            <div className=" border border-gray-300 w-full rounded-md p-1">
            <p className="text-center font-semibold">Assign To</p>
            <hr />
            <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setAssignTo(e.target.value)}>
              <option value="">Select User</option>
              {usersData?.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.user_full_name}
                </option>
              ))}
            </select>
            <div>

            </div>
            </div>




              </div>
              {/* Remark Adding Section */}
              <div className="w-full flex gap-2 p-2 select-none">
                <div className=" border border-gray-300 w-full rounded-md p-1">
                  <p className="text-center font-semibold">Add Remark</p>
                  <hr />
                  <textarea className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setRemark(e.target.value)}></textarea>
                </div>
              </div>

              <div className="flex justify-center mt-3">
                <button className="bg-[#0052CC] text-white p-2 rounded-md flex gap-2 cursor-pointer text-xs"
                  onClick={handleAssignLeads}
                >
                  Assign Leads
                </button>
              </div>

          </div>



         
          </div>
      )}
    </>
  );
};

export default LeadAssign;