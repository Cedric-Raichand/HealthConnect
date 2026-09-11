import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function MedicalRecordDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";
  const isDoctor = user?.role === "doctor";

  const recordsPath = isAdmin
    ? "/admin/medical-records"
    : isDoctor
    ? "/doctor/medical-records"
    : "/medical-records";

  const dashboardPath = isAdmin
    ? "/admin/dashboard"
    : "/dashboard";

  useEffect(() => {
    fetchMedicalRecord();
  }, [id]);

  const fetchMedicalRecord = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/medical-records/${id}`
      );

      setRecord(response.data);
    } catch (error) {
      console.error(
        "Medical record details error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load medical record."
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
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
            to={recordsPath}
            className="back-button"
          >
            ← Medical Records
          </Link>
        </div>
      </header>

      <main className="dashboard-content">
        {/* PAGE INTRO */}
        <section className="dashboard-welcome">
          <span className="eyebrow">
            {isAdmin
              ? "ADMIN PORTAL"
              : "HEALTHCARE"}
          </span>

          <h1>Medical Record Details</h1>

          <p>
            Complete information about this medical
            record.
          </p>
        </section>

        {/* LOADING */}
        {loading && (
          <div className="dashboard-message medical-record-details-loading">
            <div className="dashboard-spinner"></div>

            <span>
              Loading medical record...
            </span>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <section className="medical-record-details-error">
            <div className="error-message">
              {error}
            </div>

            <Link
              to={recordsPath}
              className="back-button"
            >
              ← Back to Medical Records
            </Link>
          </section>
        )}

        {/* RECORD */}
        {!loading && !error && record && (
          <section className="medical-record-detail-container">
            {/* RECORD HEADER */}
            <article className="medical-record-detail-card">
              <div className="medical-record-detail-header">
                <div>
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

                <div className="medical-record-detail-date">
                  <span>Record Date</span>

                  <strong>
                    {formatDate(
                      record.createdAt
                    )}
                  </strong>
                </div>
              </div>

              {/* PEOPLE */}
              <div className="medical-record-detail-people">
                {record.patient && (
                  <div className="record-person">
                    <span>Patient</span>

                    <strong>
                      {record.patient.fullName ||
                        "Patient"}
                    </strong>

                    {record.patient.email && (
                      <p>
                        {record.patient.email}
                      </p>
                    )}

                    {record.patient.phone && (
                      <p>
                        {record.patient.phone}
                      </p>
                    )}
                  </div>
                )}

                {record.doctor && (
                  <div className="record-person">
                    <span>Doctor</span>

                    <strong>
                      {record.doctor.fullName ||
                        "Doctor"}
                    </strong>

                    {record.doctor.email && (
                      <p>
                        {record.doctor.email}
                      </p>
                    )}

                    {record.doctor.phone && (
                      <p>
                        {record.doctor.phone}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* MEDICAL INFORMATION */}
              <div className="medical-record-detail-body">
                <div className="detail-information-section">
                  <div className="detail-section-heading">
                    <span>01</span>
                    <h3>Symptoms</h3>
                  </div>

                  <p>
                    {record.symptoms ||
                      "No symptoms provided."}
                  </p>
                </div>

                <div className="detail-information-section">
                  <div className="detail-section-heading">
                    <span>02</span>
                    <h3>Treatment</h3>
                  </div>

                  <p>
                    {record.treatment ||
                      "No treatment information provided."}
                  </p>
                </div>

                <div className="detail-information-section">
                  <div className="detail-section-heading">
                    <span>03</span>
                    <h3>Doctor's Notes</h3>
                  </div>

                  <p>
                    {record.notes ||
                      "No notes provided."}
                  </p>
                </div>
              </div>

              {/* DOCUMENTS */}
              {record.documents &&
                record.documents.length > 0 && (
                  <div className="medical-record-detail-documents">
                    <div className="detail-section-heading">
                      <span>04</span>
                      <h3>Documents</h3>
                    </div>

                    <div className="detail-document-list">
                      {record.documents.map(
                        (document, index) => (
                          <div
                            className="detail-document-item"
                            key={index}
                          >
                            <div className="detail-document-info">
                              <span className="document-icon">
                                📄
                              </span>

                              <div>
                                <strong>
                                  {
                                    document.fileName
                                  }
                                </strong>

                                <p>
                                  Medical document
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* FOOTER ACTION */}
              <div className="medical-record-detail-footer">
                <Link
                  to={recordsPath}
                  className="medical-record-view-button"
                >
                  ← Back to Medical Records
                </Link>
              </div>
            </article>
          </section>
        )}
      </main>
    </div>
  );
}

export default MedicalRecordDetails;