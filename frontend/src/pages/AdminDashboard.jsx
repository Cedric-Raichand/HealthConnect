import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function AdminDashboard() {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    patients: 0,
    appointments: 0,
    medicalRecords: 0,
    prescriptions: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  const fetchAdminDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard");

      setStats({
        users: response.data.users || 0,
        doctors: response.data.doctors || 0,
        patients: response.data.patients || 0,
        appointments: response.data.appointments || 0,
        medicalRecords: response.data.medicalRecords || 0,
        prescriptions: response.data.prescriptions || 0,
      });
    } catch (error) {
      console.error("Admin dashboard error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="dashboard-header">
        <Link
          to="/admin/dashboard"
          className="dashboard-logo"
        >
          Health<span>Connect</span>
        </Link>

        <div className="dashboard-user">
          <div>
            <strong>
              {user?.fullName || "Admin"}
            </strong>

            <span>
              {user?.role || "admin"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {/* INTRO */}
        <section className="dashboard-welcome">
          <p className="eyebrow">
            ADMIN PORTAL
          </p>

          <h1>
            Welcome, {user?.fullName || "Admin"} 👋
          </h1>

          <p>
            Monitor and manage HealthConnect activities.
          </p>
        </section>

        {/* LOADING */}
        {loading && (
          <div className="dashboard-message">
            Loading admin dashboard...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* STATISTICS */}
        {!loading && !error && (
          <section className="dashboard-grid">
            {/* USERS */}
            <Link
              to="/admin/users"
              className="dashboard-card"
            >
              <span className="dashboard-card-number">
                01
              </span>

              <h2>Total Users</h2>

              <strong className="dashboard-stat">
                {stats.users}
              </strong>

              <p>Registered users</p>
            </Link>

            {/* DOCTORS */}
            <Link
              to="/admin/users"
              className="dashboard-card"
            >
              <span className="dashboard-card-number">
                02
              </span>

              <h2>Doctors</h2>

              <strong className="dashboard-stat">
                {stats.doctors}
              </strong>

              <p>Registered doctors</p>
            </Link>

            {/* PATIENTS */}
            <Link
              to="/admin/users"
              className="dashboard-card"
            >
              <span className="dashboard-card-number">
                03
              </span>

              <h2>Patients</h2>

              <strong className="dashboard-stat">
                {stats.patients}
              </strong>

              <p>Registered patients</p>
            </Link>

            {/* APPOINTMENTS */}
            <Link
              to="/admin/appointments"
              className="dashboard-card"
            >
              <span className="dashboard-card-number">
                04
              </span>

              <h2>Appointments</h2>

              <strong className="dashboard-stat">
                {stats.appointments}
              </strong>

              <p>Total appointments</p>
            </Link>

            {/* MEDICAL RECORDS */}
            <Link
              to="/medical-records"
              className="dashboard-card"
            >
              <span className="dashboard-card-number">
                05
              </span>

              <h2>Medical Records</h2>

              <strong className="dashboard-stat">
                {stats.medicalRecords}
              </strong>

              <p>Healthcare records</p>
            </Link>

            {/* PRESCRIPTIONS */}
            <Link
              to="/prescriptions"
              className="dashboard-card"
            >
              <span className="dashboard-card-number">
                06
              </span>

              <h2>Prescriptions</h2>

              <strong className="dashboard-stat">
                {stats.prescriptions}
              </strong>

              <p>Prescriptions created</p>
            </Link>
          </section>
        )}

        {/* QUICK ACTIONS */}
        <section className="dashboard-actions">
          <h2>Admin Actions</h2>

          <div className="quick-actions">
            <Link to="/admin/appointments">
              View Appointments
            </Link>

            <Link to="/medical-records">
              View Medical Records
            </Link>

            <Link to="/prescriptions">
              View Prescriptions
            </Link>

            <Link to="/profile">
              My Profile
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;