import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Appointments() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    doctorId: "",
    appointmentDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(true);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // FETCH APPOINTMENTS
  // ==========================================

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/appointments");

      setAppointments(response.data);
    } catch (error) {
      console.error("Fetch appointments error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH DOCTORS
  // ==========================================

  const fetchDoctors = async () => {
    try {
      setDoctorsLoading(true);

      const response = await api.get("/users/doctors");

      setDoctors(response.data);
    } catch (error) {
      console.error("Fetch doctors error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load doctors."
      );
    } finally {
      setDoctorsLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchAppointments();

    if (user?.role === "patient") {
      fetchDoctors();
    }
  }, [user?.role]);

  // ==========================================
  // FORM HANDLING
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // BOOK APPOINTMENT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setBooking(true);
      setError("");
      setSuccess("");

      await api.post("/appointments", formData);

      setSuccess(
        "Appointment booked successfully."
      );

      setFormData({
        doctorId: "",
        appointmentDate: "",
        reason: "",
      });

      await fetchAppointments();
    } catch (error) {
      console.error(
        "Book appointment error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to book appointment."
      );
    } finally {
      setBooking(false);
    }
  };

  // ==========================================
  // UPDATE APPOINTMENT STATUS
  // ==========================================

  const updateStatus = async (
    appointmentId,
    status
  ) => {
    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      await api.patch(
        `/appointments/${appointmentId}/status`,
        {
          status,
        }
      );

      setSuccess(
        `Appointment ${status} successfully.`
      );

      await fetchAppointments();
    } catch (error) {
      console.error(
        "Update appointment status error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update appointment."
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // CANCEL APPOINTMENT
  // ==========================================

  const cancelAppointment = async (
    appointmentId,
    cancelReason
  ) => {
    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      await api.patch(
        `/appointments/${appointmentId}/cancel`,
        {
          cancelReason,
        }
      );

      setSuccess(
        "Appointment cancelled successfully."
      );

      await fetchAppointments();
    } catch (error) {
      console.error(
        "Cancel appointment error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to cancel appointment."
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleString(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  // ==========================================
  // ADMIN / DOCTOR VIEW
  // ==========================================

  if (
    user?.role === "doctor" ||
    user?.role === "admin"
  ) {
    const isAdmin = user?.role === "admin";

    return (
      <div className="dashboard-page">
        <header className="dashboard-header">
          <Link
            to="/dashboard"
            className="dashboard-logo"
          >
            Health<span>Connect</span>
          </Link>

          <div className="dashboard-user">
            <div className="dashboard-user-info">
              <strong>
                {user?.fullName || "User"}
              </strong>

              <span>
                {isAdmin ? "Admin" : "Doctor"}
              </span>
            </div>

            <Link
              to={
                isAdmin
                  ? "/admin/profile"
                  : "/doctor/profile"
              }
              className="back-button"
            >
              Profile
            </Link>
          </div>
        </header>

        <main className="dashboard-content">
          <section className="dashboard-welcome">
            <span className="eyebrow">
              {isAdmin
                ? "ADMIN APPOINTMENTS"
                : "DOCTOR APPOINTMENTS"}
            </span>

            <h1>
              {isAdmin
                ? "Manage Appointments"
                : "Your Appointments"}
            </h1>

            <p>
              {isAdmin
                ? "Review and manage appointments across HealthConnect."
                : "Review your appointments and manage their status."}
            </p>
          </section>

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

          {loading && (
            <div className="dashboard-message">
              Loading appointments...
            </div>
          )}

          {!loading &&
            appointments.length === 0 && (
              <div className="empty-state">
                <h3>
                  No appointments yet
                </h3>

                <p>
                  {isAdmin
                    ? "Appointments will appear here when patients book with doctors."
                    : "Patients who book appointments with you will appear here."}
                </p>
              </div>
            )}

          {!loading &&
            appointments.length > 0 && (
              <section className="appointments-section">
                <h2>
                  {isAdmin
                    ? "All Appointments"
                    : "Your Appointments"}
                </h2>

                <div className="appointments-list">
                  {appointments.map(
                    (appointment) => (
                      <div
                        className="appointment-card"
                        key={appointment._id}
                      >
                        <div className="appointment-main">
                          <div>
                            <span className="appointment-label">
                              Patient
                            </span>

                            <h2>
                              {appointment.patient
                                ?.fullName ||
                                "Patient"}
                            </h2>

                            {appointment.patient
                              ?.email && (
                              <p>
                                {
                                  appointment
                                    .patient
                                    .email
                                }
                              </p>
                            )}

                            {appointment.patient
                              ?.phone && (
                              <p>
                                {
                                  appointment
                                    .patient
                                    .phone
                                }
                              </p>
                            )}
                          </div>

                          <span
                            className={`status-badge status-${appointment.status}`}
                          >
                            {appointment.status}
                          </span>
                        </div>

                        <div className="appointment-details">
                          <div>
                            <span>
                              Date & Time
                            </span>

                            <strong>
                              {formatDate(
                                appointment.appointmentDate
                              )}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Reason
                            </span>

                            <strong>
                              {appointment.reason ||
                                "Not provided"}
                            </strong>
                          </div>
                        </div>

                        <div className="quick-actions">
                          {appointment.status ===
                            "pending" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(
                                  appointment._id,
                                  "confirmed"
                                )
                              }
                              disabled={updating}
                            >
                              {updating
                                ? "Updating..."
                                : "Confirm"}
                            </button>
                          )}

                          {appointment.status ===
                            "confirmed" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(
                                  appointment._id,
                                  "completed"
                                )
                              }
                              disabled={updating}
                            >
                              {updating
                                ? "Updating..."
                                : "Mark Completed"}
                            </button>
                          )}

                          {appointment.status !==
                            "cancelled" &&
                            appointment.status !==
                              "completed" && (
                              <button
                                type="button"
                                onClick={() => {
                                  const confirmed =
                                    window.confirm(
                                      "Are you sure you want to cancel this appointment?"
                                    );

                                  if (confirmed) {
                                    cancelAppointment(
                                      appointment._id,
                                      isAdmin
                                        ? "Cancelled by admin"
                                        : "Cancelled by doctor"
                                    );
                                  }
                                }}
                                disabled={updating}
                              >
                                {updating
                                  ? "Cancelling..."
                                  : "Cancel"}
                              </button>
                            )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}
        </main>
      </div>
    );
  }

  // ==========================================
  // PATIENT VIEW
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

        <div className="dashboard-user">
          <div className="dashboard-user-info">
            <strong>
              {user?.fullName || "Patient"}
            </strong>

            <span>Patient</span>
          </div>

          <Link
            to="/profile"
            className="back-button"
          >
            Profile
          </Link>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-welcome">
          <span className="eyebrow">
            PATIENT APPOINTMENTS
          </span>

          <h1>Appointments</h1>

          <p>
            Book an appointment with a doctor
            and manage your upcoming visits.
          </p>
        </section>

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

        {/* ======================================
            BOOK APPOINTMENT
        ====================================== */}

        <section className="booking-section">
          <span className="eyebrow">
            NEW APPOINTMENT
          </span>

          <h2>Book an Appointment</h2>

          <form
            onSubmit={handleSubmit}
            className="booking-form"
          >
            <div className="form-group">
              <label htmlFor="doctorId">
                Doctor
              </label>

              <select
                id="doctorId"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                disabled={
                  doctorsLoading || booking
                }
                required
              >
                <option value="">
                  {doctorsLoading
                    ? "Loading doctors..."
                    : "Select a doctor"}
                </option>

                {doctors.map((doctor) => (
                  <option
                    key={doctor._id}
                    value={doctor._id}
                  >
                    {doctor.fullName}
                    {doctor.specialization
                      ? ` - ${doctor.specialization}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="appointmentDate">
                Date and Time
              </label>

              <input
                id="appointmentDate"
                type="datetime-local"
                name="appointmentDate"
                value={
                  formData.appointmentDate
                }
                onChange={handleChange}
                min={new Date()
                  .toISOString()
                  .slice(0, 16)}
                disabled={booking}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reason">
                Reason for Appointment
              </label>

              <textarea
                id="reason"
                name="reason"
                rows="4"
                placeholder="Briefly describe why you need an appointment..."
                value={formData.reason}
                onChange={handleChange}
                disabled={booking}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={
                booking ||
                doctorsLoading ||
                doctors.length === 0
              }
            >
              {booking
                ? "Booking..."
                : "Book Appointment"}
            </button>
          </form>
        </section>

        {/* ======================================
            PATIENT APPOINTMENT LIST
        ====================================== */}

        <section className="appointments-section">
          <span className="eyebrow">
            APPOINTMENT HISTORY
          </span>

          <h2>My Appointments</h2>

          {loading && (
            <div className="dashboard-message">
              Loading appointments...
            </div>
          )}

          {!loading &&
            appointments.length === 0 && (
              <div className="empty-state">
                <h3>
                  No appointments yet
                </h3>

                <p>
                  Your booked appointments
                  will appear here.
                </p>
              </div>
            )}

          {!loading &&
            appointments.length > 0 && (
              <div className="appointments-list">
                {appointments.map(
                  (appointment) => (
                    <div
                      className="appointment-card"
                      key={appointment._id}
                    >
                      <div className="appointment-main">
                        <div>
                          <span className="appointment-label">
                            Appointment
                          </span>

                          <h2>
                            {appointment.doctor
                              ?.fullName ||
                              "Doctor"}
                          </h2>

                          {appointment.doctor
                            ?.email && (
                            <p>
                              {
                                appointment
                                  .doctor
                                  .email
                              }
                            </p>
                          )}

                          {appointment.doctor
                            ?.specialization && (
                            <p>
                              {
                                appointment
                                  .doctor
                                  .specialization
                              }
                            </p>
                          )}
                        </div>

                        <span
                          className={`status-badge status-${appointment.status}`}
                        >
                          {appointment.status}
                        </span>
                      </div>

                      <div className="appointment-details">
                        <div>
                          <span>
                            Date & Time
                          </span>

                          <strong>
                            {formatDate(
                              appointment.appointmentDate
                            )}
                          </strong>
                        </div>

                        {appointment.reason && (
                          <div>
                            <span>
                              Reason
                            </span>

                            <strong>
                              {
                                appointment.reason
                              }
                            </strong>
                          </div>
                        )}
                      </div>

                      {/* PATIENT ACTIONS */}

                      {appointment.status !==
                        "cancelled" &&
                        appointment.status !==
                          "completed" && (
                          <div className="appointment-actions">
                            <button
                              type="button"
                              className="appointment-cancel-button"
                              onClick={() => {
                                const confirmed =
                                  window.confirm(
                                    "Are you sure you want to cancel this appointment?"
                                  );

                                if (confirmed) {
                                  cancelAppointment(
                                    appointment._id,
                                    "Cancelled by patient"
                                  );
                                }
                              }}
                              disabled={updating}
                            >
                              {updating
                                ? "Cancelling..."
                                : "Cancel Appointment"}
                            </button>
                          </div>
                        )}
                    </div>
                  )
                )}
              </div>
            )}
        </section>
      </main>
    </div>
  );
}

export default Appointments;