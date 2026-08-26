
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
    return new Date(date).toLocaleDateString("en-GH", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isAdmin = user?.role === "admin";
  const isDoctor = user?.role === "doctor";

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

      <main className="dashboard-content">

        {/* PAGE INTRO */}
        <section className="dashboard-welcome">

          <p className="eyebrow">
            {isAdmin
              ? "ADMIN PORTAL"
              : isDoctor
              ? "HEALTHCARE"
              : "HEALTHCARE"}
          </p>

          <h1>
            {isAdmin
              ? "Manage Medical Records"
              : isDoctor
              ? "Patient Medical Records"
              : "Medical Records"}
          </h1>

          <p>
            {isAdmin
              ? "View and monitor all medical records across HealthConnect."
              : isDoctor
              ? "View medical records created for your patients."
              : "View your medical history, diagnoses, treatments and other healthcare information."}
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

              <h2>
                No medical records yet
              </h2>

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

              <h2>
                {isAdmin
                  ? `All Medical Records (${records.length})`
                  : isDoctor
                  ? "Your Medical Records"
                  : "Your Medical Records"}
              </h2>

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

                  {/* ADMIN / DOCTOR / PATIENT INFORMATION */}
                  <div className="record-section">

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

                  <div className="record-section">

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
                  {record.notes && (
                    <div className="record-section">

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

                  {/* VIEW DETAILS */}
                  <div className="quick-actions">

                    <Link
                      to={`/medical-records/${record._id}`}
                    >
                      View Full Record
                    </Link>

                  </div>

                </article>
              ))}

            </section>
          )}

      </main>

    </div>
  );
}

export default MedicalRecords;
