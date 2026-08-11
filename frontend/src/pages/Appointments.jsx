import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get("/appointments");

        setAppointments(response.data.appointments || response.data);
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

    fetchAppointments();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GH", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <Link to="/dashboard" className="dashboard-logo">
          Health<span>Connect</span>
        </Link>

        <Link to="/dashboard" className="back-button">
          ← Dashboard
        </Link>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-welcome">
          <p className="eyebrow">HEALTHCARE</p>

          <h1>My Appointments</h1>

          <p>
            View your scheduled and previous appointments.
          </p>
        </section>

        {loading && (
          <div className="dashboard-message">
            Loading appointments...
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading && !error && appointments.length === 0 && (
          <div className="empty-state">
            <h2>No appointments yet</h2>

            <p>
              You don't have any appointments at the moment.
            </p>

            <button className="primary-button">
              Book an Appointment
            </button>
          </div>
        )}

        {!loading && !error && appointments.length > 0 && (
          <div className="appointments-list">
            {appointments.map((appointment) => (
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
                      {appointment.doctor?.fullName ||
                        "Doctor"}
                    </h2>

                    {appointment.doctor?.email && (
                      <p>
                        {appointment.doctor.email}
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
                    <span>Date</span>

                    <strong>
                      {formatDate(
                        appointment.appointmentDate
                      )}
                    </strong>
                  </div>

                  {appointment.reason && (
                    <div>
                      <span>Reason</span>

                      <strong>
                        {appointment.reason}
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Appointments;