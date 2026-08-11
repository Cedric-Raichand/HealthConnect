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
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

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

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <Link to="/" className="dashboard-logo">
          Health<span>Connect</span>
        </Link>

        <div className="dashboard-user">
          <div>
            <strong>{user?.fullName || "User"}</strong>
            <span>{user?.role || "patient"}</span>
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
        <section className="dashboard-welcome">
          <p className="eyebrow">HEALTHCONNECT DASHBOARD</p>

          <h1>
            Welcome, {user?.fullName || "User"} 👋
          </h1>

          <p>
            Here's an overview of your healthcare activities.
          </p>
        </section>

        {loading && (
          <div className="dashboard-message">
            Loading your dashboard...
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading && !error && (
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

              <p>
                Total appointments
              </p>
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

              <p>
                Records available
              </p>
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

              <p>
                Active prescriptions
              </p>
            </Link>
          </section>
        )}

        <section className="dashboard-actions">
          <h2>Quick Actions</h2>

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
      </main>
    </div>
  );
}

export default Dashboard;