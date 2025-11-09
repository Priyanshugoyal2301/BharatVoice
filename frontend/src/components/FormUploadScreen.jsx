import { useState } from "react";
import axios from "axios";

function FormUploadScreen({ setStep, formData, setFormData, user }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError("");
    }
  };

  const handleScanForm = async () => {
    if (!file) {
      setError("Please select a form image first");
      return;
    }

    setLoading(true);
    setError("");

    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const response = await axios.post(
        "https://bharatvoice-1.onrender.com/scan-form",
        formDataObj,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("📤 Scan form response:", response.data);
      console.log("📊 Number of questions detected:", response.data.questions?.length);
      console.log("📝 Questions:", response.data.questions);

      if (response.data.success) {
        setFormData({
          ...formData,
          extractedText: response.data.extracted_text,
          questions: response.data.questions,
          answers: {},
          autoFilledFields: [],
        });
        setStep(2); // Move to answer screen
      } else {
        setError(response.data.error || "Failed to scan form");
      }
    } catch (err) {
      setError("Error scanning form. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📄 Upload Form to Fill</h1>
        <p style={styles.subtitle}>
          Welcome, {user?.name || "Guest"}! Upload a picture of the form you need to fill
        </p>
      </div>

      <div style={styles.card}>
        {!preview ? (
          <label style={styles.uploadArea}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div style={styles.uploadIcon}>📷</div>
            <div style={styles.uploadText}>Click to Upload Form Image</div>
            <div style={styles.uploadSubtext}>
              Take a photo or upload an image of your form
            </div>
          </label>
        ) : (
          <div style={styles.previewContainer}>
            <img src={preview} alt="Form preview" style={styles.previewImage} />
            <button
              onClick={() => {
                setPreview("");
                setFile(null);
              }}
              style={styles.changeButton}
            >
              Change Image
            </button>
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}

        <button
          onClick={handleScanForm}
          disabled={!file || loading}
          style={{
            ...styles.scanButton,
            ...((!file || loading) && styles.scanButtonDisabled),
          }}
        >
          {loading ? (
            <>
              <span style={styles.spinner}></span>
              Scanning Form with AI...
            </>
          ) : (
            "Scan Form & Detect Questions"
          )}
        </button>

        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>How it works:</h3>
          <ol style={styles.infoList}>
            <li>Upload a picture of your government form</li>
            <li>Our AI will scan and detect all questions</li>
            <li>Answer via voice, typing, or upload ID for auto-fill</li>
            <li>Download your filled form!</li>
          </ol>
        </div>

        <button onClick={() => setStep(0)} style={styles.backButton}>
          ← Back to Home
        </button>
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
  userInfo: {
    fontSize: "16px",
    marginTop: "10px",
    opacity: 0.8,
  },
  card: {
    maxWidth: "800px",
    margin: "0 auto",
    background: "white",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
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
  scanButton: {
    width: "100%",
    padding: "20px",
    fontSize: "20px",
    fontWeight: "600",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "transform 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  scanButtonDisabled: {
    background: "#ccc",
    cursor: "not-allowed",
  },
  divider: {
    textAlign: "center",
    margin: "20px 0",
    fontSize: "16px",
    fontWeight: "600",
    color: "#999",
    position: "relative",
  },
  autoFillButton: {
    width: "100%",
    padding: "18px",
    fontSize: "18px",
    fontWeight: "600",
    background: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "transform 0.2s",
    marginBottom: "20px",
  },
  spinner: {
    border: "3px solid rgba(255,255,255,0.3)",
    borderTop: "3px solid white",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    animation: "spin 1s linear infinite",
    display: "inline-block",
  },
  error: {
    padding: "15px",
    background: "#fee",
    color: "#c00",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "16px",
  },
  infoBox: {
    marginTop: "30px",
    padding: "25px",
    background: "#f8f9ff",
    borderRadius: "12px",
    borderLeft: "4px solid #667eea",
  },
  infoTitle: {
    fontSize: "18px",
    marginBottom: "15px",
    color: "#333",
  },
  infoList: {
    paddingLeft: "20px",
    lineHeight: "1.8",
    color: "#666",
    fontSize: "15px",
  },
  backButton: {
    marginTop: "20px",
    padding: "12px",
    background: "transparent",
    border: "none",
    color: "#667eea",
    cursor: "pointer",
    fontSize: "16px",
    textDecoration: "underline",
  },
};

export default FormUploadScreen;
