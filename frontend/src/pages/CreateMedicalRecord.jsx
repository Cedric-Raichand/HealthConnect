import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateMedicalRecord() {
  const navigate = useNavigate();

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

      const appointments =
        response.data.appointments || [];

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
      console.error(
        "Patients error:",
        error
      );

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
  };

  // ==========================================
  // HANDLE FILES
  // ==========================================

  const handleFileChange = (e) => {
    setDocuments(
      Array.from(e.target.files)
    );
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
      setSaving(true);

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

      await api.post(
        "/medical-records",
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

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

      // Reset file input
      document.getElementById(
        "documents"
      ).value = "";

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
            Create Medical Record
          </h1>

          <p>
            Create a medical record for one of
            your patients.
          </p>
        </section>

        {/* FORM */}

        <section className="booking-section">

          <h2>
            Patient Medical Record
          </h2>

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
              <h3>
                No patients found
              </h3>

              <p>
                Patients who have booked
                appointments with you will
                appear here.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="booking-form"
            >

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

                  {patients.map(
                    (patient) => (
                      <option
                        key={patient._id}
                        value={patient._id}
                      >
                        {patient.fullName}
                        {patient.email
                          ? ` - ${patient.email}`
                          : ""}
                      </option>
                    )
                  )}
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
                  placeholder="Enter diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
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
                  placeholder="Describe the patient's symptoms..."
                  value={formData.symptoms}
                  onChange={handleChange}
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
                  placeholder="Describe the recommended treatment..."
                  value={formData.treatment}
                  onChange={handleChange}
                />
              </div>

              {/* NOTES */}

              <div className="form-group">
                <label htmlFor="notes">
                  Doctor's Notes
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  rows="4"
                  placeholder="Additional notes..."
                  value={formData.notes}
                  onChange={handleChange}
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
                  You can upload up to 5
                  documents.
                </small>

                {documents.length > 0 && (
                  <div>
                    {documents.map(
                      (file, index) => (
                        <p key={index}>
                          📄 {file.name}
                        </p>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="auth-button"
                disabled={saving}
              >
                {saving
                  ? "Creating Record..."
                  : "Create Medical Record"}
              </button>

            </form>
          )}
        </section>
      </main>
    </div>
  );
}

export default CreateMedicalRecord;