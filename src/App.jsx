import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import Login from "./components/Login/index";
import SignUp from "./components/SignUp";
import HomePage from "./components/Home";
import NavBar from "./components/Global/Nav";
import Footer from "./components/Global/Fot";
import Club from "./components/Club/index";
import ServicePage from "./components/Services/ServicePage";
import ServiceDetail from "./components/Services/ServiceDetail";
// import PricingPage from "./components/Price"; // Comment out as we're only using MembershipPage
import ViewSchedulePage from "./components/Schedule";
import ManageSchedule from "./components/Manage";
import ManageScheduleAdmin from "./components/Admin/qllt";
import PaymentPage from "./components/Pay/index";
import BillPage from "./components/Pay/bill";
import AdminClubManager from "./components/Admin/qlclb";
import AdminServiceManager from "./components/Admin/qldv";
import UserProfile from "./components/Users";
import UserPaidClasses from "./components/UserPaidClasses";
import PaymentManagement from "./components/Admin/PaymentManagement";
import MembershipPage from "./components/Membership";
import MembershipManagement from "./components/Admin/MembershipManagement";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <NavBar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/club" element={<Club />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/schedule" element={<ViewSchedulePage />} />
        <Route path="/manage" element={<ManageSchedule />} />
        <Route path="/qllt" element={<ManageScheduleAdmin />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/bill" element={<BillPage />} />
        <Route path="/qlclb" element={<AdminClubManager />} />
        <Route path="/qldv" element={<AdminServiceManager />} />
        <Route path="/user" element={<UserProfile />} />
        <Route path="/my-schedule" element={<UserPaidClasses />} />
        <Route path="/my-classes" element={<UserPaidClasses />} />

        {/* Admin routes - instead of conditional rendering, use the element for conditional access */}
        <Route
          path="/admin/payments"
          element={
            user?.role === "admin" ? (
              <PaymentManagement />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/admin/memberships"
          element={
            user?.role === "admin" ? (
              <MembershipManagement />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
