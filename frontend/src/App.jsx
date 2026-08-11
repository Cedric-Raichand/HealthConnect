import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

function Placeholder({ title }) {
  return <h1>{title}</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/appointments"
          element={<Placeholder title="Appointments" />}
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

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;