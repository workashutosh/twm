import { useEffect , useState} from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useStore from "@store";
import Dashboard from "@pages/Dashboard";
import LeadAssign from "@components/AssignLeads/LeadAssigment";
import ManageEmp from "@components/EmployeeManagement/ManageEmp";
import TagLead from "@components/LeadTagging/TagLead";
import SalesDashboard from "@components/Dashboards/SalesDashboard";


const App = () => {

  const { userDetails } = useStore();



  return (
    <AppProvider>
      <ToastContainer autoClose={1000} />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute 
                element={<Dashboard />} 
                key={"dashboard-page"} 
              />
            } 
          />
          <Route 
            path="/assignLeads" 
            element={
              <ProtectedRoute 
                element={<LeadAssign />} 
                key={"leadassign-page"} 
              />
            } 
          />
          <Route 
            path="/ManageEmp" 
            element={
              <ProtectedRoute 
                element={<ManageEmp />} 
                key={"ManageEmp-page"} 
              />
            } 
          />
          <Route 
            path="/tagLead" 
            element={
              <ProtectedRoute element={<TagLead />} key={"tagLead-page"} />
            } 
          />
          <Route 
            path="/salesDashhboard" 
            element={
              <ProtectedRoute element={<SalesDashboard />} key={"salesDashboard-page"} />
            } 
          />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};
export default App;
