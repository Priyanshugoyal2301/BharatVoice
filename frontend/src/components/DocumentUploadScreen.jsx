import { useState } from "react";
import axios from "axios";

function DocumentUploadScreen({ setStep, formData, setFormData, user }) {
  const [currentDocType, setCurrentDocType] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get document questions
  const documentQuestions = formData.questions.filter(
    (q) => q.field_type === "document"
  );

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file || !currentDocType) {
      setError("Please select a document type and file");
      return;
    }

    setLoading(true);
    setError("");

    const formDataObj = new FormData();
    formDataObj.append("file", file);
    formDataObj.append("document_type", currentDocType);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/upload-document",
        formDataObj
      );

      if (response.data.success) {
        const updatedDocuments = {
          ...formData.documents,
          [currentDocType]: {
            filename: response.data.filename,
            extracted_text: response.data.extracted_text,
          },
        };

        setFormData({ ...formData, documents: updatedDocuments });

        // Reset for next document
        setFile(null);
        setPreview("");
        setCurrentDocType("");
      } else {
        setError(response.data.error || "Failed to upload document");
      }
    } catch (err) {
      setError("Error uploading document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const skipDocuments = () => {
    setStep(4); // Move to review screen
  };

  const proceedToReview = () => {
    setStep(4);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📎 Upload Required Documents</h1>
        <p style={styles.subtitle}>
          Upload supporting documents required by the form
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.docTypesSection}>
          <h3 style={styles.sectionTitle}>Document Types Required:</h3>
          <div style={styles.docTypesList}>
            {documentQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => setCurrentDocType(q.question)}
                style={{
                  ...styles.docTypeButton,
                  ...(currentDocType === q.question && styles.docTypeButtonActive),
                  ...(formData.documents[q.question] && styles.docTypeButtonDone),
                }}
              >
                {formData.documents[q.question] ? "✅" : "📄"} {q.question}
              </button>
            ))}
          </div>
        </div>

        {currentDocType && (
          <div style={styles.uploadSection}>
            <h3 style={styles.sectionTitle}>Upload: {currentDocType}</h3>

            {!preview ? (
              <label style={styles.uploadArea}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <div style={styles.uploadIcon}>📷</div>
                <div style={styles.uploadText}>Click to Upload Document</div>
              </label>
            ) : (
              <div style={styles.previewContainer}>
                <img
                  src={preview}
                  alt="Document preview"
                  style={styles.previewImage}
                />
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
              onClick={handleUpload}
              disabled={!file || loading}
              style={{
                ...styles.uploadButton,
                ...((!file || loading) && styles.uploadButtonDisabled),
              }}
            >
              {loading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        )}

        <div style={styles.uploadedSection}>
          <h3 style={styles.sectionTitle}>Uploaded Documents:</h3>
          {Object.keys(formData.documents).length === 0 ? (
            <p style={styles.emptyText}>No documents uploaded yet</p>
          ) : (
            <div style={styles.uploadedList}>
              {Object.entries(formData.documents).map(([docType, docInfo]) => (
                <div key={docType} style={styles.uploadedItem}>
                  <div style={styles.uploadedIcon}>✅</div>
                  <div style={styles.uploadedInfo}>
                    <strong>{docType}</strong>
                    <p style={styles.uploadedFilename}>{docInfo.filename}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.buttonRow}>
          <button onClick={() => setStep(2)} style={styles.backBtn}>
            ← Back to Questions
          </button>
          <button onClick={skipDocuments} style={styles.skipBtn}>
            Skip Documents
          </button>
          <button
            onClick={proceedToReview}
            style={styles.nextBtn}
            disabled={Object.keys(formData.documents).length === 0}
          >
            Review & Submit →
          </button>
        </div>

        <div style={styles.infoBox}>
          <p>
            <strong>💡 Tip:</strong> Upload clear photos of your documents. AI will
            extract text automatically for verification.
          </p>
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
    maxWidth: "900px",
    margin: "0 auto",
    background: "white",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  sectionTitle: {
    fontSize: "20px",
    marginBottom: "20px",
    color: "#333",
  },
  docTypesSection: {
    marginBottom: "30px",
  },
  docTypesList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  docTypeButton: {
    padding: "12px 20px",
    border: "2px solid #e0e0e0",
    background: "white",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    transition: "all 0.3s",
  },
  docTypeButtonActive: {
    borderColor: "#667eea",
    background: "#e8edff",
    fontWeight: "600",
  },
  docTypeButtonDone: {
    borderColor: "#4caf50",
    background: "#e8f5e9",
  },
  uploadSection: {
    padding: "30px",
    background: "#f8f9ff",
    borderRadius: "12px",
    marginBottom: "30px",
  },
  uploadArea: {
    display: "block",
    padding: "40px",
    border: "3px dashed #667eea",
    borderRadius: "12px",
    textAlign: "center",
    cursor: "pointer",
    background: "white",
    marginBottom: "20px",
  },
  uploadIcon: {
    fontSize: "60px",
    marginBottom: "15px",
  },
  uploadText: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
  },
  previewContainer: {
    textAlign: "center",
    marginBottom: "20px",
  },
  previewImage: {
    maxWidth: "100%",
    maxHeight: "300px",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  changeButton: {
    padding: "8px 16px",
    background: "#f0f0f0",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  uploadButton: {
    width: "100%",
    padding: "15px",
    fontSize: "18px",
    fontWeight: "600",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
  uploadButtonDisabled: {
    background: "#ccc",
    cursor: "not-allowed",
  },
  uploadedSection: {
    marginBottom: "30px",
  },
  emptyText: {
    color: "#999",
    fontStyle: "italic",
  },
  uploadedList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  uploadedItem: {
    display: "flex",
    gap: "15px",
    padding: "15px",
    background: "#f8f9ff",
    borderRadius: "10px",
    border: "2px solid #e0e0e0",
  },
  uploadedIcon: {
    fontSize: "30px",
  },
  uploadedInfo: {
    flex: 1,
  },
  uploadedFilename: {
    color: "#666",
    fontSize: "14px",
    marginTop: "5px",
  },
  buttonRow: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  },
  backBtn: {
    padding: "15px 25px",
    background: "#f0f0f0",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
  },
  skipBtn: {
    padding: "15px 25px",
    background: "transparent",
    border: "2px solid #667eea",
    color: "#667eea",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
  },
  nextBtn: {
    flex: 1,
    padding: "15px",
    fontSize: "18px",
    fontWeight: "600",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
  error: {
    padding: "12px",
    background: "#fee",
    color: "#c00",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  infoBox: {
    padding: "15px",
    background: "#fff8e1",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#856404",
  },
};

export default DocumentUploadScreen;
