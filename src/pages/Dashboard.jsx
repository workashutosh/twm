import React, { useEffect, useState } from "react";
import Header from "@components/common/Header";
import Sidebar from "@components/common/Sidebar";


const Dashboard = () => {
  // Sidebar State
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  return (
    <>
      <Header />
      <main className="flex">
        {/* Sidebar Container */}
        <Sidebar
          isSidebarVisible={isSidebarVisible}
          setIsSidebarVisible={setIsSidebarVisible}
        />
        <section className="flex-1 my-4 ml-4 mr-7">
          <h1>Lead Dashboard for Admin</h1>
        </section>
      </main>
    </>
  );
};

export default Dashboard;
