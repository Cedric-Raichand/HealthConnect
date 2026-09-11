import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function MedicalRecords() {
  const { user } = useAuth();

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
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleDateString("en-GH", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isAdmin = user?.role === "admin";
  const isDoctor = user?.role === "doctor";

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

        <div className="dashboard-user">
          <div className="dashboard-user-info">
            <strong>
              {user?.fullName || "User"}
            </strong>

            <span>
              {isAdmin
                ? "Admin"
                : isDoctor
                ? "Doctor"
                : "Patient"}
            </span>
          </div>

          <Link
            to={dashboardPath}
            className="back-button"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="dashboard-content">
        {/* PAGE INTRO */}
        <section className="dashboard-welcome">
          <span className="eyebrow">
            {isAdmin
              ? "ADMIN PORTAL"
              : isDoctor
              ? "HEALTHCARE"
              : "HEALTHCARE"}
          </span>

          <h1>
            {isAdmin
              ? "Manage Medical Records"
              : isDoctor
              ? "Patient Medical Records"
              : "Medical Records"}
          </h1>

          <p>
            {isAdmin
              ? "View and monitor medical records across HealthConnect."
              : isDoctor
              ? "View medical records created for your patients."
              : "View your medical history, diagnoses, treatments and other healthcare information."}
          </p>
        </section>

        {/* ERROR */}
        {!loading && error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="dashboard-message medical-records-loading">
            <div className="dashboard-spinner"></div>
            <span>Loading medical records...</span>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading &&
          !error &&
          records.length === 0 && (
            <div className="empty-state medical-records-empty">
              <div className="medical-records-empty-icon">
                +
              </div>

              <h2>No medical records yet</h2>

              <p>
                {isAdmin
                  ? "There are currently no medical records in HealthConnect."
                  : isDoctor
                  ? "Medical records you create for patients will appear here."
                  : "Your medical records will appear here after a doctor creates one for you."}
              </p>
            </div>
          )}

        {/* RECORDS */}
        {!loading &&
          !error &&
          records.length > 0 && (
            <section className="medical-records-list">
              <div className="medical-records-heading">
                <div>
                  <span className="eyebrow">
                    RECORD HISTORY
                  </span>

                  <h2>
                    {isAdmin
                      ? "All Medical Records"
                      : "Your Medical Records"}
                  </h2>
                </div>

                <span className="medical-record-count">
                  {records.length}{" "}
                  {records.length === 1
                    ? "record"
                    : "records"}
                </span>
              </div>

              <div className="medical-records-grid">
                {records.map((record) => (
                  <article
                    className="medical-record-card"
                    key={record._id}
                  >
                    {/* RECORD HEADER */}
                    <div className="medical-record-header">
                      <div className="medical-record-title">
                        <span className="medical-record-label">
                          MEDICAL RECORD
                        </span>

                        <h2>
                          {record.diagnosis ||
                            "Diagnosis unavailable"}
                        </h2>

                        <p>
                          Created on{" "}
                          {formatDate(
                            record.createdAt
                          )}
                        </p>
                      </div>
                    </div>

                    {/* PEOPLE */}
                    <div className="medical-record-people">
                      <div className="record-person">
                        <span>Patient</span>

                        <strong>
                          {record.patient?.fullName ||
                            "Not available"}
                        </strong>

                        {record.patient?.email && (
                          <p>
                            {record.patient.email}
                          </p>
                        )}

                        {record.patient?.phone && (
                          <p>
                            {record.patient.phone}
                          </p>
                        )}
                      </div>

                      <div className="record-person">
                        <span>Doctor</span>

                        <strong>
                          {record.doctor?.fullName ||
                            "Not available"}
                        </strong>

                        {record.doctor?.email && (
                          <p>
                            {record.doctor.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* MEDICAL INFORMATION */}
                    <div className="medical-record-information">
                      <div className="record-section">
                        <span>Symptoms</span>

                        <p>
                          {record.symptoms ||
                            "Not provided"}
                        </p>
                      </div>

                      <div className="record-section">
                        <span>Treatment</span>

                        <p>
                          {record.treatment ||
                            "Not provided"}
                        </p>
                      </div>

                      {record.notes && (
                        <div className="record-section">
                          <span>
                            Doctor's Notes
                          </span>

                          <p>{record.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* DOCUMENTS */}
                    {record.documents &&
                      record.documents.length > 0 && (
                        <div className="record-documents">
                          <span>Documents</span>

                          <div className="document-list">
                            {record.documents.map(
                              (
                                document,
                                index
                              ) => (
                                <div
                                  className="document-item"
                                  key={index}
                                >
                                  <span className="document-icon">
                                    📄
                                  </span>

                                  <span>
                                    {
                                      document.fileName
                                    }
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* ACTION */}
                    <div className="medical-record-action">
                      <Link
                        to={`/medical-records/${record._id}`}
                        className="medical-record-view-button"
                      >
                        View Full Record
                        <span>→</span>
                      </Link>
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

export default MedicalRecords;