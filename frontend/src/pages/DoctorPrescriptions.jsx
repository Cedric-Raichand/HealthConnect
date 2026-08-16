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

  // Get medical records belonging to the logged-in doctor
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRecordChange = (e) => {
    setSelectedRecord(e.target.value);

    // Clear messages when changing patient
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedRecord) {
      setError("Please select a medical record.");
      return;
    }

    if (
      !formData.medicine ||
      !formData.dosage ||
      !formData.frequency ||
      !formData.duration
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const record = records.find(
      (item) => item._id === selectedRecord
    );

    if (!record) {
      setError("Selected medical record was not found.");
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

      console.log(
        "Sending prescription:",
        prescriptionData
      );

      await api.post(
        "/prescriptions",
        prescriptionData
      );

      setSuccess(
        "Prescription created successfully!"
      );

      setFormData({
        medicine: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      });

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
            Create Prescription
          </h1>

          <p>
            Prescribe medication for a patient
            using their medical record.
          </p>

        </section>

        {/* LOADING */}
        {loading && (
          <div className="dashboard-message">
            Loading medical records...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {!loading && (
          <section className="booking-section">

            <h2>
              New Prescription
            </h2>

            <form
              onSubmit={handleSubmit}
              className="booking-form"
            >

              {/* MEDICAL RECORD */}
              <div className="form-group">

                <label htmlFor="medicalRecord">
                  Select Patient / Medical Record
                </label>

                <select
                  id="medicalRecord"
                  value={selectedRecord}
                  onChange={handleRecordChange}
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

              </div>

              {/* SELECTED PATIENT INFO */}
              {selectedRecord && (
                <div className="dashboard-message">

                  {(() => {
                    const record = records.find(
                      (item) =>
                        item._id === selectedRecord
                    );

                    if (!record) return null;

                    return (
                      <>
                        <strong>
                          Patient:
                        </strong>{" "}
                        {record.patient?.fullName ||
                          "Unknown"}

                        <br />

                        <strong>
                          Diagnosis:
                        </strong>{" "}
                        {record.diagnosis}

                        <br />

                        <strong>
                          Symptoms:
                        </strong>{" "}
                        {record.symptoms}
                      </>
                    );
                  })()}

                </div>
              )}

              {/* MEDICINE */}
              <div className="form-group">

                <label htmlFor="medicine">
                  Medicine
                </label>

                <input
                  id="medicine"
                  type="text"
                  name="medicine"
                  placeholder="e.g. Paracetamol"
                  value={formData.medicine}
                  onChange={handleChange}
                />

              </div>

              {/* DOSAGE */}
              <div className="form-group">

                <label htmlFor="dosage">
                  Dosage
                </label>

                <input
                  id="dosage"
                  type="text"
                  name="dosage"
                  placeholder="e.g. 500mg"
                  value={formData.dosage}
                  onChange={handleChange}
                />

              </div>

              {/* FREQUENCY */}
              <div className="form-group">

                <label htmlFor="frequency">
                  Frequency
                </label>

                <input
                  id="frequency"
                  type="text"
                  name="frequency"
                  placeholder="e.g. Twice daily"
                  value={formData.frequency}
                  onChange={handleChange}
                />

              </div>

              {/* DURATION */}
              <div className="form-group">

                <label htmlFor="duration">
                  Duration
                </label>

                <input
                  id="duration"
                  type="text"
                  name="duration"
                  placeholder="e.g. 5 days"
                  value={formData.duration}
                  onChange={handleChange}
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
                  rows="4"
                  placeholder="e.g. Take after meals"
                  value={formData.instructions}
                  onChange={handleChange}
                />

              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="auth-button"
                disabled={
                  creating ||
                  records.length === 0
                }
              >
                {creating
                  ? "Creating Prescription..."
                  : "Create Prescription"}
              </button>

            </form>

          </section>
        )}

        {!loading && records.length === 0 && (
          <div className="empty-state">

            <h3>
              No medical records available
            </h3>

            <p>
              You need to create a medical record
              for a patient before creating a
              prescription.
            </p>

            <Link to="/doctor/medical-records">
              View Medical Records
            </Link>

          </div>
        )}

      </main>
    </div>
  );
}

export default DoctorPrescriptions;