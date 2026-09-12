import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

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
      setActionLoading(user._id);
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
      setActionLoading(null);
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
      setActionLoading(user._id);
      setError("");

      await api.delete(`/users/${user._id}`);

      setUsers((currentUsers) =>
        currentUsers.filter(
          (currentUser) => currentUser._id !== user._id
        )
      );
    } catch (error) {
      console.error("Delete user error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to delete user."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Unknown";
    }

    return new Date(date).toLocaleDateString("en-GH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // ROLE LABEL
  // ==========================================

  const getRoleLabel = (role) => {
    if (!role) {
      return "User";
    }

    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="dashboard-page">
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
        <section className="admin-users-header">
          <div>
            <p className="eyebrow">ADMIN PORTAL</p>

            <h1>User Management</h1>

            <p>
              View, verify and manage registered
              patients, doctors and administrators.
            </p>
          </div>

          {!loading && !error && (
            <div className="admin-users-count">
              <strong>{users.length}</strong>
              <span>Registered Users</span>
            </div>
          )}
        </section>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading && (
          <div className="admin-users-loading">
            <div className="admin-users-loading-icon">
              👥
            </div>

            <h2>Loading users...</h2>

            <p>
              Please wait while we retrieve the
              registered users.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          users.length === 0 && (
            <div className="empty-state admin-users-empty">
              <div className="admin-users-empty-icon">
                👥
              </div>

              <h2>No users found</h2>

              <p>
                There are currently no registered
                users.
              </p>
            </div>
          )}

        {!loading &&
          users.length > 0 && (
            <section className="admin-users-section">
              <div className="admin-users-section-header">
                <div>
                  <h2>Registered Users</h2>

                  <p>
                    Manage account verification and
                    user access.
                  </p>
                </div>

                <span className="admin-users-total">
                  {users.length} total
                </span>
              </div>

              <div className="admin-users-grid">
                {users.map((user) => {
                  const isActionLoading =
                    actionLoading === user._id;

                  return (
                    <article
                      className="admin-user-card"
                      key={user._id}
                    >
                      {/* CARD HEADER */}
                      <div className="admin-user-card-header">
                        <div className="admin-user-avatar">
                          {user.fullName
                            ?.charAt(0)
                            .toUpperCase() || "U"}
                        </div>

                        <div className="admin-user-heading">
                          <span
                            className={`admin-role-badge role-${user.role}`}
                          >
                            {getRoleLabel(user.role)}
                          </span>

                          <h2>{user.fullName}</h2>

                          <p>{user.email}</p>
                        </div>
                      </div>

                      {/* VERIFICATION */}
                      <div className="admin-user-verification">
                        <span
                          className={`status-badge ${
                            user.isVerified
                              ? "status-confirmed"
                              : "status-pending"
                          }`}
                        >
                          {user.isVerified
                            ? "✓ Verified"
                            : "Not Verified"}
                        </span>
                      </div>

                      {/* BASIC DETAILS */}
                      <div className="admin-user-details">
                        <div>
                          <span>Role</span>
                          <strong>
                            {getRoleLabel(user.role)}
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
                        <div className="admin-doctor-details">
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
                              {user.yearsOfExperience ||
                                0}{" "}
                              years
                            </strong>
                          </div>
                        </div>
                      )}

                      {/* ACTIONS */}
                      <div className="admin-user-actions">
                        <button
                          type="button"
                          className="admin-user-view-button"
                          onClick={() =>
                            handleViewUser(user._id)
                          }
                          disabled={isActionLoading}
                        >
                          View Details
                        </button>

                        <button
                          type="button"
                          className="admin-user-verify-button"
                          onClick={() =>
                            handleVerification(user)
                          }
                          disabled={isActionLoading}
                        >
                          {isActionLoading
                            ? "Processing..."
                            : user.isVerified
                            ? "Unverify"
                            : "Verify User"}
                        </button>

                        <button
                          type="button"
                          className="admin-user-delete-button"
                          onClick={() =>
                            handleDeleteUser(user)
                          }
                          disabled={isActionLoading}
                        >
                          {isActionLoading
                            ? "Processing..."
                            : "Delete User"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
      </main>
    </div>
  );
}

export default AdminUsers;