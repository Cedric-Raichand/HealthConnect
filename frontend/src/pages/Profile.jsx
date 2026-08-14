import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Profile() {
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

  // ==========================================
  // GET PROFILE
  // ==========================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/users/profile");

        const user = response.data;

        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
          dateOfBirth: user.dateOfBirth
            ? user.dateOfBirth.split("T")[0]
            : "",
          gender: user.gender || "",
          address: user.address || "",
          bloodGroup: user.bloodGroup || "",
          emergencyContact: {
            name: user.emergencyContact?.name || "",
            phone: user.emergencyContact?.phone || "",
            relationship:
              user.emergencyContact?.relationship || "",
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

  // ==========================================
  // HANDLE NORMAL INPUTS
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE EMERGENCY CONTACT
  // ==========================================

  const handleEmergencyChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      emergencyContact: {
        ...previous.emergencyContact,
        [name]: value,
      },
    }));
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setSaving(true);

      const response = await api.put(
        "/users/profile",
        {
          fullName: formData.fullName,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth || null,
          gender: formData.gender,
          address: formData.address,
          bloodGroup: formData.bloodGroup,
          emergencyContact: formData.emergencyContact,
        }
      );

      console.log(
        "Profile updated:",
        response.data
      );

      setSuccess(
        "Profile updated successfully!"
      );
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="dashboard-page">
        <header className="dashboard-header">
          <Link
            to="/dashboard"
            className="dashboard-logo"
          >
            Health<span>Connect</span>
          </Link>

          <Link
            to="/dashboard"
            className="back-button"
          >
            ← Dashboard
          </Link>
        </header>

        <main className="dashboard-content">
          <div className="dashboard-message">
            Loading your profile...
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <Link
          to="/dashboard"
          className="dashboard-logo"
        >
          Health<span>Connect</span>
        </Link>

        <Link
          to="/dashboard"
          className="back-button"
        >
          ← Dashboard
        </Link>
      </header>

      <main className="dashboard-content">

        {/* HEADER */}

        <section className="dashboard-welcome">
          <p className="eyebrow">
            HEALTHCARE
          </p>

          <h1>My Profile</h1>

          <p>
            View and update your personal healthcare
            information.
          </p>
        </section>

        {/* PROFILE FORM */}

        <section className="booking-section">

          <h2>Personal Information</h2>

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

          <form
            onSubmit={handleSubmit}
            className="booking-form"
          >

            {/* FULL NAME */}

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

            {/* EMAIL */}

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

            {/* PHONE */}

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

            {/* DATE OF BIRTH */}

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

            {/* GENDER */}

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

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            {/* ADDRESS */}

            <div className="form-group">
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

            {/* BLOOD GROUP */}

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

            {/* EMERGENCY CONTACT */}

            <h2>
              Emergency Contact
            </h2>

            <div className="form-group">
              <label htmlFor="emergencyName">
                Contact Name
              </label>

              <input
                id="emergencyName"
                type="text"
                name="name"
                placeholder="Emergency contact name"
                value={
                  formData.emergencyContact.name
                }
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
                value={
                  formData.emergencyContact.phone
                }
                onChange={handleEmergencyChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="relationship">
                Relationship
              </label>

              <input
                id="relationship"
                type="text"
                name="relationship"
                placeholder="e.g. Mother, Father, Spouse"
                value={
                  formData.emergencyContact
                    .relationship
                }
                onChange={handleEmergencyChange}
              />
            </div>

            {/* SAVE */}

            <button
              type="submit"
              className="auth-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Profile"}
            </button>

          </form>
        </section>
      </main>
    </div>
  );
}

export default Profile;