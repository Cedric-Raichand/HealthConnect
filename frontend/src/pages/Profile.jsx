import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  const dashboardPath =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "doctor"
      ? "/dashboard"
      : "/dashboard";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    bloodGroup: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/users/profile");
        const userData = response.data;

        setFormData({
          fullName: userData.fullName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          dateOfBirth: userData.dateOfBirth
            ? userData.dateOfBirth.split("T")[0]
            : "",
          gender: userData.gender || "",
          address: userData.address || "",
          bloodGroup: userData.bloodGroup || "",
          emergencyContact: {
            name: userData.emergencyContact?.name || "",
            phone: userData.emergencyContact?.phone || "",
            relationship:
              userData.emergencyContact?.relationship || "",
          },
        });
      } catch (error) {
        console.error("Profile error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setError("");
    setSuccess("");

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEmergencyChange = (e) => {
    const { name, value } = e.target;

    setError("");
    setSuccess("");

    setFormData((previous) => ({
      ...previous,
      emergencyContact: {
        ...previous.emergencyContact,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setSaving(true);

      await api.put("/users/profile", {
        fullName: formData.fullName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender,
        address: formData.address,
        bloodGroup: formData.bloodGroup,
        emergencyContact: formData.emergencyContact,
      });

      setSuccess("Profile updated successfully!");
    } catch (error) {
      console.error("Update profile error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <header className="dashboard-header">
          <Link to={dashboardPath} className="dashboard-logo">
            Health<span>Connect</span>
          </Link>

          <Link to={dashboardPath} className="back-button">
            ← Dashboard
          </Link>
        </header>

        <main className="dashboard-content">
          <div className="profile-loading">
            <div className="profile-loading-icon">👤</div>
            <h2>Loading your profile...</h2>
            <p>Please wait while we retrieve your information.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <Link to={dashboardPath} className="dashboard-logo">
          Health<span>Connect</span>
        </Link>

        <Link to={dashboardPath} className="back-button">
          ← Dashboard
        </Link>
      </header>

      <main className="dashboard-content">
        <section className="profile-page-header">
          <div>
            <p className="eyebrow">ACCOUNT</p>
            <h1>My Profile</h1>
            <p>
              Manage your personal and emergency healthcare
              information.
            </p>
          </div>

          <div className="profile-role-badge">
            {user?.role || "user"}
          </div>
        </section>

        <section className="profile-form-card">
          <div className="profile-section-header">
            <div className="profile-section-icon">👤</div>
            <div>
              <h2>Personal Information</h2>
              <p>
                Keep your personal details up to date.
              </p>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="profile-form-grid">
              <div className="form-group">
                <label htmlFor="fullName">
                  Full Name
                </label>

                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                />

                <small>
                  Email address cannot be changed here.
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="0241234567"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">
                  Date of Birth
                </label>

                <input
                  id="dateOfBirth"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">
                  Gender
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="bloodGroup">
                  Blood Group
                </label>

                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                >
                  <option value="">
                    Select blood group
                  </option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="form-group profile-full-width">
                <label htmlFor="address">
                  Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  placeholder="Your residential address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="profile-divider" />

            <div className="profile-section-header">
              <div className="profile-section-icon">🚨</div>
              <div>
                <h2>Emergency Contact</h2>
                <p>
                  Someone we can contact in an emergency.
                </p>
              </div>
            </div>

            <div className="profile-form-grid">
              <div className="form-group">
                <label htmlFor="emergencyName">
                  Contact Name
                </label>

                <input
                  id="emergencyName"
                  type="text"
                  name="name"
                  placeholder="Emergency contact name"
                  value={formData.emergencyContact.name}
                  onChange={handleEmergencyChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="emergencyPhone">
                  Contact Phone
                </label>

                <input
                  id="emergencyPhone"
                  type="tel"
                  name="phone"
                  placeholder="Emergency contact phone"
                  value={formData.emergencyContact.phone}
                  onChange={handleEmergencyChange}
                />
              </div>

              <div className="form-group profile-full-width">
                <label htmlFor="relationship">
                  Relationship
                </label>

                <input
                  id="relationship"
                  type="text"
                  name="relationship"
                  placeholder="e.g. Mother, Father, Spouse"
                  value={
                    formData.emergencyContact.relationship
                  }
                  onChange={handleEmergencyChange}
                />
              </div>
            </div>

            <div className="profile-form-actions">
              <button
                type="submit"
                className="auth-button profile-save-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>

              <Link
                to={dashboardPath}
                className="profile-cancel-button"
              >
                Cancel
              </Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Profile;