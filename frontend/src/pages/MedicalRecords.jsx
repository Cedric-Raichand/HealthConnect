import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/medical-records");

      setRecords(
        response.data.records || []
      );
    } catch (error) {
      console.error(
        "Medical records error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load medical records."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-GH",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
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

        {/* PAGE INTRO */}

        <section className="dashboard-welcome">

          <p className="eyebrow">
            HEALTHCARE
          </p>

          <h1>Medical Records</h1>

          <p>
            View your medical history and records
            provided by your healthcare professionals.
          </p>

        </section>

        {/* LOADING */}

        {loading && (
          <div className="dashboard-message">
            Loading your medical records...
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
          records.length === 0 && (
            <section className="empty-state">

              <h2>
                No medical records yet
              </h2>

              <p>
                Your medical records will appear
                here when a doctor creates one for
                you.
              </p>

            </section>
          )}

        {/* RECORDS */}

        {!loading &&
          !error &&
          records.length > 0 && (

            <section className="appointments-section">

              <div className="section-header">
                <h2>
                  Your Medical History
                </h2>

                <span>
                  {records.length}{" "}
                  {records.length === 1
                    ? "record"
                    : "records"}
                </span>
              </div>

              <div className="appointments-list">

                {records.map((record) => (

                  <article
                    className="appointment-card"
                    key={record._id}
                  >

                    {/* RECORD HEADER */}

                    <div className="appointment-main">

                      <div>

                        <span className="appointment-label">
                          Medical Record
                        </span>

                        <h2>
                          {record.diagnosis}
                        </h2>

                        {record.doctor && (
                          <p>
                            Doctor:{" "}
                            {record.doctor.fullName ||
                              "Healthcare professional"}
                          </p>
                        )}

                      </div>

                      <span className="status-badge">
                        {formatDate(
                          record.createdAt
                        )}
                      </span>

                    </div>

                    {/* RECORD DETAILS */}

                    <div className="appointment-details">

                      <div>
                        <span>
                          Symptoms
                        </span>

                        <strong>
                          {record.symptoms}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Treatment
                        </span>

                        <strong>
                          {record.treatment}
                        </strong>
                      </div>

                    </div>

                    {/* NOTES */}

                    {record.notes && (
                      <div className="record-notes">

                        <span>
                          Doctor's Notes
                        </span>

                        <p>
                          {record.notes}
                        </p>

                      </div>
                    )}

                    {/* DOCUMENTS */}

                    {record.documents &&
                      record.documents.length > 0 && (

                        <div className="record-documents">

                          <span>
                            Documents
                          </span>

                          <div>

                            {record.documents.map(
                              (document, index) => (
                                <a
                                  key={
                                    document._id ||
                                    index
                                  }
                                  href={
                                    document.filePath
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  📄{" "}
                                  {document.fileName ||
                                    `Document ${
                                      index + 1
                                    }`}
                                </a>
                              )
                            )}

                          </div>

                        </div>
                      )}

                  </article>

                ))}

              </div>

            </section>
          )}

      </main>

    </div>
  );
}

export default MedicalRecords;