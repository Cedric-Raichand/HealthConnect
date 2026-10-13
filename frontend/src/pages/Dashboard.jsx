import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    appointments: 0,
    upcomingAppointments: 0,
    medicalRecords: 0,
    prescriptions: 0,

    totalAppointments: 0,
    totalPatients: 0,
    pendingAppointments: 0,
    completedAppointments: 0,

    users: 0,
    doctors: 0,
    patients: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/dashboard");

        setStats(response.data);
      } catch (error) {
        console.error("Dashboard error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Patient";

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="dashboard-header">
        <Link to="/" className="dashboard-logo">
          Health<span>Connect</span>
        </Link>

        <div className="dashboard-user">
          <div className="dashboard-user-info">
            <strong>{user?.fullName || "User"}</strong>
            <span>{roleLabel}</span>
          </div>

          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="dashboard-content">
        {/* WELCOME */}
        <section className="dashboard-welcome">
          <span className="eyebrow">
            HEALTHCONNECT DASHBOARD
          </span>

          <h1>
            Welcome, {user?.fullName || "User"} 👋
          </h1>

          <p>
            Here's an overview of your healthcare activities.
          </p>
        </section>

        {/* LOADING */}
        {loading && (
          <div className="dashboard-message dashboard-loading">
            <div className="dashboard-spinner"></div>
            <span>Loading your dashboard...</span>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="error-message dashboard-error">
            {error}
          </div>
        )}

        {/* PATIENT DASHBOARD */}
        {!loading &&
          !error &&
          user?.role === "patient" && (
            <>
              <section className="dashboard-grid">
                <Link
                  to="/appointments"
                  className="dashboard-card"
                >
                  <span className="dashboard-card-number">
                    01
                  </span>

                  <h2>Appointments</h2>

                  <strong className="dashboard-stat">
                    {stats.appointments}
                  </strong>

                  <p>Total appointments</p>
                </Link>

                <Link
                  to="/appointments"
                  className="dashboard-card"
                >
                  <span className="dashboard-card-number">
                    02
                  </span>

                  <h2>Upcoming</h2>

                  <strong className="dashboard-stat">
                    {stats.upcomingAppointments}
                  </strong>

                  <p>
                    Pending or confirmed appointments
                  </p>
                </Link>

                <Link
                  to="/medical-records"
                  className="dashboard-card"
                >
                  <span className="dashboard-card-number">
                    03
                  </span>

                  <h2>Medical Records</h2>

                  <strong className="dashboard-stat">
                    {stats.medicalRecords}
                  </strong>

                  <p>Records available</p>
                </Link>

                <Link
                  to="/prescriptions"
                  className="dashboard-card"
                >
                  <span className="dashboard-card-number">
                    04
                  </span>

                  <h2>Prescriptions</h2>

                  <strong className="dashboard-stat">
                    {stats.prescriptions}
                  </strong>

                  <p>Active prescriptions</p>
                </Link>
              </section>

              <section className="dashboard-actions">
                <div className="dashboard-section-heading">
                  <span className="eyebrow">SHORTCUTS</span>
                  <h2>Quick Actions</h2>
                </div>

                <div className="quick-actions">
                  <Link to="/appointments">
                    Book Appointment
                  </Link>

                  <Link to="/medical-records">
                    View Medical Records
                  </Link>

                  <Link to="/prescriptions">
                    View Prescriptions
                  </Link>

                  <Link to="/profile">
                    Update Profile
                  </Link>
                </div>
              </section>
            </>
          )}

        {/* DOCTOR DASHBOARD */}
        {!loading &&
          !error &&
          user?.role === "doctor" && (
            <>
              <section className="dashboard-grid">
                <Link
                  to="/doctor/appointments"
                  className="dashboard-card"
                >
                  <span className="dashboard-card-number">
                    01
                  </span>

                  <h2>Total Appointments</h2>

                  <strong className="dashboard-stat">
                    {stats.totalAppointments}
                  </strong>

                  <p>Appointments assigned to you</p>
                </Link>

                <Link
                  to="/doctor/appointments"
                  className="dashboard-card"
                >
                  <span className="dashboard-card-number">
                    02
                  </span>

                  <h2>Total Patients</h2>

                  <strong className="dashboard-stat">
                    {stats.totalPatients}
                  </strong>

                  <p>
                    Patients you have appointments with
                  </p>
                </Link>

                <Link
                  to="/doctor/appointments"
                  className="dashboard-card"
                >
                  <span className="dashboard-card-number">
                    03
                  </span>

                  <h2>Pending</h2>

                  <strong className="dashboard-stat">
                    {stats.pendingAppointments}
                  </strong>

                  <p>Appointments awaiting action</p>
                </Link>

                <Link
                  to="/doctor/appointments"
                  className="dashboard-card"
                >
                  <span className="dashboard-card-number">
                    04
                  </span>

                  <h2>Completed</h2>

                  <strong className="dashboard-stat">
                    {stats.completedAppointments}
                  </strong>

                  <p>Completed appointments</p>
                </Link>
              </section>

              <section className="dashboard-actions">
                <div className="dashboard-section-heading">
                  <span className="eyebrow">SHORTCUTS</span>
                  <h2>Quick Actions</h2>
                </div>

                <div className="quick-actions">
                  <Link to="/doctor/appointments">
                    View Appointments
                  </Link>

                  <Link to="/doctor/medical-records">
                    Medical Records
                  </Link>

                  <Link to="/doctor/profile">
                    Update Profile
                  </Link>
                </div>
              </section>
            </>
          )}

        {/* ADMIN DASHBOARD */}
        {!loading &&
          !error &&
          user?.role === "admin" && (
            <>
              <section className="dashboard-grid">
                <Link
                  to="/admin/users"
                  className="dashboard-card"
                >
                  <span className="dashboard-card-number">
                    01
                  </span>

                  <h2>Users</h2>

                  <strong className="dashboard-stat">
                    {stats.users || 0}
                  </strong>

                  <p>Total registered users</p>
                </Link>

                <Link
                  to="/admin/users"
                  className="dashboard-card"
                >
                  <span className="dashboard-card-number">
                    02
                  </span>

                  <h2>Doctors</h2>

                  <strong className="dashboard-stat">
                    {stats.doctors || 0}
                  </strong>

                  <p>Registered doctors</p>
                </Link>

                <Link
                  to="/admin/users"
                  className="dashboard-card"
                >
                  <span className="dashboard-card-number">
                    03
                  </span>

                  <h2>Patients</h2>

                  <strong className="dashboard-stat">
                    {stats.patients || 0}
                  </strong>

                  <p>Registered patients</p>
                </Link>

                <Link
                  to="/admin/appointments"
                  className="dashboard-card"
                >
                  <span className="dashboard-card-number">
                    04
                  </span>

                  <h2>Appointments</h2>

                  <strong className="dashboard-stat">
                    {stats.appointments || 0}
                  </strong>

                  <p>Total appointments</p>
                </Link>
              </section>

              <section className="dashboard-actions">
                <div className="dashboard-section-heading">
                  <span className="eyebrow">ADMIN TOOLS</span>
                  <h2>Quick Actions</h2>
                </div>

                <div className="quick-actions">
                  <Link to="/admin/users">
                    Manage Users
                  </Link>

                  <Link to="/admin/appointments">
                    View Appointments
                  </Link>

                  <Link to="/admin/medical-records">
                    Medical Records
                  </Link>

                  <Link to="/admin/prescriptions">
                    Prescriptions
                  </Link>
                </div>
              </section>
            </>
          )}
      </main>
    </div>
  );
}

export default Dashboard;