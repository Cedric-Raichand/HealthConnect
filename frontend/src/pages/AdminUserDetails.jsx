
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
    return new Date(date).toLocaleDateString("en-GH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-content">
          <div className="dashboard-message">
            Loading user details...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-content">

          <div className="error-message">
            {error}
          </div>

          <Link to="/admin/users">
            ← Back to Users
          </Link>

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
        <section className="dashboard-welcome">

          <p className="eyebrow">
            ADMIN PORTAL
          </p>

          <h1>
            User Details
          </h1>

          <p>
            View complete information about this
            HealthConnect user.
          </p>

        </section>

        {/* USER PROFILE */}
        <section className="appointments-section">

          <article className="appointment-card">

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

            {/* BASIC INFORMATION */}
            <div className="appointment-details">

              <div>
                <span>Full Name</span>
                <strong>
                  {user.fullName}
                </strong>
              </div>

              <div>
                <span>Email</span>
                <strong>
                  {user.email}
                </strong>
              </div>

              <div>
                <span>Role</span>
                <strong>
                  {user.role}
                </strong>
              </div>

            </div>

            <div className="appointment-details">

              <div>
                <span>Phone</span>
                <strong>
                  {user.phone || "Not provided"}
                </strong>
              </div>

              <div>
                <span>Account Status</span>
                <strong>
                  {user.isVerified
                    ? "Verified"
                    : "Not Verified"}
                </strong>
              </div>

              <div>
                <span>Joined</span>
                <strong>
                  {formatDate(user.createdAt)}
                </strong>
              </div>

            </div>

            {/* PATIENT INFORMATION */}
            {user.role === "patient" && (
              <>
                <h2>
                  Patient Information
                </h2>

                <div className="appointment-details">

                  <div>
                    <span>Date of Birth</span>
                    <strong>
                      {user.dateOfBirth
                        ? formatDate(user.dateOfBirth)
                        : "Not provided"}
                    </strong>
                  </div>

                  <div>
                    <span>Gender</span>
                    <strong>
                      {user.gender || "Not provided"}
                    </strong>
                  </div>

                  <div>
                    <span>Blood Group</span>
                    <strong>
                      {user.bloodGroup || "Not provided"}
                    </strong>
                  </div>

                </div>

                <div className="appointment-details">

                  <div>
                    <span>Address</span>
                    <strong>
                      {user.address || "Not provided"}
                    </strong>
                  </div>

                </div>

                <h2>
                  Emergency Contact
                </h2>

                <div className="appointment-details">

                  <div>
                    <span>Name</span>
                    <strong>
                      {user.emergencyContact?.name ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div>
                    <span>Phone</span>
                    <strong>
                      {user.emergencyContact?.phone ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div>
                    <span>Relationship</span>
                    <strong>
                      {user.emergencyContact?.relationship ||
                        "Not provided"}
                    </strong>
                  </div>

                </div>
              </>
            )}

            {/* DOCTOR INFORMATION */}
            {user.role === "doctor" && (
              <>
                <h2>
                  Doctor Information
                </h2>

                <div className="appointment-details">

                  <div>
                    <span>Specialization</span>
                    <strong>
                      {user.specialization ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div>
                    <span>Experience</span>
                    <strong>
                      {user.yearsOfExperience || 0} years
                    </strong>
                  </div>

                  <div>
                    <span>License Number</span>
                    <strong>
                      {user.licenseNumber ||
                        "Not provided"}
                    </strong>
                  </div>

                </div>

                <div className="appointment-details">

                  <div>
                    <span>Hospital</span>
                    <strong>
                      {user.hospital ||
                        "Not provided"}
                    </strong>
                  </div>

                </div>

                <div>
                  <span>Bio</span>

                  <p>
                    {user.bio || "No biography provided."}
                  </p>
                </div>
              </>
            )}

          </article>

        </section>

      </main>

    </div>
  );
}

export default AdminUserDetails;

