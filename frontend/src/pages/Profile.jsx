import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, setUser } = useAuth();

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
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users/profile");

      const profile = response.data;

      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth)
              .toISOString()
              .split("T")[0]
          : "",
        gender: profile.gender || "",
        address: profile.address || "",
        bloodGroup: profile.bloodGroup || "",
        emergencyContact: {
          name: profile.emergencyContact?.name || "",
          phone: profile.emergencyContact?.phone || "",
          relationship:
            profile.emergencyContact?.relationship || "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.fullName || !formData.phone) {
      setError(
        "Full name and phone number are required."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await api.put("/users/profile", {
        fullName: formData.fullName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender,
        address: formData.address,
        bloodGroup: formData.bloodGroup,
        emergencyContact: formData.emergencyContact,
      });

      setSuccess(
        response.data.message ||
          "Profile updated successfully."
      );

      // Update the basic user information stored
      // in AuthContext/localStorage.
      if (response.data.user) {
        const updatedUser = {
          ...user,
          ...response.data.user,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        if (setUser) {
          setUser(updatedUser);
        }
      }

      await fetchProfile();
    } catch (error) {
      console.error("Profile update error:", error);

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
        <section className="dashboard-welcome">
          <p className="eyebrow">HEALTHCARE</p>

          <h1>My Profile</h1>

          <p>
            View and update your personal healthcare
            information.
          </p>
        </section>

        <section className="profile-section">
          <form
            onSubmit={handleSubmit}
            className="profile-form"
          >
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

            <h2>Personal Information</h2>

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
                placeholder="Your full name"
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
                value={formData.phone}
                onChange={handleChange}
                placeholder="0240000000"
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

            <div className="form-group">
              <label htmlFor="address">
                Address
              </label>

              <textarea
                id="address"
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                placeholder="Your residential address"
              />
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

            <h2>Emergency Contact</h2>

            <div className="form-group">
              <label htmlFor="emergencyName">
                Contact Name
              </label>

              <input
                id="emergencyName"
                type="text"
                name="name"
                value={
                  formData.emergencyContact.name
                }
                onChange={handleEmergencyChange}
                placeholder="Emergency contact name"
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
                value={
                  formData.emergencyContact.phone
                }
                onChange={handleEmergencyChange}
                placeholder="Emergency contact phone"
              />
            </div>

            <div className="form-group">
              <label htmlFor="emergencyRelationship">
                Relationship
              </label>

              <input
                id="emergencyRelationship"
                type="text"
                name="relationship"
                value={
                  formData.emergencyContact
                    .relationship
                }
                onChange={handleEmergencyChange}
                placeholder="e.g. Mother, Father, Spouse"
              />
            </div>

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