
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==========================================
  // GET ALL USERS
  // ==========================================

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

  // ==========================================
  // VIEW SINGLE USER
  // ==========================================

  const handleViewUser = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  // ==========================================
  // VERIFY / UNVERIFY USER
  // ==========================================

  const handleVerification = async (user) => {
    try {
      setActionLoading(true);
      setError("");

      const response = await api.patch(
        `/users/${user._id}/verification`,
        {
          isVerified: !user.isVerified,
        }
      );

      const updatedUser = response.data.user;

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser._id === user._id
            ? {
                ...currentUser,
                isVerified: updatedUser.isVerified,
              }
            : currentUser
        )
      );
    } catch (error) {
      console.error("Verification error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update verification status."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.fullName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await api.delete(`/users/${user._id}`);

      setUsers((currentUsers) =>
        currentUsers.filter(
          (currentUser) =>
            currentUser._id !== user._id
        )
      );
    } catch (error) {
      console.error("Delete user error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to delete user."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-GH",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
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
            View and manage registered patients,
            doctors and administrators.
          </p>

        </section>

        {/* ERROR */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="dashboard-message">
            Loading users...
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
                There are currently no registered
                users.
              </p>

            </div>
          )}

        {/* USERS */}
        {!loading &&
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

                      <span
                        className={`status-badge ${
                          user.isVerified
                            ? "status-confirmed"
                            : "status-pending"
                        }`}
                      >
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
                          {user.phone ||
                            "Not provided"}
                        </strong>
                      </div>

                      <div>
                        <span>Joined</span>

                        <strong>
                          {formatDate(
                            user.createdAt
                          )}
                        </strong>
                      </div>

                    </div>

                    {/* DOCTOR INFORMATION */}
                    {user.role === "doctor" && (
                      <div className="appointment-details">

                        <div>
                          <span>
                            Specialization
                          </span>

                          <strong>
                            {user.specialization ||
                              "Not provided"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Hospital
                          </span>

                          <strong>
                            {user.hospital ||
                              "Not provided"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Experience
                          </span>

                          <strong>
                            {user.yearsOfExperience ||
                              0}{" "}
                            years
                          </strong>
                        </div>

                      </div>
                    )}

                    {/* ACTIONS */}
                    <div className="quick-actions">

                      <button
                        type="button"
                        onClick={() =>
                          handleViewUser(user._id)
                        }
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleVerification(user)
                        }
                        disabled={actionLoading}
                      >
                        {user.isVerified
                          ? "Unverify User"
                          : "Verify User"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteUser(user)
                        }
                        disabled={actionLoading}
                      >
                        Delete User
                      </button>

                    </div>

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

