import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./component/Common/Navbar";
import Login from "./component/Login/Login";
import EmployeeDashboard from "./component/Employee/EmployeeDashboard";
import ManagerDashboard from "./component/Manager/ManagerDashboard";
import HRDashboard from "./component/Admin/HRDashboard";
import UserManagement from "./component/Admin/UserManagement";
import LeaveRequestPage from "./component/Employee/LeaveRequest";
import HolidayManagement from "./component/Admin/HolidayManagement";
import UpcomingLeaveCalendar from "./component/UpcomingLeaveCalender/UpcomingLeaveCalender";
import LeavePolicyManagement from "./component/Admin/LeavePolicyManagement";
import ForgotPassword from "./component/Login/ForgotPassword";
import HolidayCalendar from "./component/Employee/HolidayCalender";
import ProfilePage from "./component/Common/ProfilePage";
import DepartmentManagement from "./component/Admin/DepartmentManagement";

function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/hr-dashboard" element={<HRDashboard />} />
        <Route path="/user-manage" element={<UserManagement />} />
        <Route path="/leave-request" element={<LeaveRequestPage />} />
        <Route path="/holiday-manage" element={<HolidayManagement />} />
        <Route path="/policy-manage" element={<LeavePolicyManagement />} />
        <Route path="/upcoming-leave" element={<UpcomingLeaveCalendar />} />
        <Route path="/holidays" element={<HolidayCalendar />}/>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/department-manage" element={<DepartmentManagement />} />
      </Routes>
    </>
  );
}

export default App;
