import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function AdminUserDetails() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users/" + id);
      setUser(response.data);
    } catch (error) {
      console.error("User details error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load user details."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not provided";

    return new Date(date).toLocaleDateString("en-GH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getRoleLabel = (role) => {
    if (!role) return "User";

    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-content">
          <div className="admin-user-details-loading">
            <div className="loading-spinner"></div>
            <p>Loading user details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
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
            to="/admin/users"
            className="back-button"
          >
            ← Manage Users
          </Link>
        </header>

        <main className="dashboard-content">
          <div className="admin-user-details-error">
            <div className="admin-user-error-icon">!</div>

            <h2>Unable to Load User</h2>

            <p>{error}</p>

            <Link
              to="/admin/users"
              className="admin-user-back-button"
            >
              ← Back to Users
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
          to="/admin/users"
          className="back-button"
        >
          ← Manage Users
        </Link>
      </header>

      <main className="dashboard-content">
        {/* INTRO */}
        <section className="admin-user-details-header">
          <div>
            <p className="eyebrow">ADMIN PORTAL</p>

            <h1>User Details</h1>

            <p>
              View complete information about this
              HealthConnect user.
            </p>
          </div>
        </section>

        {/* USER PROFILE */}
        <section className="admin-user-details-card">
          {/* PROFILE HEADER */}
          <div className="admin-user-profile-header">
            <div className="admin-user-profile-avatar">
              {getInitials(user.fullName)}
            </div>

            <div className="admin-user-profile-heading">
              <div className="admin-user-profile-top">
                <span
                  className={`admin-role-badge admin-role-${user.role}`}
                >
                  {getRoleLabel(user.role)}
                </span>

                <span
                  className={
                    user.isVerified
                      ? "admin-user-verified"
                      : "admin-user-unverified"
                  }
                >
                  {user.isVerified
                    ? "✓ Verified"
                    : "Not Verified"}
                </span>
              </div>

              <h2>{user.fullName}</h2>

              <p>{user.email}</p>
            </div>
          </div>

          {/* BASIC INFORMATION */}
          <div className="admin-user-details-section">
            <div className="admin-user-section-heading">
              <span className="admin-user-section-icon">
                👤
              </span>

              <div>
                <h3>Basic Information</h3>
                <p>Account and contact details</p>
              </div>
            </div>

            <div className="admin-user-info-grid">
              <div className="admin-user-info-item">
                <span>Full Name</span>
                <strong>{user.fullName}</strong>
              </div>

              <div className="admin-user-info-item">
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>

              <div className="admin-user-info-item">
                <span>Role</span>
                <strong>{getRoleLabel(user.role)}</strong>
              </div>

              <div className="admin-user-info-item">
                <span>Phone</span>
                <strong>
                  {user.phone || "Not provided"}
                </strong>
              </div>

              <div className="admin-user-info-item">
                <span>Account Status</span>
                <strong>
                  {user.isVerified
                    ? "Verified"
                    : "Not Verified"}
                </strong>
              </div>

              <div className="admin-user-info-item">
                <span>Joined</span>
                <strong>
                  {formatDate(user.createdAt)}
                </strong>
              </div>
            </div>
          </div>

          {/* PATIENT INFORMATION */}
          {user.role === "patient" && (
            <>
              <div className="admin-user-details-divider"></div>

              <div className="admin-user-details-section">
                <div className="admin-user-section-heading">
                  <span className="admin-user-section-icon">
                    🏥
                  </span>

                  <div>
                    <h3>Patient Information</h3>
                    <p>Personal and health information</p>
                  </div>
                </div>

                <div className="admin-user-info-grid">
                  <div className="admin-user-info-item">
                    <span>Date of Birth</span>
                    <strong>
                      {user.dateOfBirth
                        ? formatDate(user.dateOfBirth)
                        : "Not provided"}
                    </strong>
                  </div>

                  <div className="admin-user-info-item">
                    <span>Gender</span>
                    <strong>
                      {user.gender || "Not provided"}
                    </strong>
                  </div>

                  <div className="admin-user-info-item">
                    <span>Blood Group</span>
                    <strong>
                      {user.bloodGroup || "Not provided"}
                    </strong>
                  </div>

                  <div className="admin-user-info-item admin-user-info-full">
                    <span>Address</span>
                    <strong>
                      {user.address || "Not provided"}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="admin-user-details-section">
                <div className="admin-user-section-heading">
                  <span className="admin-user-section-icon">
                    🚨
                  </span>

                  <div>
                    <h3>Emergency Contact</h3>
                    <p>Emergency contact information</p>
                  </div>
                </div>

                <div className="admin-user-info-grid">
                  <div className="admin-user-info-item">
                    <span>Name</span>
                    <strong>
                      {user.emergencyContact?.name ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div className="admin-user-info-item">
                    <span>Phone</span>
                    <strong>
                      {user.emergencyContact?.phone ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div className="admin-user-info-item">
                    <span>Relationship</span>
                    <strong>
                      {user.emergencyContact?.relationship ||
                        "Not provided"}
                    </strong>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* DOCTOR INFORMATION */}
          {user.role === "doctor" && (
            <>
              <div className="admin-user-details-divider"></div>

              <div className="admin-user-details-section">
                <div className="admin-user-section-heading">
                  <span className="admin-user-section-icon">
                    🩺
                  </span>

                  <div>
                    <h3>Doctor Information</h3>
                    <p>Professional and licensing details</p>
                  </div>
                </div>

                <div className="admin-user-info-grid">
                  <div className="admin-user-info-item">
                    <span>Specialization</span>
                    <strong>
                      {user.specialization ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div className="admin-user-info-item">
                    <span>Experience</span>
                    <strong>
                      {user.yearsOfExperience || 0} years
                    </strong>
                  </div>

                  <div className="admin-user-info-item">
                    <span>License Number</span>
                    <strong>
                      {user.licenseNumber ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div className="admin-user-info-item">
                    <span>Hospital</span>
                    <strong>
                      {user.hospital || "Not provided"}
                    </strong>
                  </div>
                </div>

                <div className="admin-user-bio">
                  <span>Professional Bio</span>

                  <p>
                    {user.bio ||
                      "No biography provided."}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* FOOTER */}
          <div className="admin-user-details-footer">
            <Link
              to="/admin/users"
              className="admin-user-footer-button"
            >
              ← Back to Users
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminUserDetails;