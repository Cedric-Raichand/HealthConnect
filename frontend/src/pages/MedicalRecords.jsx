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

      setRecords(response.data.records || []);
    } catch (error) {
      console.error("Medical records error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load medical records."
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

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="dashboard-header">
        <Link to="/dashboard" className="dashboard-logo">
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
          <p className="eyebrow">HEALTHCARE</p>

          <h1>Medical Records</h1>

          <p>
            View your medical history, diagnoses,
            treatments and other healthcare information.
          </p>
        </section>

        {/* LOADING */}
        {loading && (
          <div className="dashboard-message">
            Loading medical records...
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
            <div className="empty-state">
              <h2>No medical records yet</h2>

              <p>
                Your medical records will appear here
                after a doctor creates one for you.
              </p>
            </div>
          )}

        {/* RECORDS */}
        {!loading &&
          !error &&
          records.length > 0 && (
            <section className="medical-records-list">
              {records.map((record) => (
                <article
                  className="medical-record-card"
                  key={record._id}
                >
                  {/* RECORD HEADER */}
                  <div className="medical-record-header">
                    <div>
                      <span className="appointment-label">
                        Medical Record
                      </span>

                      <h2>
                        {record.diagnosis}
                      </h2>

                      <p>
                        Created on{" "}
                        {formatDate(record.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* DOCTOR */}
                  {record.doctor && (
                    <div className="record-section">
                      <span>Doctor</span>

                      <strong>
                        {record.doctor.fullName ||
                          "Doctor"}
                      </strong>

                      {record.doctor.email && (
                        <p>{record.doctor.email}</p>
                      )}
                    </div>
                  )}

                  {/* SYMPTOMS */}
                  <div className="record-section">
                    <span>Symptoms</span>

                    <p>
                      {record.symptoms}
                    </p>
                  </div>

                  {/* TREATMENT */}
                  <div className="record-section">
                    <span>Treatment</span>

                    <p>
                      {record.treatment}
                    </p>
                  </div>

                  {/* NOTES */}
                  {record.notes && (
                    <div className="record-section">
                      <span>Doctor's Notes</span>

                      <p>
                        {record.notes}
                      </p>
                    </div>
                  )}

                  {/* DOCUMENTS */}
                  {record.documents &&
                    record.documents.length > 0 && (
                      <div className="record-section">
                        <span>Documents</span>

                        <div>
                          {record.documents.map(
                            (document, index) => (
                              <p key={index}>
                                📄{" "}
                                {document.fileName}
                              </p>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </article>
              ))}
            </section>
          )}
      </main>
    </div>
  );
}

export default MedicalRecords;