import React, { useState , useEffect } from 'react'
import LoaderComponent from "@components/common/LoaderComponent.jsx";
import { useTable, usePagination, useSortBy } from 'react-table';
import apiInstance from "@api/apiInstance";
import { RefreshCcw, Filter, FilterX, Search, SearchX , CircleX , UserPen  } from "lucide-react";
import Select, { components } from 'react-select';
import makeAnimated from 'react-select/animated';
import Datepicker from 'react-tailwindcss-datepicker';
import DateRangePicker from "@common/DateRangePicker";


// sub component for lead assignment

const Assignlead = ({ switchState , filterVisible }) => {

    const [loaderActive, setLoaderActive] = useState(false);
    const [daterange, setDaterange] = useState({
        startDate: null,
        endDate: null,
      });
    const [usersData , setUsersData] = useState(null);
    const [data, setTotalAssignData] = useState([]);
    const [filteredData, setTotalAssignFilteredData] = useState([]);
    
      const handleDateChange = (newValue) => {
        setDaterange(newValue); 
      };

      const [filterSelectedValues, setSelectedValues] = useState({
        language: [],
        state: [],
        option_type: [],
        amount_range: [],
        utc: [],
        start_date: null,
        end_date: null
      });

    //   {
    //     "assign_id": "37",
    //     "lead_id": "135",
    //     "assigned_at": "2024-11-22 12:32:33",
    //     "assigned_to": "14",
    //     "assigned_by": "1",
    //     "assign_remark": "new lead for manik\n",
    //     "lead_type": null,
    //     "lead_status": null,
    //     "recent_followup_date": null,
    //     "next_followup_date": null,
    //     "ID": "135",
    //     "form_id": "67",
    //     "name": "hhgbhv",
    //     "phone": "+91 87653 48790",
    //     "email": "twmresearchalert9@gmail.com",
    //     "state": "Chhattisgarh",
    //     "language_chosen": "Hindi",
    //     "option_Type": "Future (Derivatives)",
    //     "amount_Range": "Above 3 Lac",
    //     "consent": "0",
    //     "ip": "49.128.160.29",
    //     "Submission_Date": "2024-11-15 23:49:49",
    //     "database_name": "twmromoy_twmralanding",
    //     "utc": "google",
    //     "assigned_by_name": "Developer"
    // }
      
      const columns = React.useMemo(
        () => [
          {
            Header: 'Name',
            accessor: 'name',
          },
          {
            Header: 'Phone',
            accessor: 'phone',
          },
          {
            Header: 'Assigned At',
            accessor: 'assigned_at',
            Cell: ({ value }) => <span style={{ color: 'green' }}>{value}</span>,
          },
          {
            Header: 'Assigned By',
            accessor: 'assigned_by_name',
            Cell: ({ value }) => <span style={{ color: 'green' }}>{value}</span>,
          },
          {
            Header: 'Assigned To',
            accessor: 'assigned_to_name',
            Cell: ({ value }) => <span style={{ color: 'green' }}>{value}</span>,
          },
          {
            Header: 'Campaign',
            accessor: 'utc',
            Cell: ({ value }) => <span style={{ color: 'green' }}>{value}</span>,
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
        page,
        prepareRow,
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

      const [dropdownData, setDropdownData] = useState(null);

      const fetchData = async (filterToApply = null) => {
        setLoaderActive(true);
        try {
          const response = await apiInstance('/assign_lead.php', 'POST', filterToApply);
          setTotalAssignData(response.data?.data);
          setTotalAssignFilteredData(response.data?.data);
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


  return (
    <div className="w-full p-1  rounded-md mt-1">
      {loaderActive && <LoaderComponent />}
      {switchState === "assign" && filterVisible && (
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

      <div>
      <div className="w-full overflow-x-auto shadow-md sm:rounded-lg">
      <table {...getTableProps()} className="w-full text-sm text-left text-gray-500">
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
        <tbody {...getTableBodyProps()} className="bg-white border-b">
          {page.map(row => {
            prepareRow(row);
            return (
              <tr 
                {...row.getRowProps()} 
                className="border-b hover:bg-gray-50"
              >
                {row.cells.map(cell => {
                  return (
                    <td 
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Pagination */}
      <div className="flex items-center justify-between p-4 bg-white border-t">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {'<<'}
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {'<'}
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {'>'}
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {'>>'}
          </button>
          <span className="text-sm text-gray-700">
            Page <span className="font-medium">{pageIndex + 1}</span> of{' '}
            <span className="font-medium">{pageOptions.length}</span>
          </span>
        </div>
        <select
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
          className="block w-24 px-3 py-1 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>

      </div>
    </div>
  )
}

export default Assignlead
