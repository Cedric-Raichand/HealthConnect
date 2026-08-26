import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Prescriptions() {
  const { user } = useAuth();

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/prescriptions");

      setPrescriptions(
        response.data.prescriptions || []
      );
    } catch (error) {
      console.error("Prescriptions error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load prescriptions."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <header className="dashboard-header">

        <Link
          to={isAdmin ? "/admin/dashboard" : "/dashboard"}
          className="dashboard-logo"
        >
          Health<span>Connect</span>
        </Link>

        <Link
          to={isAdmin ? "/admin/dashboard" : "/dashboard"}
          className="back-button"
        >
          ← {isAdmin ? "Admin Dashboard" : "Dashboard"}
        </Link>

      </header>

      {/* CONTENT */}
      <main className="dashboard-content">

        {/* PAGE INTRO */}
        <section className="dashboard-welcome">

          <p className="eyebrow">
            {isAdmin ? "ADMIN PORTAL" : "HEALTHCARE"}
          </p>

          <h1>
            {isAdmin
              ? "All Prescriptions"
              : "My Prescriptions"}
          </h1>

          <p>
            {isAdmin
              ? "View prescriptions issued to patients across HealthConnect."
              : "View medicines prescribed by your doctors."}
          </p>

        </section>

        {/* LOADING */}
        {loading && (
          <div className="dashboard-message">
            Loading prescriptions...
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
          prescriptions.length === 0 && (
            <div className="empty-state">

              <h2>
                {isAdmin
                  ? "No prescriptions found"
                  : "No prescriptions yet"}
              </h2>

              <p>
                {isAdmin
                  ? "There are currently no prescriptions in the system."
                  : "Your prescriptions will appear here when a doctor prescribes medication for you."}
              </p>

            </div>
          )}

        {/* PRESCRIPTIONS */}
        {!loading &&
          !error &&
          prescriptions.length > 0 && (
            <section className="appointments-section">

              <h2>
                {isAdmin
                  ? `All Prescriptions (${prescriptions.length})`
                  : "Your Prescriptions"}
              </h2>

              <div className="appointments-list">

                {prescriptions.map((prescription) => (

                  <div
                    className="appointment-card"
                    key={prescription._id}
                  >

                    {/* TOP */}
                    <div className="appointment-main">

                      <div>

                        <span className="appointment-label">
                          Prescription
                        </span>

                        <h2>
                          {prescription.medicine}
                        </h2>

                        {/* PATIENT - ADMIN ONLY */}
                        {isAdmin &&
                          prescription.patient && (
                            <p>
                              Patient:{" "}
                              <strong>
                                {prescription.patient.fullName}
                              </strong>
                            </p>
                          )}

                        {/* DOCTOR */}
                        {prescription.doctor && (
                          <p>
                            Prescribed by{" "}
                            <strong>
                              {prescription.doctor.fullName}
                            </strong>
                          </p>
                        )}

                      </div>

                      <span className="status-badge status-confirmed">
                        Active
                      </span>

                    </div>

                    {/* DETAILS */}
                    <div className="appointment-details">

                      <div>
                        <span>Dosage</span>

                        <strong>
                          {prescription.dosage}
                        </strong>
                      </div>

                      <div>
                        <span>Frequency</span>

                        <strong>
                          {prescription.frequency}
                        </strong>
                      </div>

                      <div>
                        <span>Duration</span>

                        <strong>
                          {prescription.duration}
                        </strong>
                      </div>

                      <div>
                        <span>Date Prescribed</span>

                        <strong>
                          {formatDate(
                            prescription.createdAt
                          )}
                        </strong>
                      </div>

                    </div>

                    {/* ADMIN PATIENT DETAILS */}
                    {isAdmin &&
                      prescription.patient && (
                        <div className="appointment-details">

                          <div>
                            <span>Patient Email</span>

                            <strong>
                              {prescription.patient.email ||
                                "Not provided"}
                            </strong>
                          </div>

                          <div>
                            <span>Patient Phone</span>

                            <strong>
                              {prescription.patient.phone ||
                                "Not provided"}
                            </strong>
                          </div>

                        </div>
                      )}

                    {/* DOCTOR DETAILS */}
                    {isAdmin &&
                      prescription.doctor && (
                        <div className="appointment-details">

                          <div>
                            <span>Doctor Email</span>

                            <strong>
                              {prescription.doctor.email ||
                                "Not provided"}
                            </strong>
                          </div>

                          <div>
                            <span>Doctor Phone</span>

                            <strong>
                              {prescription.doctor.phone ||
                                "Not provided"}
                            </strong>
                          </div>

                        </div>
                      )}

                    {/* INSTRUCTIONS */}
                    {prescription.instructions && (
                      <div className="appointment-details">

                        <div>
                          <span>Instructions</span>

                          <strong>
                            {prescription.instructions}
                          </strong>
                        </div>

                      </div>
                    )}

                  </div>

                ))}

              </div>

            </section>
          )}

      </main>

    </div>
  );
}

export default Prescriptions;