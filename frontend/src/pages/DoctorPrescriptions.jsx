import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function DoctorPrescriptions() {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState("");

  const [formData, setFormData] = useState({
    medicine: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  });

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // GET MEDICAL RECORDS
  // ==========================================

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

  // ==========================================
  // HANDLE FORM INPUT
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  // ==========================================
  // HANDLE RECORD SELECTION
  // ==========================================

  const handleRecordChange = (e) => {
    setSelectedRecord(e.target.value);

    setError("");
    setSuccess("");
  };

  // ==========================================
  // CREATE PRESCRIPTION
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedRecord) {
      setError(
        "Please select a medical record."
      );
      return;
    }

    if (
      !formData.medicine.trim() ||
      !formData.dosage.trim() ||
      !formData.frequency.trim() ||
      !formData.duration.trim()
    ) {
      setError(
        "Please complete all required prescription fields."
      );
      return;
    }

    const record = records.find(
      (item) => item._id === selectedRecord
    );

    if (!record) {
      setError(
        "Selected medical record was not found."
      );
      return;
    }

    try {
      setCreating(true);

      const prescriptionData = {
        patientId:
          record.patient?._id || record.patient,
        medicalRecordId: selectedRecord,
        medicine: formData.medicine,
        dosage: formData.dosage,
        frequency: formData.frequency,
        duration: formData.duration,
        instructions: formData.instructions,
      };

      await api.post(
        "/prescriptions",
        prescriptionData
      );

      setSuccess(
        "Prescription created successfully."
      );

      setFormData({
        medicine: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      });

      setSelectedRecord("");
    } catch (error) {
      console.error(
        "Prescription error:",
        error
      );

      console.log(
        "Backend response:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Unable to create prescription."
      );
    } finally {
      setCreating(false);
    }
  };

  const selectedPatientRecord = records.find(
    (record) => record._id === selectedRecord
  );

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

          <h1>Create Prescription</h1>

          <p>
            Prescribe medication for a patient using
            their medical record.
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

        {/* SUCCESS */}
        {!loading && success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {!loading && records.length === 0 ? (
          /* NO RECORDS */
          <section className="prescription-empty-state">
            <div className="prescription-empty-icon">
              💊
            </div>

            <h2>
              No medical records available
            </h2>

            <p>
              You need to create a medical record for
              a patient before creating a prescription.
            </p>

            <Link
              to="/doctor/medical-records"
              className="medical-record-view-button"
            >
              View Medical Records
            </Link>
          </section>
        ) : (
          !loading && (
            <section className="doctor-prescription-create">
              {/* FORM HEADER */}
              <div className="doctor-prescription-header">
                <div>
                  <span className="medical-record-label">
                    NEW PRESCRIPTION
                  </span>

                  <h2>Medication Details</h2>

                  <p>
                    Select the patient's medical record
                    and enter the prescribed medication.
                  </p>
                </div>

                <div className="prescription-icon">
                  💊
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="doctor-prescription-form"
              >
                {/* MEDICAL RECORD */}
                <div className="form-group">
                  <label htmlFor="medicalRecord">
                    Patient / Medical Record{" "}
                    <span>*</span>
                  </label>

                  <select
                    id="medicalRecord"
                    value={selectedRecord}
                    onChange={handleRecordChange}
                    disabled={creating}
                  >
                    <option value="">
                      Select a medical record
                    </option>

                    {records.map((record) => (
                      <option
                        key={record._id}
                        value={record._id}
                      >
                        {record.patient?.fullName ||
                          "Unknown Patient"}{" "}
                        - {record.diagnosis}
                      </option>
                    ))}
                  </select>

                  <small>
                    Select the medical record associated
                    with this prescription.
                  </small>
                </div>

                {/* SELECTED PATIENT */}
                {selectedPatientRecord && (
                  <div className="selected-record-card">
                    <div className="selected-record-header">
                      <span>
                        SELECTED PATIENT
                      </span>

                      <strong>
                        {selectedPatientRecord.patient
                          ?.fullName ||
                          "Unknown Patient"}
                      </strong>
                    </div>

                    <div className="selected-record-details">
                      <div>
                        <span>Diagnosis</span>

                        <strong>
                          {selectedPatientRecord.diagnosis ||
                            "Not provided"}
                        </strong>
                      </div>

                      <div>
                        <span>Symptoms</span>

                        <strong>
                          {selectedPatientRecord.symptoms ||
                            "Not provided"}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* MEDICINE */}
                <div className="form-group">
                  <label htmlFor="medicine">
                    Medicine <span>*</span>
                  </label>

                  <input
                    id="medicine"
                    type="text"
                    name="medicine"
                    placeholder="e.g. Paracetamol"
                    value={formData.medicine}
                    onChange={handleChange}
                    disabled={creating}
                  />
                </div>

                {/* DOSAGE */}
                <div className="form-group">
                  <label htmlFor="dosage">
                    Dosage <span>*</span>
                  </label>

                  <input
                    id="dosage"
                    type="text"
                    name="dosage"
                    placeholder="e.g. 500mg"
                    value={formData.dosage}
                    onChange={handleChange}
                    disabled={creating}
                  />
                </div>

                {/* FREQUENCY */}
                <div className="form-group">
                  <label htmlFor="frequency">
                    Frequency <span>*</span>
                  </label>

                  <input
                    id="frequency"
                    type="text"
                    name="frequency"
                    placeholder="e.g. Twice daily"
                    value={formData.frequency}
                    onChange={handleChange}
                    disabled={creating}
                  />
                </div>

                {/* DURATION */}
                <div className="form-group">
                  <label htmlFor="duration">
                    Duration <span>*</span>
                  </label>

                  <input
                    id="duration"
                    type="text"
                    name="duration"
                    placeholder="e.g. 5 days"
                    value={formData.duration}
                    onChange={handleChange}
                    disabled={creating}
                  />
                </div>

                {/* INSTRUCTIONS */}
                <div className="form-group">
                  <label htmlFor="instructions">
                    Instructions
                  </label>

                  <textarea
                    id="instructions"
                    name="instructions"
                    rows="5"
                    placeholder="e.g. Take after meals and drink plenty of water."
                    value={formData.instructions}
                    onChange={handleChange}
                    disabled={creating}
                  />

                  <small>
                    Add any instructions the patient should
                    follow when taking the medication.
                  </small>
                </div>

                {/* ACTIONS */}
                <div className="doctor-prescription-actions">
                  <Link
                    to="/doctor/medical-records"
                    className="secondary-button"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    className="auth-button"
                    disabled={creating}
                  >
                    {creating
                      ? "Creating Prescription..."
                      : "Create Prescription"}
                  </button>
                </div>
              </form>
            </section>
          )
        )}
      </main>
    </div>
  );
}

export default DoctorPrescriptions;