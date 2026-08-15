import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Prescriptions() {
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

      {/* CONTENT */}
      <main className="dashboard-content">

        <section className="dashboard-welcome">
          <p className="eyebrow">HEALTHCARE</p>

          <h1>My Prescriptions</h1>

          <p>
            View medicines prescribed by your doctors.
          </p>
        </section>

        {/* LOADING */}
        {loading && (
          <div className="dashboard-message">
            Loading prescriptions...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading &&
          !error &&
          prescriptions.length === 0 && (
            <div className="empty-state">
              <h2>No prescriptions yet</h2>

              <p>
                Your prescriptions will appear here
                when a doctor prescribes medication for you.
              </p>
            </div>
          )}

        {/* PRESCRIPTIONS */}
        {!loading &&
          !error &&
          prescriptions.length > 0 && (
            <section className="appointments-section">

              <h2>
                Your Prescriptions
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