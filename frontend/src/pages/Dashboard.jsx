import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

          <button onClick={handleLogout} className="logout-button">
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
            Manage your healthcare activities from one place.
          </p>
        </section>

        <section className="dashboard-grid">
          <Link to="/appointments" className="dashboard-card">
            <span className="dashboard-card-number">01</span>
            <h2>Appointments</h2>
            <p>
              View and manage your upcoming healthcare appointments.
            </p>
          </Link>

          <Link to="/medical-records" className="dashboard-card">
            <span className="dashboard-card-number">02</span>
            <h2>Medical Records</h2>
            <p>
              Access your medical history and important records.
            </p>
          </Link>

          <Link to="/prescriptions" className="dashboard-card">
            <span className="dashboard-card-number">03</span>
            <h2>Prescriptions</h2>
            <p>
              View your prescriptions and treatment instructions.
            </p>
          </Link>

          <Link to="/profile" className="dashboard-card">
            <span className="dashboard-card-number">04</span>
            <h2>My Profile</h2>
            <p>
              View and update your personal information.
            </p>
          </Link>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;