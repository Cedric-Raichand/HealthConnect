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
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetails from "./pages/AdminUserDetails";
import AdminAppointments from "./pages/AdminAppointments";

import MedicalRecordDetails from "./pages/MedicalRecordDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ============================= */}
        {/* PUBLIC ROUTES */}
        {/* ============================= */}

        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ============================= */}
        {/* GENERAL PROTECTED ROUTES */}
        {/* PATIENT */}
        {/* ============================= */}

        <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>

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
            path="/medical-records/:id"
            element={<MedicalRecordDetails />}
          />

          <Route
            path="/prescriptions"
            element={<Prescriptions />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>


        {/* ============================= */}
        {/* DOCTOR ROUTES */}
        {/* ============================= */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["doctor"]} />
          }
        >

          <Route
            path="/doctor/appointments"
            element={<DoctorAppointments />}
          />

          <Route
            path="/doctor/medical-records"
            element={<DoctorMedicalRecords />}
          />

          <Route
            path="/doctor/prescriptions"
            element={<DoctorPrescriptions />}
          />

          <Route
            path="/doctor/create-medical-record"
            element={<CreateMedicalRecord />}
          />

          <Route
            path="/doctor/medical-records/:id"
            element={<MedicalRecordDetails />}
          />

          <Route
            path="/doctor/profile"
            element={<Profile />}
          />

        </Route>


        {/* ============================= */}
        {/* ADMIN ROUTES */}
        {/* ============================= */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["admin"]} />
          }
        >

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />

          <Route
            path="/admin/users/:id"
            element={<AdminUserDetails />}
          />

          <Route
            path="/admin/appointments"
            element={<AdminAppointments />}
          />

          <Route
            path="/admin/medical-records"
            element={<MedicalRecords />}
          />

          <Route
            path="/admin/medical-records/:id"
            element={<MedicalRecordDetails />}
          />

          <Route
            path="/admin/prescriptions"
            element={<Prescriptions />}
          />

          <Route
            path="/admin/profile"
            element={<Profile />}
          />

        </Route>


        {/* ============================= */}
        {/* 404 */}
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