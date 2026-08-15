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

      const appointments = response.data.appointments || [];

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        "Medical record created successfully!"
      );

      setFormData({
        patientId: "",
        diagnosis: "",
        symptoms: "",
        treatment: "",
        notes: "",
      });

      setDocuments([]);

      document.getElementById(
        "documents"
      ).value = "";

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

        <Link
          to="/dashboard"
          className="back-button"
        >
          ← Dashboard
        </Link>

      </header>

      <main className="dashboard-content">

        {/* INTRO */}
        <section className="dashboard-welcome">

          <p className="eyebrow">
            DOCTOR PORTAL
          </p>

          <h1>
            Medical Records
          </h1>

          <p>
            Create and manage medical records
            for your patients.
          </p>

        </section>

        {/* CREATE RECORD */}
        <section className="booking-section">

          <h2>
            Create Medical Record
          </h2>

          <form
            onSubmit={handleSubmit}
            className="booking-form"
          >

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

            {/* PATIENT */}
            <div className="form-group">

              <label htmlFor="patientId">
                Select Patient
              </label>

              <select
                id="patientId"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
              >

                <option value="">
                  Select a patient
                </option>

                {patients.map((patient) => (
                  <option
                    key={patient._id}
                    value={patient._id}
                  >
                    {patient.fullName}{" "}
                    {patient.email
                      ? `- ${patient.email}`
                      : ""}
                  </option>
                ))}

              </select>

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
                rows="4"
                value={formData.symptoms}
                onChange={handleChange}
                placeholder="Describe the patient's symptoms"
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
                rows="4"
                value={formData.treatment}
                onChange={handleChange}
                placeholder="Enter treatment provided"
              />

            </div>

            {/* NOTES */}
            <div className="form-group">

              <label htmlFor="notes">
                Additional Notes
              </label>

              <textarea
                id="notes"
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes (optional)"
              />

            </div>

            {/* DOCUMENTS */}
            <div className="form-group">

              <label htmlFor="documents">
                Medical Documents
              </label>

              <input
                id="documents"
                type="file"
                multiple
                onChange={handleFileChange}
              />

              <small>
                You can upload up to 5 documents.
              </small>

            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={creating}
            >
              {creating
                ? "Creating..."
                : "Create Medical Record"}
            </button>

          </form>

        </section>

        {/* EXISTING RECORDS */}
        <section className="appointments-section">

          <h2>
            Existing Medical Records
          </h2>

          {loading && (
            <div className="dashboard-message">
              Loading medical records...
            </div>
          )}

          {!loading &&
            records.length === 0 && (
              <div className="empty-state">

                <h3>
                  No medical records yet
                </h3>

                <p>
                  Medical records you create
                  will appear here.
                </p>

              </div>
            )}

          {!loading &&
            records.length > 0 && (
              <div className="appointments-list">

                {records.map((record) => (
                  <div
                    className="appointment-card"
                    key={record._id}
                  >

                    <div className="appointment-main">

                      <div>

                        <span className="appointment-label">
                          Patient
                        </span>

                        <h2>
                          {record.patient?.fullName ||
                            "Patient"}
                        </h2>

                        <p>
                          {record.patient?.email || ""}
                        </p>

                      </div>

                      <span className="status-badge status-confirmed">
                        Medical Record
                      </span>

                    </div>

                    <div className="appointment-details">

                      <div>
                        <span>
                          Diagnosis
                        </span>

                        <strong>
                          {record.diagnosis}
                        </strong>
                      </div>

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

                      <div>
                        <span>
                          Created
                        </span>

                        <strong>
                          {formatDate(
                            record.createdAt
                          )}
                        </strong>
                      </div>

                    </div>

                    {record.notes && (
                      <div className="dashboard-message">

                        <strong>
                          Notes
                        </strong>

                        <p>
                          {record.notes}
                        </p>

                      </div>
                    )}

                  </div>
                ))}

              </div>
            )}

        </section>

      </main>

    </div>
  );
}

export default DoctorMedicalRecords;