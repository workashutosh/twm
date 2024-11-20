import React, { useEffect, useState , useMemo, useContext } from "react";
import Header from "@components/common/Header";
import Sidebar from "@components/common/Sidebar";
import LoaderComponent from "@components/common/LoaderComponent.jsx";
import { useTable, usePagination, useSortBy } from 'react-table';
import apiInstance from "@api/apiInstance";
import { RefreshCcw, Filter, FilterX, Search, SearchX , CircleX , UserPen , BookCheck } from "lucide-react";
import Select, { components } from 'react-select';
import makeAnimated from 'react-select/animated';
import DateRangePicker from "@common/DateRangePicker";
import Assignlead from "@components/AssignLeads/Assignlead.jsx";
import { AppContext } from "@context/AppContext";
import { ChevronDown, ChevronUp, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';




const TagLead = () => {
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
    const [selectedRow, setSelectedRow] = useState(null);
    const [updateStatusType , setupdateStatusType] = useState(null);
    const [updateNextFollowupDate , setUpdateNextFollowupDate] = useState(null);
    const [updateRemark , setUpdateRemark] = useState(null);
    const [filterSelectedValues, setSelectedValues] = useState({
      language: [],
      state: [],
      option_type: [],
      amount_range: [],
      utc: [],
      start_date: null,
      end_date: null
    });
    const [leadIDFollowupData , setLeadIDFollowupData] = useState(null);


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

    useEffect(() => {
        const fetchData = async (filterToApply = null) => {
            setLoaderActive(true);
            const user_id = activeUserData?.user_id?.replace('LNUSR', '');
            try {
              const response = await apiInstance(`/assign_lead.php?user_id=${user_id}`, 'GET');
              setTotalData(response.data?.data);
              setFilteredData(response.data);
            } catch (error) {
              console.error('Error fetching data:', error);
            } finally {
              setLoaderActive(false);
            }
        };
        fetchData();
    }, [activeUserData]);

    useEffect(() => {
        const fetchData = async (filterToApply = null) => {
            setLoaderActive(true);
            const lead_id = selectedRow?.lead_id
            try {
              const response = await apiInstance(`/updateLead.php?lead_id=${lead_id}`, 'GET');
              setLeadIDFollowupData(response.data);
            } catch (error) {
              console.error('Error fetching data:', error);
            } finally {
              setLoaderActive(false);
            }
        };
        fetchData();
    }, [selectedRow]);

    console.log(leadIDFollowupData?.data);

    useEffect(() => {
        fetchDropdownData();
    }, [])
    
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

    const handleSearchClick = () => {
        setActiveFilter(renderedFilter);
        fetchData(renderedFilter);
    };

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

    const handleChange = (selectedOption, field) => {
        setSelectedValues({
          ...filterSelectedValues,
          [field]: selectedOption,
        });
    };  

   const columns = React.useMemo(
      () => [
        {
          Header: 'Lead ID',
          accessor: 'lead_id',
        },
        {
          Header: 'Name',
          accessor: 'name',
        },
        {
          Header: 'Phone',
          accessor: 'phone',
        },
        {
          Header: 'Email',
          accessor: 'email',
        },
        {
          Header: 'State',
          accessor: 'state',
        },
        {
          Header: 'Language',
          accessor: 'language_chosen',
        },
        {
          Header: 'Option Type',
          accessor: 'option_Type',
        },
        {
          Header: 'Amount Range',
          accessor: 'amount_Range',
        },
        {
          Header: 'Assigned By',
          accessor: 'assigned_by_name',
        },
        {
          Header: 'Assigned At',
          accessor: 'assigned_at',
        },
        {
          Header: 'Submission Date',
          accessor: 'Submission_Date',
        }
      ],
      []
    );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  const handleUpdate = async () => {
    const user_id = activeUserData?.user_id?.replace('LNUSR', '');
    
    const requestBody = {
      status: updateStatusType,
      next_followup_date: updateNextFollowupDate,
      remark: updateRemark,
      user_id: user_id,
      lead_id: selectedRow?.lead_id
    };
    const response = await apiInstance('/updateLead.php', 'POST', requestBody);
    if(response.status === 200){
      setSwitchState('all');
      setSelectedRow(null);
      setUpdateNextFollowupDate(null);
      setUpdateRemark(null);
      setupdateStatusType(null);
      alert('Lead Updated Successfully');
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
          <div className="w-full border p-1  bg-white shadow-sm rounded-md flex justify-between">
          <div className="flex items-center  gap-2">
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

          {/* the filter div  */}
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
          </div>

         {/* The table div  */}
         {switchState === 'all' && (
          <div className="w-full border p-1 mt-1 bg-white shadow-sm rounded-md flex justify-between">
                <div className="w-full">
                      <div className="overflow-x-auto">
                        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            {headerGroups.map(headerGroup => (
                              <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                  <th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                  >
                                    <div className="flex items-center space-x-1">
                                      <span>{column.render('Header')}</span>
                                      <span>
                                        {column.isSorted
                                          ? column.isSortedDesc
                                            ? <ChevronDown className="w-4 h-4" />
                                            : <ChevronUp className="w-4 h-4" />
                                          : ''}
                                      </span>
                                    </div>
                                  </th>
                                ))}
                              </tr>
                            ))}
                          </thead>
                          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                          {page.map(row => {
                            prepareRow(row);
                            return (
                              <tr 
                                {...row.getRowProps()} 
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => { setSelectedRow(row.original); setSwitchState('update'); }} 
                              >
                                {row.cells.map(cell => (
                                  <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {cell.render('Cell')}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                        </table>
                      </div>
                        
                      <div className="py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => gotoPage(0)}
                            disabled={!canPreviousPage}
                            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                          >
                            <ChevronsLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => previousPage()}
                            disabled={!canPreviousPage}
                            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <span className="text-sm text-gray-700">
                            Page{' '}
                            <strong>
                              {pageIndex + 1} of {pageOptions.length}
                            </strong>
                          </span>
                          <button
                            onClick={() => nextPage()}
                            disabled={!canNextPage}
                            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => gotoPage(pageCount - 1)}
                            disabled={!canNextPage}
                            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                          >
                            <ChevronsRight className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <select
                          value={pageSize}
                          onChange={e => setPageSize(Number(e.target.value))}
                          className="text-sm border-gray-300 rounded-md"
                        >
                          {[10, 20, 30, 40, 50].map(size => (
                            <option key={size} value={size}>
                              Show {size}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
          </div>
         )}

          {/* The Update Div  */}
          {switchState === 'update' && (
          <div>
            <div className="w-full border p-1 mt-1 bg-white shadow-sm rounded-md flex justify-between px-2">
                <h4 className="text-md font-semibold text-[#0052CC]">Update Lead</h4>
                <CircleX size={24} className="cursor-pointer" onClick={() => { setSelectedRow(null); setSwitchState('all'); }}/>
            </div>
            <div className="w-full flex gap-3 mt-2 select-none">
                {/* Lead Details  */}
                <div className="w-[22%] rounded border border-gray-300 shadow-md p-2">
                    <h4 className="text-[16px] text-center text-[#0052CC] font-semibold">Lead Details</h4>
                    <hr />
                    <div className="flex flex-col p-4 gap-2">
                        {Object.entries(selectedRow).map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <strong className="text-[#0052CC]">{key}:</strong> <span className="font-semibold">{value}</span>
                          </div>
                        ))}
                    </div>
                </div>


                {/* Lead Update  */}
                <div className="w-[78%] text-[#0052CC] rounded border border-gray-300 shadow-md p-2">
                    <h4 className="text-md font-semibold">Lead Update</h4>
                    <hr />
                    <div className="flex flex-row mt-3 gap-4">
                        <select
                          value={selectedRow.status}
                          onChange={(e) => {
                            setupdateStatusType(e.target.value);
                          }}
                          className="text-[17px] shadow-md p-2 border-gray-300 rounded-md"
                        >
                          <option value="">Select Status</option>
                          {dropdownData?.status_type.map(status => (
                            <option key={status.id} value={status.id}>{status.name}</option>
                          ))}
                        </select>

                        {(updateStatusType === '24' || updateStatusType === '16') && (
                            <>
                          <label className="text-[15px] mt-2 font-semibold">Next Followup Date : </label>
                          <input
                            type="date"
                            value={selectedRow.next_followup_date}
                            onChange={(e) => setUpdateNextFollowupDate(e.target.value)}
                            className="text-[15px] border-gray-500 shadow-md p-1 rounded-md"
                          />
                            </>
 
                        )}

                    </div>
                    <textarea
                          value={selectedRow.remark}
                          onChange={(e) => setUpdateRemark(e.target.value)}
                          placeholder="Add a remark..."
                          className="text-md p-2 mt-3 border-gray-300 shadow-md rounded-md w-full"
                        />

                {/* Lead history  */}
                <div className="mt-2 rounded border border-gray-300 shadow-md p-2">
                    <h4 className="text-[16px] text-center text-[#0052CC] font-semibold">Lead History</h4>
                    <hr />

                    {leadIDFollowupData?.data && (
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th>Added By</th>
                            <th>Date</th>
                            <th>ID</th>
                            <th>Lead ID</th>
                            <th>Next Followup Date</th>
                            <th>Remark</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leadIDFollowupData?.data.map((item) => (
                            <tr key={item.id} className="text-sm text-center">
                              <td>{item.user_full_name}</td>
                              <td>{item.date}</td>
                              <td>{item.id}</td>
                              <td>{item.lead_id}</td>
                              <td>{item.next_followup_date}</td>
                              <td>{item.remark}</td>
                              <td>{item.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                </div>
                <div className="flex justify-end mt-2">
                    <button className="bg-[#0052CC] font-semibold text-white p-1 rounded-md flex gap-2 cursor-pointer text-md"
                    onClick={handleUpdate}
                    >
                        Update
                        <BookCheck size={22} />
                    </button>
                </div>
                </div>  


            </div>
          </div>
         )}

          </section>
        </main>
        </>
      );
};

export default TagLead;
