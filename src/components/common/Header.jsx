import { useContext, useState , useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import IMAGES from "@images";
import { AppContext } from "@context/AppContext";
import { getLocalStorage } from "@utils/getLocalStorage";
import axiosInstance from "@api/axiosInstance";
import { useLoggerStore } from "@store/log.jsx";
import { UserRound } from "lucide-react";


const Header = () => {
  const { activeUserData, setActiveUserData } = useContext(AppContext);
  const {updateActivityLog , initializeLogData } = useLoggerStore();
  const [value, setValue] = useState(null);
  const navigate = useNavigate();
  
  const username = activeUserData?.user_name;



  const handleLogCheck = async (log) => {
    updateActivityLog(log);
   } 
 
   useEffect(() => {
     initializeLogData(activeUserData);
   }, [activeUserData, initializeLogData]);

  const handleLogout = async () => {
    handleLogCheck(`Logout for ${username} on ${new Date().toLocaleString()}`);
    try {
      if (!getLocalStorage()) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.log(error);
    }

    const lsData = getLocalStorage();

    axiosInstance(
      `/session/logout/${lsData.session_id}`,
      "DELETE",
      {},
      lsData.access_token
    ).finally(() => {
      secureLocalStorage.clear("data");
      setActiveUserData(null);
      window.location.href = "/login";
    });
  };


  

  return (
    <header className="sticky top-0 left-0 z-50 flex items-center justify-between px-8 py-2 bg-white shadow-md ">
      <Link to="/">
        {/* <img src={IMAGES.LivnestLogo} alt="livNest Logo" /> */}
        <p className="font-bold p-1 text-sm bg-blue-800 rounded-md text-white">
        TWM - CRM

        </p>
      </Link>

      <div className="flex">

        <div className="group bg-[#0052CC] relative flex  cursor-pointer items-center rounded-[40px] border border-solid border-gray-200 py-[1px] pl-[1px] shadow-md">
             <UserRound 
              size={27}
              color="white"
              className=""
            />

            
              {/* This div should be visible when I hover on the parent div */}
               <div className="invisible absolute right-1 top-12 w-42 rounded-md border border-[#b58eef] h-[100px] bg-white py-1 px-2  shadow-md  transition-all ease-in-out group-hover:visible">
                
                <div className="w-[300px]  bg-white">
                  <p className="text-xs mt-1 font-semibold font-sans">Account Name {activeUserData?.user_position}</p>
                  <div className="mt-2 border-b mb-2">
                    <span className=" text-sm font-sans text-[#4A5157] ">{username}</span>
                  </div>
                  <div className="hover:bg-[#b596e2] hover:text-white rounded-md px-2 font-sans">
                    <button className="text-sm " onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                    
                </div>
                
              </div> 
            </div>



      </div>
    </header>
  );
};

export default Header;
