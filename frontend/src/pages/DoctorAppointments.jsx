import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Get appointments belonging to the logged-in doctor
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/appointments");

      setAppointments(
        response.data.appointments || []
      );
    } catch (error) {
      console.error(
        "Doctor appointments error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  // Update appointment status
  const updateStatus = async (appointmentId, status) => {
    try {
      setUpdatingId(appointmentId);
      setError("");

      await api.patch(
        `/appointments/${appointmentId}/status`,
        {
          status,
        }
      );

      // Refresh appointments after update
      await fetchAppointments();

    } catch (error) {
      console.error(
        "Update appointment error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update appointment."
      );
    } finally {
      setUpdatingId(null);
    }
  };

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

        {/* INTRO */}
        <section className="dashboard-welcome">

          <p className="eyebrow">
            DOCTOR PORTAL
          </p>

          <h1>
            My Appointments
          </h1>

          <p>
            View and manage appointments booked
            by your patients.
          </p>

        </section>

        {/* LOADING */}
        {loading && (
          <div className="dashboard-message">
            Loading appointments...
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading &&
          !error &&
          appointments.length === 0 && (
            <div className="empty-state">

              <h2>
                No appointments yet
              </h2>

              <p>
                Appointments booked by patients
                will appear here.
              </p>

            </div>
          )}

        {/* APPOINTMENTS */}
        {!loading &&
          appointments.length > 0 && (

            <section className="appointments-section">

              <h2>
                Patient Appointments
              </h2>

              <div className="appointments-list">

                {appointments.map(
                  (appointment) => (

                    <div
                      className="appointment-card"
                      key={appointment._id}
                    >

                      {/* TOP */}
                      <div className="appointment-main">

                        <div>

                          <span className="appointment-label">
                            Appointment
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
                                appointment.patient
                                  .email
                              }
                            </p>
                          )}

                          {appointment.patient
                            ?.phone && (
                            <p>
                              {
                                appointment.patient
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

                      {/* DETAILS */}
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
                              {appointment.reason}
                            </strong>

                          </div>
                        )}

                      </div>

                      {/* ACTIONS */}
                      <div className="quick-actions">

                        {appointment.status ===
                          "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(
                                  appointment._id,
                                  "confirmed"
                                )
                              }
                              disabled={
                                updatingId ===
                                appointment._id
                              }
                            >
                              {updatingId ===
                              appointment._id
                                ? "Updating..."
                                : "Confirm"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(
                                  appointment._id,
                                  "cancelled"
                                )
                              }
                              disabled={
                                updatingId ===
                                appointment._id
                              }
                            >
                              Cancel
                            </button>
                          </>
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
                            disabled={
                              updatingId ===
                              appointment._id
                            }
                          >
                            {updatingId ===
                            appointment._id
                              ? "Updating..."
                              : "Mark Completed"}
                          </button>
                        )}

                        {appointment.status ===
                          "completed" && (
                          <span>
                            Appointment completed
                          </span>
                        )}

                        {appointment.status ===
                          "cancelled" && (
                          <span>
                            Appointment cancelled
                          </span>
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

export default DoctorAppointments;