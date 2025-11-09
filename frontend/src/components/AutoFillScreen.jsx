import { useState } from "react";
import axios from "axios";

function AutoFillScreen({ setStep, setFormData, formData }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError("");
      setExtractedData(null);
    }
  };

  const handleExtractData = async () => {
    if (!file) {
      setError("Please select an ID card image first");
      return;
    }

    setLoading(true);
    setError("");

    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auto-fill-from-id",
        formDataObj,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        setExtractedData(response.data.data);
      } else {
        setError(response.data.error || "Failed to extract data from ID");
      }
    } catch (err) {
      setError("Error processing ID card. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFill = () => {
    if (!extractedData) return;

    // Initialize answers from questions if not already done
    const updatedAnswers = {};

    // Map extracted data to form questions
    formData.questions.forEach((questionObj) => {
      const question = questionObj.question.toLowerCase();
      const questionId = questionObj.id;

      let autoFilledAnswer = "";

      // Auto-fill name
      if (question.includes("name") && extractedData.name) {
        autoFilledAnswer = extractedData.name;
      }

      // Auto-fill DOB
      if (
        (question.includes("birth") || question.includes("dob") || question.includes("date")) &&
        extractedData.dob
      ) {
        autoFilledAnswer = extractedData.dob;
      }

      // Auto-fill address
      if (question.includes("address") && extractedData.address) {
        autoFilledAnswer = extractedData.address;
      }

      // Auto-fill phone
      if (
        (question.includes("phone") || question.includes("mobile") || question.includes("contact")) &&
        extractedData.phone
      ) {
        autoFilledAnswer = extractedData.phone;
      }

      // Auto-fill email
      if (question.includes("email") && extractedData.email) {
        autoFilledAnswer = extractedData.email;
      }

      // Auto-fill ID number
      if (
        (question.includes("aadhaar") ||
          question.includes("pan") ||
          question.includes("id number") ||
          question.includes("identification")) &&
        extractedData.id_number
      ) {
        autoFilledAnswer = extractedData.id_number;
      }

      // Auto-fill gender
      if (question.includes("gender") || question.includes("sex")) {
        autoFilledAnswer = extractedData.gender || "";
      }

      // Initialize answer object
      updatedAnswers[questionId] = {
        question: questionObj.question,
        answer: autoFilledAnswer,
        field_type: questionObj.field_type,
        required: questionObj.required
      };
    });

    setFormData({ ...formData, answers: updatedAnswers });
    setStep(2); // Go to answer screen with pre-filled data
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🪪 Auto-Fill from ID Card</h1>
        <p style={styles.subtitle}>
          Upload your Aadhaar, PAN, or any ID card to auto-fill the form
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.infoBox}>
          <strong>💡 Quick Tip:</strong> Upload your ID card once, and we'll
          automatically fill Name, DOB, Address, Phone, and more!
        </div>

        {!preview ? (
          <label style={styles.uploadArea}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div style={styles.uploadIcon}>🪪</div>
            <div style={styles.uploadText}>Click to Upload ID Card</div>
            <div style={styles.uploadSubtext}>
              Aadhaar, PAN, Voter ID, Driving License, etc.
            </div>
          </label>
        ) : (
          <div style={styles.previewContainer}>
            <img src={preview} alt="ID preview" style={styles.previewImage} />
            <button
              onClick={() => {
                setPreview("");
                setFile(null);
                setExtractedData(null);
              }}
              style={styles.changeButton}
            >
              Change Image
            </button>
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}

        {!extractedData && file && (
          <button
            onClick={handleExtractData}
            disabled={loading}
            style={{
              ...styles.extractButton,
              ...(loading && styles.extractButtonDisabled),
            }}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Extracting Data...
              </>
            ) : (
              "🔍 Extract Data from ID"
            )}
          </button>
        )}

        {extractedData && (
          <div style={styles.extractedSection}>
            <h3 style={styles.extractedTitle}>
              ✅ Extracted from {extractedData.document_type}:
            </h3>

            <div style={styles.dataGrid}>
              {extractedData.name && (
                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>Name:</span>
                  <span style={styles.dataValue}>{extractedData.name}</span>
                </div>
              )}

              {extractedData.dob && (
                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>Date of Birth:</span>
                  <span style={styles.dataValue}>{extractedData.dob}</span>
                </div>
              )}

              {extractedData.id_number && (
                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>ID Number:</span>
                  <span style={styles.dataValue}>{extractedData.id_number}</span>
                </div>
              )}

              {extractedData.gender && (
                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>Gender:</span>
                  <span style={styles.dataValue}>{extractedData.gender}</span>
                </div>
              )}

              {extractedData.address && (
                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>Address:</span>
                  <span style={styles.dataValue}>{extractedData.address}</span>
                </div>
              )}

              {extractedData.phone && (
                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>Phone:</span>
                  <span style={styles.dataValue}>{extractedData.phone}</span>
                </div>
              )}

              {extractedData.email && (
                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>Email:</span>
                  <span style={styles.dataValue}>{extractedData.email}</span>
                </div>
              )}
            </div>

            <button onClick={handleAutoFill} style={styles.autoFillButton}>
              ✨ Auto-Fill Form with This Data
            </button>
          </div>
        )}

        <div style={styles.buttonRow}>
          <button onClick={() => setStep(1)} style={styles.backButton}>
            ← Back
          </button>
          <button onClick={() => setStep(2)} style={styles.skipButton}>
            Skip Auto-Fill →
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
  },
  header: {
    textAlign: "center",
    color: "white",
    marginBottom: "30px",
  },
  title: {
    fontSize: "36px",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "18px",
    opacity: 0.9,
  },
  card: {
    maxWidth: "800px",
    margin: "0 auto",
    background: "white",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  infoBox: {
    padding: "20px",
    background: "#e3f2fd",
    borderRadius: "12px",
    marginBottom: "25px",
    fontSize: "16px",
    color: "#1565c0",
    borderLeft: "4px solid #2196f3",
  },
  uploadArea: {
    display: "block",
    padding: "60px",
    border: "3px dashed #667eea",
    borderRadius: "15px",
    textAlign: "center",
    cursor: "pointer",
    background: "#f8f9ff",
    transition: "all 0.3s",
    marginBottom: "20px",
  },
  uploadIcon: {
    fontSize: "80px",
    marginBottom: "20px",
  },
  uploadText: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "10px",
  },
  uploadSubtext: {
    fontSize: "16px",
    color: "#666",
  },
  previewContainer: {
    textAlign: "center",
    marginBottom: "20px",
  },
  previewImage: {
    maxWidth: "100%",
    maxHeight: "400px",
    borderRadius: "10px",
    marginBottom: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  changeButton: {
    padding: "10px 20px",
    background: "#f0f0f0",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  extractButton: {
    width: "100%",
    padding: "20px",
    fontSize: "20px",
    fontWeight: "600",
    background: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  extractButtonDisabled: {
    background: "#ccc",
    cursor: "not-allowed",
  },
  spinner: {
    border: "3px solid rgba(255,255,255,0.3)",
    borderTop: "3px solid white",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    animation: "spin 1s linear infinite",
  },
  error: {
    padding: "15px",
    background: "#fee",
    color: "#c00",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "16px",
  },
  extractedSection: {
    padding: "25px",
    background: "#e8f5e9",
    borderRadius: "12px",
    marginBottom: "25px",
    border: "2px solid #4caf50",
  },
  extractedTitle: {
    fontSize: "20px",
    marginBottom: "20px",
    color: "#2e7d32",
  },
  dataGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "20px",
  },
  dataItem: {
    display: "flex",
    padding: "12px",
    background: "white",
    borderRadius: "8px",
    alignItems: "center",
  },
  dataLabel: {
    fontWeight: "600",
    color: "#666",
    minWidth: "150px",
  },
  dataValue: {
    color: "#333",
    fontSize: "16px",
  },
  autoFillButton: {
    width: "100%",
    padding: "18px",
    fontSize: "20px",
    fontWeight: "600",
    background: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
  buttonRow: {
    display: "flex",
    gap: "15px",
    justifyContent: "space-between",
  },
  backButton: {
    padding: "15px 30px",
    background: "#f0f0f0",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
  },
  skipButton: {
    padding: "15px 30px",
    background: "transparent",
    border: "2px solid #667eea",
    color: "#667eea",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default AutoFillScreen;
