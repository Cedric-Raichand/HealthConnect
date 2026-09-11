import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";

function CreateMedicalRecord() {
  const [patients, setPatients] = useState([]);

  const [formData, setFormData] = useState({
    patientId: "",
    diagnosis: "",
    symptoms: "",
    treatment: "",
    notes: "",
  });

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // GET PATIENTS
  // ==========================================

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/appointments");

      const appointments = response.data.appointments || [];

      // Get unique patients from appointments
      const uniquePatients = [];

      appointments.forEach((appointment) => {
        const patient = appointment.patient;

        if (
          patient &&
          !uniquePatients.some(
            (existingPatient) =>
              existingPatient._id === patient._id
          )
        ) {
          uniquePatients.push(patient);
        }
      });

      setPatients(uniquePatients);
    } catch (error) {
      console.error("Patients error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load patients."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear previous messages when doctor starts editing
    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  // ==========================================
  // HANDLE FILES
  // ==========================================

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 5) {
      setError("You can upload a maximum of 5 documents.");
      setDocuments(selectedFiles.slice(0, 5));
      return;
    }

    setError("");
    setDocuments(selectedFiles);
  };

  // ==========================================
  // CREATE MEDICAL RECORD
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.patientId ||
      !formData.diagnosis.trim() ||
      !formData.symptoms.trim() ||
      !formData.treatment.trim()
    ) {
      setError(
        "Please complete all required fields before creating the record."
      );
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      data.append("patientId", formData.patientId);
      data.append("diagnosis", formData.diagnosis);
      data.append("symptoms", formData.symptoms);
      data.append("treatment", formData.treatment);
      data.append("notes", formData.notes);

      documents.forEach((file) => {
        data.append("documents", file);
      });

      await api.post("/medical-records", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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

      // Reset file input
      const fileInput = document.getElementById("documents");

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error(
        "Medical record error:",
        error
      );

      console.log(
        "Backend response:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.msg ||
          "Unable to create medical record."
      );
    } finally {
      setSaving(false);
    }
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
          to="/doctor/medical-records"
          className="back-button"
        >
          ← Medical Records
        </Link>
      </header>

      <main className="dashboard-content">
        {/* INTRO */}
        <section className="dashboard-welcome">
          <p className="eyebrow">DOCTOR PORTAL</p>

          <h1>Create Medical Record</h1>

          <p>
            Record important clinical information for
            one of your patients.
          </p>
        </section>

        {/* FORM CARD */}
        <section className="doctor-create-record">
          <div className="doctor-create-record-header">
            <div>
              <span className="medical-record-label">
                NEW RECORD
              </span>

              <h2>Patient Medical Record</h2>

              <p>
                Complete the information below to create
                a medical record.
              </p>
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

          {loading ? (
            <div className="dashboard-message">
              Loading patients...
            </div>
          ) : patients.length === 0 ? (
            <div className="empty-state">
              <h3>No patients found</h3>

              <p>
                Patients who have booked appointments
                with you will appear here.
              </p>

              <Link
                to="/doctor/appointments"
                className="medical-record-view-button"
              >
                View Appointments
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="doctor-create-record-form"
            >
              {/* PATIENT */}
              <div className="form-group">
                <label htmlFor="patientId">
                  Patient <span>*</span>
                </label>

                <select
                  id="patientId"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  disabled={saving}
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
                        ? ` - ${patient.email}`
                        : ""}
                    </option>
                  ))}
                </select>

                <small>
                  Select a patient from your appointment
                  history.
                </small>
              </div>

              {/* DIAGNOSIS */}
              <div className="form-group">
                <label htmlFor="diagnosis">
                  Diagnosis <span>*</span>
                </label>

                <input
                  id="diagnosis"
                  type="text"
                  name="diagnosis"
                  placeholder="e.g. Malaria"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              {/* SYMPTOMS */}
              <div className="form-group">
                <label htmlFor="symptoms">
                  Symptoms <span>*</span>
                </label>

                <textarea
                  id="symptoms"
                  name="symptoms"
                  rows="5"
                  placeholder="Describe the patient's symptoms..."
                  value={formData.symptoms}
                  onChange={handleChange}
                  disabled={saving}
                />

                <small>
                  Include the symptoms reported or
                  observed during the consultation.
                </small>
              </div>

              {/* TREATMENT */}
              <div className="form-group">
                <label htmlFor="treatment">
                  Treatment <span>*</span>
                </label>

                <textarea
                  id="treatment"
                  name="treatment"
                  rows="5"
                  placeholder="Describe the recommended treatment..."
                  value={formData.treatment}
                  onChange={handleChange}
                  disabled={saving}
                />

                <small>
                  Include the treatment or care plan
                  provided to the patient.
                </small>
              </div>

              {/* NOTES */}
              <div className="form-group">
                <label htmlFor="notes">
                  Doctor's Notes
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  rows="5"
                  placeholder="Add any additional clinical notes..."
                  value={formData.notes}
                  onChange={handleChange}
                  disabled={saving}
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
                  disabled={saving}
                />

                <small>
                  Upload up to 5 medical documents.
                </small>

                {documents.length > 0 && (
                  <div className="selected-documents">
                    <strong>
                      Selected documents ({documents.length})
                    </strong>

                    {documents.map((file, index) => (
                      <div
                        className="selected-document"
                        key={`${file.name}-${index}`}
                      >
                        <span>📄</span>

                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="doctor-create-record-actions">
                <Link
                  to="/doctor/medical-records"
                  className="secondary-button"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="auth-button"
                  disabled={saving}
                >
                  {saving
                    ? "Creating Record..."
                    : "Create Medical Record"}
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}

export default CreateMedicalRecord;