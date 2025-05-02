import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Login from "./components/Login/index";
import SignUp from "./components/SignUp";
import HomePage from "./components/Home";
import NavBar from "./components/Global/Nav";
import Footer from "./components/Global/Fot";
import Club from "./components/Club/index";
import ServicePage from "./components/Services/ServicePage";
import ServiceDetail from "./components/Services/ServiceDetail";
import PricingPage from "./components/Price";
import ViewSchedulePage from "./components/Schedule";
import ManageSchedule from "./components/Manage";
import ManageScheduleAdmin from "./components/Admin/qllt";
import PaymentPage from "./components/Pay/index";
import BillPage from "./components/Pay/bill";
import AdminClubManager from "./components/Admin/qlclb";
import AdminServiceManager from "./components/Admin/qldv";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (loggedUser) {
      setUser(loggedUser);
    }
  }, []);

  return (
    <Router>
      <NavBar user={user} setUser={setUser} />
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/club" element={<Club />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/prices" element={<PricingPage />} />
        <Route path="/schedule" element={<ViewSchedulePage />} />
        <Route path="/manage" element={<ManageSchedule />} />
        <Route path="/ql" element={<ManageScheduleAdmin />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/bill" element={<BillPage />} />
        <Route path="/qlclb" element={<AdminClubManager />} />
        <Route path="/qldv" element={<AdminServiceManager />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
