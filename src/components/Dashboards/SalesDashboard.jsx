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


const SalesDashboard = () => {
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
        <div>
          <h1>Sales Dashboard for sales employees</h1>
        </div>
      </div>
      </section>
    </main>
    </>
  );
};

export default SalesDashboard;
