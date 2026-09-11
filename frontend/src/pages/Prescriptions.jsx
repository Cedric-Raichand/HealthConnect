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
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isAdmin = user?.role === "admin";

  const dashboardPath = isAdmin
    ? "/admin/dashboard"
    : "/dashboard";

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="dashboard-header">
        <Link
          to={dashboardPath}
          className="dashboard-logo"
        >
          Health<span>Connect</span>
        </Link>

        <Link
          to={dashboardPath}
          className="back-button"
        >
          ← {isAdmin ? "Admin Dashboard" : "Dashboard"}
        </Link>
      </header>

      <main className="dashboard-content">
        {/* INTRO */}
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
              : "View medicines prescribed by your doctors and follow your treatment instructions."}
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
            <div className="empty-state prescription-empty-state">
              <div className="prescription-empty-icon">
                💊
              </div>

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

              {!isAdmin && (
                <Link
                  to="/appointments"
                  className="medical-record-view-button"
                >
                  View Appointments
                </Link>
              )}
            </div>
          )}

        {/* PRESCRIPTIONS */}
        {!loading &&
          !error &&
          prescriptions.length > 0 && (
            <section className="prescriptions-section">
              <div className="prescriptions-heading">
                <div>
                  <span className="medical-record-label">
                    MEDICATION
                  </span>

                  <h2>
                    {isAdmin
                      ? "Prescription Records"
                      : "Your Prescriptions"}
                  </h2>
                </div>

                <span className="prescription-count">
                  {prescriptions.length}{" "}
                  {prescriptions.length === 1
                    ? "prescription"
                    : "prescriptions"}
                </span>
              </div>

              <div className="prescriptions-grid">
                {prescriptions.map((prescription) => (
                  <article
                    className="prescription-card"
                    key={prescription._id}
                  >
                    {/* CARD HEADER */}
                    <div className="prescription-card-header">
                      <div>
                        <span className="prescription-label">
                          PRESCRIPTION
                        </span>

                        <h2>
                          {prescription.medicine}
                        </h2>

                        {isAdmin &&
                          prescription.patient && (
                            <p className="prescription-patient">
                              Patient:{" "}
                              <strong>
                                {
                                  prescription.patient
                                    .fullName
                                }
                              </strong>
                            </p>
                          )}

                        {prescription.doctor && (
                          <p className="prescription-doctor">
                            Prescribed by{" "}
                            <strong>
                              {
                                prescription.doctor
                                  .fullName
                              }
                            </strong>
                          </p>
                        )}
                      </div>

                      <div className="prescription-icon">
                        💊
                      </div>
                    </div>

                    {/* MEDICATION DETAILS */}
                    <div className="prescription-details">
                      <div className="prescription-detail">
                        <span>Dosage</span>
                        <strong>
                          {prescription.dosage ||
                            "Not provided"}
                        </strong>
                      </div>

                      <div className="prescription-detail">
                        <span>Frequency</span>
                        <strong>
                          {prescription.frequency ||
                            "Not provided"}
                        </strong>
                      </div>

                      <div className="prescription-detail">
                        <span>Duration</span>
                        <strong>
                          {prescription.duration ||
                            "Not provided"}
                        </strong>
                      </div>

                      <div className="prescription-detail">
                        <span>Date Prescribed</span>
                        <strong>
                          {formatDate(
                            prescription.createdAt
                          )}
                        </strong>
                      </div>
                    </div>

                    {/* INSTRUCTIONS */}
                    {prescription.instructions && (
                      <div className="prescription-instructions">
                        <span>Instructions</span>

                        <p>
                          {prescription.instructions}
                        </p>
                      </div>
                    )}

                    {/* ADMIN PATIENT DETAILS */}
                    {isAdmin &&
                      prescription.patient && (
                        <div className="prescription-contact-section">
                          <h3>Patient Information</h3>

                          <div className="prescription-contact-grid">
                            <div>
                              <span>Email</span>
                              <strong>
                                {prescription.patient
                                  .email ||
                                  "Not provided"}
                              </strong>
                            </div>

                            <div>
                              <span>Phone</span>
                              <strong>
                                {prescription.patient
                                  .phone ||
                                  "Not provided"}
                              </strong>
                            </div>
                          </div>
                        </div>
                      )}

                    {/* ADMIN DOCTOR DETAILS */}
                    {isAdmin &&
                      prescription.doctor && (
                        <div className="prescription-contact-section">
                          <h3>Doctor Information</h3>

                          <div className="prescription-contact-grid">
                            <div>
                              <span>Email</span>
                              <strong>
                                {prescription.doctor
                                  .email ||
                                  "Not provided"}
                              </strong>
                            </div>

                            <div>
                              <span>Phone</span>
                              <strong>
                                {prescription.doctor
                                  .phone ||
                                  "Not provided"}
                              </strong>
                            </div>
                          </div>
                        </div>
                      )}

                    {/* FOOTER */}
                    <div className="prescription-card-footer">
                      <span>
                        Prescription record
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
      </main>
    </div>
  );
}

export default Prescriptions;