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
    return new Date(date).toLocaleDateString("en-GH", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const isAdmin = user?.role === "admin";

  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-content">

          <div className="dashboard-message">
            Loading medical record...
          </div>

        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">

        <main className="dashboard-content">

          <div className="error-message">
            {error}
          </div>

          <Link
            to="/medical-records"
            className="back-button"
          >
            ← Back to Medical Records
          </Link>

        </main>

      </div>
    );
  }

  if (!record) {
    return null;
  }

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <header className="dashboard-header">

        <Link
          to={
            isAdmin
              ? "/admin/dashboard"
              : "/dashboard"
          }
          className="dashboard-logo"
        >
          Health<span>Connect</span>
        </Link>

        <Link
          to="/medical-records"
          className="back-button"
        >
          ← Medical Records
        </Link>

      </header>

      <main className="dashboard-content">

        {/* INTRO */}
        <section className="dashboard-welcome">

          <p className="eyebrow">
            {isAdmin
              ? "ADMIN PORTAL"
              : "HEALTHCARE"}
          </p>

          <h1>
            Medical Record Details
          </h1>

          <p>
            Complete information about this
            medical record.
          </p>

        </section>

        {/* RECORD */}
        <section className="medical-records-list">

          <article className="medical-record-card">

            {/* HEADER */}
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

            {/* PATIENT */}
            {record.patient && (
              <div className="record-section">

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

            {/* DOCTOR */}
            {record.doctor && (
              <div className="record-section">

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

            {/* SYMPTOMS */}
            <div className="record-section">

              <span>Symptoms</span>

              <p>
                {record.symptoms ||
                  "Not provided"}
              </p>

            </div>

            {/* TREATMENT */}
            <div className="record-section">

              <span>Treatment</span>

              <p>
                {record.treatment ||
                  "Not provided"}
              </p>

            </div>

            {/* NOTES */}
            <div className="record-section">

              <span>
                Doctor's Notes
              </span>

              <p>
                {record.notes ||
                  "No notes provided."}
              </p>

            </div>

            {/* DOCUMENTS */}
            {record.documents &&
              record.documents.length > 0 && (
                <div className="record-section">

                  <span>
                    Documents
                  </span>

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

        </section>

      </main>
    </div>
  );
}

export default MedicalRecordDetails;