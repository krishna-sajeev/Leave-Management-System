import { useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './component/Common/Navbar';
import Login from './component/Login/Login';
import EmployeeDashboard from './component/Employee/EmployeeDashboard';
import ManagerDashboard from './component/Manager/ManagerDashboard';
import HRDashboard from './component/Admin/HRDashboard';
import UserManagement from './component/Admin/UserManagement';
import LeaveRequestPage from './component/Employee/LeaveRequest';
import HolidayManagement from './component/Admin/HolidayManagement';
import UpcomingLeaveCalendar from './component/UpcomingLeaveCalender/UpcomingLeaveCalender';
import LeavePolicyManagement from './component/Admin/LeavePolicyManagement';

function App() {
  const location = useLocation();

  // ✅ Hide navbar on login page
  const hideNavbar = location.pathname === '/login';

  return (
    <>
      {!hideNavbar && <Navbar />}   {/* Only show after login */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/hr-dashboard" element={<HRDashboard />} />
        <Route path="/user-manage" element={<UserManagement />} />
        <Route path="/leave-request" element={<LeaveRequestPage />} />
        <Route path="/holiday-manage" element={<HolidayManagement />} />
        <Route path="/policy-manage" element={<LeavePolicyManagement />} />
        <Route path="/upcoming-leave" element={<UpcomingLeaveCalendar />} />
      </Routes>
    </>
  );
}

export default App;
