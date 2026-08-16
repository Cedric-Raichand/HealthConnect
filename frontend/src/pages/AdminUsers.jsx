import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users");

      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Users error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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

        <Link
          to="/admin/dashboard"
          className="back-button"
        >
          ← Admin Dashboard
        </Link>

      </header>

      <main className="dashboard-content">

        {/* INTRO */}
        <section className="dashboard-welcome">

          <p className="eyebrow">
            ADMIN PORTAL
          </p>

          <h1>
            Manage Users
          </h1>

          <p>
            View all registered patients, doctors
            and administrators on HealthConnect.
          </p>

        </section>

        {/* LOADING */}
        {loading && (
          <div className="dashboard-message">
            Loading users...
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          users.length === 0 && (
            <div className="empty-state">

              <h2>
                No users found
              </h2>

              <p>
                There are currently no registered users.
              </p>

            </div>
          )}

        {/* USERS */}
        {!loading &&
          !error &&
          users.length > 0 && (
            <section className="appointments-section">

              <h2>
                Registered Users ({users.length})
              </h2>

              <div className="appointments-list">

                {users.map((user) => (
                  <article
                    className="appointment-card"
                    key={user._id}
                  >

                    {/* USER HEADER */}
                    <div className="appointment-main">

                      <div>

                        <span className="appointment-label">
                          {user.role}
                        </span>

                        <h2>
                          {user.fullName}
                        </h2>

                        <p>
                          {user.email}
                        </p>

                      </div>

                      <span className="status-badge status-confirmed">
                        {user.isVerified
                          ? "Verified"
                          : "Not Verified"}
                      </span>

                    </div>

                    {/* USER DETAILS */}
                    <div className="appointment-details">

                      <div>
                        <span>Role</span>

                        <strong>
                          {user.role}
                        </strong>
                      </div>

                      <div>
                        <span>Phone</span>

                        <strong>
                          {user.phone || "Not provided"}
                        </strong>
                      </div>

                      <div>
                        <span>Joined</span>

                        <strong>
                          {formatDate(user.createdAt)}
                        </strong>
                      </div>

                    </div>

                    {/* DOCTOR INFORMATION */}
                    {user.role === "doctor" && (
                      <div className="appointment-details">

                        <div>
                          <span>Specialization</span>

                          <strong>
                            {user.specialization ||
                              "Not provided"}
                          </strong>
                        </div>

                        <div>
                          <span>Hospital</span>

                          <strong>
                            {user.hospital ||
                              "Not provided"}
                          </strong>
                        </div>

                        <div>
                          <span>Experience</span>

                          <strong>
                            {user.yearsOfExperience || 0} years
                          </strong>
                        </div>

                      </div>
                    )}

                  </article>
                ))}

              </div>

            </section>
          )}

      </main>
    </div>
  );
}

export default AdminUsers;