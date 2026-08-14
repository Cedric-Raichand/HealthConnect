import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    doctor: "",
    appointmentDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [doctorsError, setDoctorsError] = useState("");

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  // ==========================================
  // GET LOGGED-IN PATIENT'S APPOINTMENTS
  // ==========================================

  const fetchAppointments = async () => {
    try {
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
  // GET AVAILABLE DOCTORS
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
  // HANDLE FORM INPUT
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // BOOK APPOINTMENT
  // ==========================================

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validate fields
    if (
      !formData.doctor ||
      !formData.appointmentDate ||
      !formData.reason.trim()
    ) {
      setError("Please fill in all appointment fields.");
      return;
    }

    // Convert selected date into JavaScript Date
    const selectedDate = new Date(
      formData.appointmentDate
    );

    // Make sure appointment is valid
    if (Number.isNaN(selectedDate.getTime())) {
      setError("Please select a valid appointment date.");
      return;
    }

    // Make sure appointment is in the future
    if (selectedDate <= new Date()) {
      setError(
        "Please select a future date and time."
      );
      return;
    }

    try {
      setBooking(true);

      // IMPORTANT:
      // Backend expects doctorId, NOT doctor
      const appointmentData = {
        doctorId: formData.doctor,
        appointmentDate: selectedDate.toISOString(),
        reason: formData.reason.trim(),
      };

      console.log(
        "Sending appointment data:",
        appointmentData
      );

      const response = await api.post(
        "/appointments",
        appointmentData
      );

      console.log(
        "Appointment response:",
        response.data
      );

      setSuccess(
        "Appointment booked successfully!"
      );

      // Clear form
      setFormData({
        doctor: "",
        appointmentDate: "",
        reason: "",
      });

      // Refresh appointment list
      await fetchAppointments();

    } catch (error) {
      console.error("Booking error:", error);

      // Show the COMPLETE backend response
      console.log(
        "Backend response:",
        JSON.stringify(
          error.response?.data,
          null,
          2
        )
      );

      // Get validation errors if backend returned them
      const backendErrors =
        error.response?.data?.errors;

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        const firstError = backendErrors[0];

        setError(
          firstError.message ||
            firstError.msg ||
            "Appointment validation failed."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to book appointment."
        );
      }

    } finally {
      setBooking(false);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-GH", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="dashboard-page">

      {/* HEADER */}
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

        {/* PAGE INTRO */}
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

        {/* ==========================================
            BOOK APPOINTMENT
        ========================================== */}

        <section className="booking-section">

          <h2>
            Book an Appointment
          </h2>

          <form
            onSubmit={handleBookAppointment}
            className="booking-form"
          >

            {/* ERROR */}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="success-message">
                {success}
              </div>
            )}

            {/* DOCTOR ERROR */}
            {doctorsError && (
              <div className="error-message">
                {doctorsError}
              </div>
            )}

            {/* DOCTOR */}
            <div className="form-group">

              <label htmlFor="doctor">
                Select Doctor
              </label>

              <select
                id="doctor"
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                disabled={doctors.length === 0}
              >

                <option value="">
                  {doctors.length === 0
                    ? "No doctors available"
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

            {/* DATE */}
            <div className="form-group">

              <label htmlFor="appointmentDate">
                Date and Time
              </label>

              <input
                id="appointmentDate"
                type="datetime-local"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                min={
                  new Date()
                    .toISOString()
                    .slice(0, 16)
                }
              />

            </div>

            {/* REASON */}
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
              />

            </div>

            {/* SUBMIT */}
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

        {/* ==========================================
            APPOINTMENT LIST
        ========================================== */}

        <section className="appointments-section">

          <h2>
            My Appointments
          </h2>

          {/* LOADING */}
          {loading && (
            <div className="dashboard-message">
              Loading appointments...
            </div>
          )}

          {/* EMPTY */}
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

          {/* APPOINTMENTS */}
          {!loading &&
            appointments.length > 0 && (

              <div className="appointments-list">

                {appointments.map(
                  (appointment) => (

                    <div
                      className="appointment-card"
                      key={appointment._id}
                    >

                      {/* MAIN INFO */}
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
                              {appointment.doctor.email}
                            </p>

                          )}

                        </div>

                        {/* STATUS */}
                        <span
                          className={`status-badge status-${appointment.status}`}
                        >
                          {appointment.status}
                        </span>

                      </div>

                      {/* DETAILS */}
                      <div className="appointment-details">

                        {/* DATE */}
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

                        {/* REASON */}
                        {appointment.reason && (

                          <div>

                            <span>
                              Reason
                            </span>

                            <strong>
                              {appointment.reason}
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