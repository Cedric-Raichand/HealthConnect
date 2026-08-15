import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Appointments() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    doctor: "",
    appointmentDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [doctorsError, setDoctorsError] = useState("");

  // ==========================================
  // LOAD APPOINTMENTS
  // ==========================================

  useEffect(() => {
    fetchAppointments();

    if (user?.role === "patient") {
      fetchDoctors();
    }
  }, [user]);

  // ==========================================
  // GET APPOINTMENTS
  // ==========================================

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/appointments");

      setAppointments(
        response.data.appointments || response.data
      );
    } catch (error) {
      console.error("Appointments error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET DOCTORS
  // ==========================================

  const fetchDoctors = async () => {
    try {
      setDoctorsError("");

      const response = await api.get("/users/doctors");

      setDoctors(
        response.data.doctors || response.data
      );
    } catch (error) {
      console.error("Doctors error:", error);

      setDoctorsError(
        error.response?.data?.message ||
          "Unable to load doctors."
      );
    }
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // BOOK APPOINTMENT
  // PATIENT ONLY
  // ==========================================

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.doctor ||
      !formData.appointmentDate ||
      !formData.reason
    ) {
      setError(
        "Please fill in all appointment fields."
      );
      return;
    }

    const selectedDate = new Date(
      formData.appointmentDate
    );

    if (selectedDate <= new Date()) {
      setError(
        "Please select a future date and time."
      );
      return;
    }

    try {
      setBooking(true);

      const appointmentData = {
        doctorId: formData.doctor,
        appointmentDate:
          selectedDate.toISOString(),
        reason: formData.reason,
      };

      console.log(
        "Sending appointment data:",
        appointmentData
      );

      await api.post(
        "/appointments",
        appointmentData
      );

      setSuccess(
        "Appointment booked successfully!"
      );

      setFormData({
        doctor: "",
        appointmentDate: "",
        reason: "",
      });

      await fetchAppointments();
    } catch (error) {
      console.error(
        "Booking error:",
        error
      );

      console.log(
        "Backend response:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.msg ||
          "Unable to book appointment."
      );
    } finally {
      setBooking(false);
    }
  };

  // ==========================================
  // UPDATE APPOINTMENT STATUS
  // DOCTOR ONLY
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
        "Status update error:",
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
  // DOCTOR ONLY
  // ==========================================

  const cancelAppointment = async (
    appointmentId
  ) => {
    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      await api.patch(
        `/appointments/${appointmentId}/cancel`,
        {
          cancelReason:
            "Cancelled by doctor",
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
    return new Date(date).toLocaleString(
      "en-GH",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  // ==========================================
  // DOCTOR VIEW
  // ==========================================

  if (user?.role === "doctor") {
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
            <p className="eyebrow">
              HEALTHCARE
            </p>

            <h1>
              Patient Appointments
            </h1>

            <p>
              View and manage appointments booked
              with you.
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
                  Patients who book appointments
                  with you will appear here.
                </p>
              </div>
            )}

          {!loading &&
            appointments.length > 0 && (
              <section className="appointments-section">
                <h2>
                  Your Appointments
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
                            {
                              appointment.status
                            }
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
                              {
                                appointment.reason
                              }
                            </strong>
                          </div>
                        </div>

                        {/* Doctor Actions */}

                        <div className="quick-actions">
                          {appointment.status ===
                            "pending" && (
                            <button
                              onClick={() =>
                                updateStatus(
                                  appointment._id,
                                  "confirmed"
                                )
                              }
                              disabled={updating}
                            >
                              Confirm
                            </button>
                          )}

                          {appointment.status ===
                            "confirmed" && (
                            <button
                              onClick={() =>
                                updateStatus(
                                  appointment._id,
                                  "completed"
                                )
                              }
                              disabled={updating}
                            >
                              Mark Completed
                            </button>
                          )}

                          {appointment.status !==
                            "cancelled" &&
                            appointment.status !==
                              "completed" && (
                              <button
                                onClick={() =>
                                  cancelAppointment(
                                    appointment._id
                                  )
                                }
                                disabled={updating}
                              >
                                Cancel
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

        <Link
          to="/dashboard"
          className="back-button"
        >
          ← Dashboard
        </Link>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-welcome">
          <p className="eyebrow">
            HEALTHCARE
          </p>

          <h1>
            My Appointments
          </h1>

          <p>
            Book and manage your healthcare
            appointments.
          </p>
        </section>

        {/* ======================================
            BOOK APPOINTMENT
        ====================================== */}

        <section className="booking-section">
          <h2>
            Book an Appointment
          </h2>

          <form
            onSubmit={
              handleBookAppointment
            }
            className="booking-form"
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

            {doctorsError && (
              <div className="error-message">
                {doctorsError}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="doctor">
                Select Doctor
              </label>

              <select
                id="doctor"
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                disabled={
                  doctors.length === 0
                }
              >
                <option value="">
                  {doctors.length === 0
                    ? "No doctors available"
                    : "Select a doctor"}
                </option>

                {doctors.map(
                  (doctor) => (
                    <option
                      key={doctor._id}
                      value={doctor._id}
                    >
                      {doctor.fullName}

                      {doctor.specialization
                        ? ` - ${doctor.specialization}`
                        : ""}
                    </option>
                  )
                )}
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
                value={
                  formData.reason
                }
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={
                booking ||
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
          <h2>
            My Appointments
          </h2>

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
                        </div>

                        <span
                          className={`status-badge status-${appointment.status}`}
                        >
                          {
                            appointment.status
                          }
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