import React, { useEffect, useState } from "react";
import Header from "@components/common/Header";
import Sidebar from "@components/common/Sidebar";
import { UserPlus, UserRound } from "lucide-react";
import apiInstance from "@api/apiInstance";
import { useTable, usePagination, useSortBy } from 'react-table';
import { EyeClosed, Eye } from 'lucide-react';

const PasswordColumn = ({ value }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="flex items-center">
      <div className="whitespace-normal break-words" style={{ maxWidth: '120px' }}>
        {isPasswordVisible ? value : '••••••••••••'}
      </div>
      <button onClick={togglePasswordVisibility} className="ml-2">
        {isPasswordVisible ? <Eye size={16} /> : <EyeClosed size={16} />}
      </button>
    </div>
  );
};

const ManageEmp = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loaderActive, setLoaderActive] = useState(false);
  const [data, setData] = useState([]); 


  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  // State for form fields
  const [formData, setFormData] = useState({
    employeeName: "",
    email: "",
    userName: generateUsername(),
    password: "",
    userRole: "",
  });

  const fetchData = async (filterToApply = null) => {
    setLoaderActive(true);
    try {
      const response = await apiInstance('/users.php', 'GET');
      setData(response?.data?.data || []); // Ensure data is an array
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoaderActive(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Username generator function
  function generateUsername() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleAddEmpSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (Object.values(formData).some((field) => !field)) {
      alert("Please fill out all fields.");
      return;
    }

    // Create a FormData object
    const employeeData = new FormData();
    for (const key in formData) {
      employeeData.append(key, formData[key]);
    }

    const response = await apiInstance('/users.php', 'POST', employeeData);

    if (response.status === 200) {
      alert("User added successfully.");
      setIsModalOpen(false);
      setFormData({
        employeeName: "",
        email: "",
        userName: generateUsername(),
        password: "",
        userRole: "",
      });
      fetchData(); 
    } else {
      alert("Failed to add user. Please try again.");
    }
  };

  const columns = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'user_id' },
      {
        Header: 'Name',
        accessor: 'user_full_name',
        Cell: ({ value }) => (
          <div className="whitespace-normal break-words" style={{ maxWidth: '100px' }}>
            {value}
          </div>
        ),
      },
      { Header: 'Username', accessor: 'user_whatsapp_number' },
      { Header: 'Password', accessor: 'password', Cell: ({ value }) => <PasswordColumn value={value} /> },
      { Header: 'Email', accessor: 'user_email_id' },
      {
        Header: 'Role',
        accessor: 'user_position',
        Cell: ({ value }) => {
          switch (value) {
            case "1":
              return 'Sub-admin';
            case "2":
              return 'Manager';
            case "3":
              return 'Sales Person';
            default:
              return 'Unknown';
          }
        },
      },
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
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: data || [], 
      initialState: { pageSize: 20 },
    },
    useSortBy,
    usePagination
  );




  return (
    <>
      <Header />
      <main className="flex">
        <Sidebar
          isSidebarVisible={isSidebarVisible}
          setIsSidebarVisible={setIsSidebarVisible}
        />
        <section className="flex-1 my-4 ml-4 mr-7">
          {/* Action bar */}
          <div className="w-full border p-1 bg-white shadow-sm rounded-md flex justify-between">
            <div className="flex text-sm gap-2 p-1 rounded pl-1">
              <span className="bg-[#0052CC] text-white font-semibold p-1 flex gap-1 rounded-md cursor-pointer">
                <UserRound size={18} />
                All Employees
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleModal}
                className="bg-[#0052CC] text-white p-1 rounded-md flex gap-2 font-semibold cursor-pointer text-sm"
              >
                Add Employee
                <UserPlus size={18} />
              </button>
            </div>
          </div>

          {/* Employee List */}
          <div className="mt-2 p-1 border rounded-md bg-white shadow-sm">
            <table {...getTableProps()} className="w-full border-collapse">
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())} className="border p-1">
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map(row => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="border">
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()} className="p-2 border">
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex w-full z-50 items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-2 rounded-md shadow-md w-[600px]">
            <h2 className="text-md font-semibold mb-4">Add Employee</h2>
            <form onSubmit={handleAddEmpSubmit}>
              <div className="flex gap-3">
                <div className="mb-2">
                  <label className="block text-sm font-medium">Employee Name</label>
                  <input
                    type="text"
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleChange}
                    required
                    className="border rounded-md w-full p-1 mt-1"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border rounded-md w-full p-1 mt-1"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">User Role</label>
                  <select
                    name="userRole"
                    value={formData.userRole}
                    onChange={handleChange}
                    required
                    className="border rounded-md w-full p-1 mt-1"
                  >
                    <option value="" disabled>Select role</option>
                    <option value="1">Sub-admin</option>
                    <option value="2">Manager</option>
                    <option value="3">Sales Person</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mb-2">
                  <label className="block text-sm font-medium">Username</label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    readOnly
                    className="border rounded-md w-full p-1 mt-1 bg-gray-100"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="border rounded-md w-full p-1 mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={toggleModal}
                  type="button"
                  className="bg-gray-500 text-white px-2 py-1 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0052CC] text-white px-2 py-1 rounded-md"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageEmp;
