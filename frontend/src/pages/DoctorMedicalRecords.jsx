import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function DoctorMedicalRecords() {
  const [patients, setPatients] = useState([]);
  const [records, setRecords] = useState([]);

  const [formData, setFormData] = useState({
    patientId: "",
    diagnosis: "",
    symptoms: "",
    treatment: "",
    notes: "",
  });

  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPatients();
    fetchRecords();
  }, []);

  // Get patients who have appointments with this doctor
  const fetchPatients = async () => {
    try {
      const response = await api.get("/appointments");

      const appointments =
        response.data.appointments || [];

      const uniquePatients = [];

      appointments.forEach((appointment) => {
        if (
          appointment.patient &&
          !uniquePatients.some(
            (patient) =>
              patient._id === appointment.patient._id
          )
        ) {
          uniquePatients.push(appointment.patient);
        }
      });

      setPatients(uniquePatients);
    } catch (error) {
      console.error("Patients error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load patients."
      );
    }
  };

  // Get doctor's existing medical records
  const fetchRecords = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/medical-records"
      );

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

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setDocuments(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.patientId ||
      !formData.diagnosis ||
      !formData.symptoms ||
      !formData.treatment
    ) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    try {
      setCreating(true);

      const data = new FormData();

      data.append(
        "patientId",
        formData.patientId
      );

      data.append(
        "diagnosis",
        formData.diagnosis
      );

      data.append(
        "symptoms",
        formData.symptoms
      );

      data.append(
        "treatment",
        formData.treatment
      );

      data.append(
        "notes",
        formData.notes
      );

      documents.forEach((file) => {
        data.append("documents", file);
      });

      await api.post("/medical-records", data);

      setSuccess(
        "Medical record created successfully."
      );

      setFormData({
        patientId: "",
        diagnosis: "",
        symptoms: "",
        treatment: "",
        notes: "",
      });

      setDocuments([]);

      const fileInput =
        document.getElementById("documents");

      if (fileInput) {
        fileInput.value = "";
      }

      await fetchRecords();
    } catch (error) {
      console.error(
        "Create medical record error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to create medical record."
      );
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleDateString(
      "en-GH",
      {
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

        <div className="dashboard-user">
          <div className="dashboard-user-info">
            <strong>Doctor Portal</strong>
            <span>Doctor</span>
          </div>

          <Link
            to="/dashboard"
            className="back-button"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="dashboard-content">
        {/* INTRO */}
        <section className="dashboard-welcome">
          <span className="eyebrow">
            DOCTOR PORTAL
          </span>

          <h1>Medical Records</h1>

          <p>
            Create and manage medical records
            for your patients.
          </p>
        </section>

        {/* CREATE RECORD */}
        <section className="doctor-record-create">
          <div className="doctor-record-create-header">
            <div>
              <span className="eyebrow">
                NEW RECORD
              </span>

              <h2>
                Create Medical Record
              </h2>

              <p>
                Add clinical information and
                supporting documents for a
                patient.
              </p>
            </div>

            <div className="doctor-record-step">
              01
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="doctor-record-form"
          >
            {/* PATIENT */}
            <div className="form-group">
              <label htmlFor="patientId">
                Patient
              </label>

              <select
                id="patientId"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                disabled={creating}
                required
              >
                <option value="">
                  Select a patient
                </option>

                {patients.map((patient) => (
                  <option
                    key={patient._id}
                    value={patient._id}
                  >
                    {patient.fullName}
                    {patient.email
                      ? ` — ${patient.email}`
                      : ""}
                  </option>
                ))}
              </select>

              {patients.length === 0 && (
                <small className="form-help">
                  Patients with appointments
                  will appear here.
                </small>
              )}
            </div>

            {/* DIAGNOSIS */}
            <div className="form-group">
              <label htmlFor="diagnosis">
                Diagnosis
              </label>

              <input
                id="diagnosis"
                type="text"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                placeholder="Enter diagnosis"
                disabled={creating}
                required
              />
            </div>

            {/* SYMPTOMS */}
            <div className="form-group">
              <label htmlFor="symptoms">
                Symptoms
              </label>

              <textarea
                id="symptoms"
                name="symptoms"
                rows="5"
                value={formData.symptoms}
                onChange={handleChange}
                placeholder="Describe the patient's symptoms"
                disabled={creating}
                required
              />
            </div>

            {/* TREATMENT */}
            <div className="form-group">
              <label htmlFor="treatment">
                Treatment
              </label>

              <textarea
                id="treatment"
                name="treatment"
                rows="5"
                value={formData.treatment}
                onChange={handleChange}
                placeholder="Enter treatment provided"
                disabled={creating}
                required
              />
            </div>

            {/* NOTES */}
            <div className="form-group doctor-record-full-width">
              <label htmlFor="notes">
                Additional Notes
              </label>

              <textarea
                id="notes"
                name="notes"
                rows="4"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional clinical notes (optional)"
                disabled={creating}
              />
            </div>

            {/* DOCUMENTS */}
            <div className="form-group doctor-record-full-width">
              <label htmlFor="documents">
                Medical Documents
              </label>

              <input
                id="documents"
                type="file"
                multiple
                onChange={handleFileChange}
                disabled={creating}
              />

              <small className="form-help">
                Upload up to 5 supporting medical
                documents.
              </small>

              {documents.length > 0 && (
                <div className="selected-documents">
                  <span>
                    {documents.length}{" "}
                    {documents.length === 1
                      ? "file"
                      : "files"}{" "}
                    selected
                  </span>

                  <div>
                    {documents.map(
                      (file, index) => (
                        <p key={index}>
                          📄 {file.name}
                        </p>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="doctor-record-form-action">
              <button
                type="submit"
                className="auth-button"
                disabled={creating}
              >
                {creating
                  ? "Creating Record..."
                  : "Create Medical Record"}
              </button>
            </div>
          </form>
        </section>

        {/* EXISTING RECORDS */}
        <section className="doctor-existing-records">
          <div className="medical-records-heading">
            <div>
              <span className="eyebrow">
                RECORD HISTORY
              </span>

              <h2>
                Existing Medical Records
              </h2>
            </div>

            <span className="medical-record-count">
              {records.length}{" "}
              {records.length === 1
                ? "record"
                : "records"}
            </span>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="dashboard-message medical-records-loading">
              <div className="dashboard-spinner"></div>

              <span>
                Loading medical records...
              </span>
            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            records.length === 0 && (
              <div className="empty-state">
                <div className="medical-records-empty-icon">
                  +
                </div>

                <h3>
                  No medical records yet
                </h3>

                <p>
                  Medical records you create
                  for patients will appear here.
                </p>
              </div>
            )}

          {/* RECORDS */}
          {!loading &&
            records.length > 0 && (
              <div className="doctor-record-list">
                {records.map((record) => (
                  <article
                    className="doctor-record-card"
                    key={record._id}
                  >
                    <div className="doctor-record-card-header">
                      <div>
                        <span className="medical-record-label">
                          PATIENT
                        </span>

                        <h3>
                          {record.patient
                            ?.fullName ||
                            "Patient"}
                        </h3>

                        {record.patient?.email && (
                          <p>
                            {
                              record.patient
                                .email
                            }
                          </p>
                        )}
                      </div>

                      <span className="status-badge status-confirmed">
                        Medical Record
                      </span>
                    </div>

                    <div className="doctor-record-summary">
                      <div>
                        <span>Diagnosis</span>

                        <strong>
                          {record.diagnosis ||
                            "Not provided"}
                        </strong>
                      </div>

                      <div>
                        <span>Symptoms</span>

                        <strong>
                          {record.symptoms ||
                            "Not provided"}
                        </strong>
                      </div>

                      <div>
                        <span>Treatment</span>

                        <strong>
                          {record.treatment ||
                            "Not provided"}
                        </strong>
                      </div>

                      <div>
                        <span>Created</span>

                        <strong>
                          {formatDate(
                            record.createdAt
                          )}
                        </strong>
                      </div>
                    </div>

                    {record.notes && (
                      <div className="doctor-record-notes">
                        <span>
                          Doctor's Notes
                        </span>

                        <p>
                          {record.notes}
                        </p>
                      </div>
                    )}

                    <div className="doctor-record-card-footer">
                      <Link
                        to={`/doctor/medical-records/${record._id}`}
                        className="medical-record-view-button"
                      >
                        View Full Record
                        <span>→</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </section>
      </main>
    </div>
  );
}

export default DoctorMedicalRecords;