import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";
import Appointments from "./pages/Appointments";

function Placeholder({ title }) {
  return <h1>{title}</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
             path="/appointments"
             element={<Appointments />}
          />

          <Route
            path="/medical-records"
            element={<Placeholder title="Medical Records" />}
          />

          <Route
            path="/prescriptions"
            element={<Placeholder title="Prescriptions" />}
          />

          <Route
            path="/profile"
            element={<Placeholder title="My Profile" />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;