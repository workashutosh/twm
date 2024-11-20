import { useLocation, Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import IMAGES from "@images";
import { AppContext } from "@context/AppContext";
import { Home, BarChart2, UserRound , Tag , LayoutDashboard } from "lucide-react"; 

const Sidebar = ({ isSidebarVisible, setIsSidebarVisible }) => {
  const { pathname } = useLocation();
  const { activeUserData } = useContext(AppContext);

  return (
    <aside
      className={`${
        isSidebarVisible ? "min-w-[16vw]" : "w-fit"
      } bg-white h-screen pt-4 sticky select-none top-[55px] z-[40]`}
    >
      <img
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        src={IMAGES.SidebarToggleIcon}
        alt="sidebar toggle"
        className={`${
          isSidebarVisible ? "" : "rotate-180"
        } absolute -right-3 top-6 cursor-pointer`}
      />

      <div className="overflow-y-scroll">
        {/* Dashboard */}

    {activeUserData?.user_position && activeUserData?.user_position === "1" && (
        <Link to="/">
        <div
          className={`flex pl-4 square-box items-center gap-4 py-2 group hover:bg-[#0052CC] ${
            pathname === "/" ? "bg-[#0052CC]" : ""
          }`}
        >
          <Home
            size={20}
            color={pathname === "/" ? "white" : "#8A8A8A"}
            className="group-hover:text-white"
          />
          {isSidebarVisible && (
            <p
              className={`text-[#6F6B6B] group-hover:text-white ${
                pathname === "/" && "text-white"
              }`}
            >
              Dashboard
            </p>
          )}
        </div>
      </Link>

    )}

        {/* Assign Leads */}
      {activeUserData?.user_position && activeUserData?.user_position === "1" && (
        <Link to="/assignLeads">
          <div
            className={`cursor-pointer square-box flex group hover:bg-[#0052CC] items-center gap-4 py-2 px-4 ${
              pathname === "/assignLeads" ? "bg-[#0052CC]" : ""
            }`}
          >
            <BarChart2
              size={20}
              color={pathname === "/assignLeads" ? "white" : "#8A8A8A"}
              className="group-hover:text-white"
            />
            {isSidebarVisible && (
              <p
                className={`${
                  pathname === "/assignLeads" ? "text-white" : ""
                } text-[#6F6B6B] group-hover:text-white`}
              >
                Assign Leads
              </p>
            )}
          </div>
        </Link>
      )}

        {/* Add Employee  */}
        {activeUserData?.user_position && activeUserData?.user_position === "1" && (
        <Link to="/ManageEmp">
          <div
            className={`cursor-pointer square-box flex group hover:bg-[#0052CC] items-center gap-4 py-2 px-4 ${
              pathname === "/ManageEmp" ? "bg-[#0052CC]" : ""
            }`}
          >
            <UserRound 
              size={20}
              color={pathname === "/ManageEmp" ? "white" : "#8A8A8A"}
              className="group-hover:color-white"
            />
            {isSidebarVisible && (
              <p
                className={`${
                  pathname === "/ManageEmp" ? "text-white" : ""
                } text-[#6F6B6B] group-hover:text-white`}
              >
                Employee Management
              </p>
            )}
          </div>
        </Link>
        )}

        {/* sales pages start  */}

        {/* Sales Dashboard */}
        {activeUserData?.user_position && activeUserData?.user_position !== "1" && (
        <Link to="/salesDashhboard">
          <div
            className={`cursor-pointer square-box flex group hover:bg-[#0052CC] items-center gap-4 py-2 px-4 ${
              pathname === "/salesDashhboard" ? "bg-[#0052CC]" : ""
            }`}
          >
            <LayoutDashboard 
              size={20}
              color={pathname === "/salesDashhboard" ? "white" : "#8A8A8A"}
              className="group-hover:color-white"
            />
            {isSidebarVisible && (
              <p
                className={`${
                  pathname === "/salesDashhboard" ? "text-white" : ""
                } text-[#6F6B6B] group-hover:text-white`}
              >
                Sales Dashboard
              </p>
            )}
          </div>
        </Link>
        )}

        {/* Tag Leads */}
        {activeUserData?.user_position && activeUserData?.user_position !== "1" && (
        <Link to="/tagLead">
          <div
            className={`cursor-pointer square-box flex group hover:bg-[#0052CC] items-center gap-4 py-2 px-4 ${
              pathname === "/tagLead" ? "bg-[#0052CC]" : ""
            }`}
          >
            <Tag 
              size={20}
              color={pathname === "/tagLead" ? "white" : "#8A8A8A"}
              className="group-hover:color-white"
            />
            {isSidebarVisible && (
              <p
                className={`${
                  pathname === "/tagLead" ? "text-white" : ""
                } text-[#6F6B6B] group-hover:text-white`}
              >
                Tag Leads
              </p>
            )}
          </div>
        </Link>
        )}

      </div>
    </aside>
  );
};

export default Sidebar;
