import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";
import Appointments from "./pages/Appointments";
import Profile from "./pages/Profile";
import MedicalRecords from "./pages/MedicalRecords";
import CreateMedicalRecord from "./pages/CreateMedicalRecord";
import Prescriptions from "./pages/Prescriptions";
import DoctorPrescriptions from "./pages/DoctorPrescriptions";
import DoctorMedicalRecords from "./pages/DoctorMedicalRecords";
import DoctorAppointments from "./pages/DoctorAppointments";
import AdminDashboard from "./pages/AdminDashboard";

function Placeholder({ title }) {
  return <h1>{title}</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ============================= */}
        {/* PUBLIC ROUTES */}
        {/* ============================= */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />


        {/* ============================= */}
        {/* PROTECTED ROUTES */}
        {/* ============================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/appointments"
            element={<Appointments />}
          />

          <Route
           path="/medical-records"
           element={<MedicalRecords />}
          />

          <Route
            path="/prescriptions"
            element={<Prescriptions />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />
                    
          <Route
           path="/create-medical-record"
           element={<CreateMedicalRecord />}
          />

          <Route
           path="/doctor/prescriptions"
           element={<DoctorPrescriptions />}
          />

          <Route
           path="/doctor/medical-records"
           element={<DoctorMedicalRecords />}
          />

          <Route
           path="/doctor/appointments"
           element={<DoctorAppointments />}
          />

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />




        </Route>
          



        {/* ============================= */}
        {/* 404 ROUTE */}
        {/* ============================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;