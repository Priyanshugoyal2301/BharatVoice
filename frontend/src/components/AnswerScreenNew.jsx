import { useState, useRef, useEffect } from "react";
import axios from "axios";

function AnswerScreen({ setStep, formData, setFormData }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState([]);
  const [showUploadPrompt, setShowUploadPrompt] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const recognitionRef = useRef(null);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Initialize answers from formData
  useEffect(() => {
    console.log("🔄 Initializing AnswerScreen with formData:", formData);
    console.log("📝 Questions received:", formData.questions);
    console.log("📊 Number of questions:", formData.questions?.length);
    
    const initialAnswers = {};
    formData.questions.forEach((q) => {
      initialAnswers[q.id] = formData.answers[q.id]?.answer || "";
    });
    setAnswers(initialAnswers);
    setAutoFilledFields(formData.autoFilledFields || []);
  }, [formData]);

  const currentQuestion = formData.questions[currentQuestionIndex];
  const totalQuestions = formData.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    console.log("🎤 Checking speech recognition support...");
    console.log("SpeechRecognition available:", !!SpeechRecognition);
    
    if (SpeechRecognition) {
      setSpeechSupported(true);
      console.log("✅ Speech recognition is supported!");
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("🎤 Voice input result:", transcript);
        setAnswers(prev => ({
          ...prev,
          [currentQuestion.id]: transcript
        }));
        console.log("✅ Answer updated for question:", currentQuestion.id);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("❌ Speech recognition error:", event.error);
        alert(`Voice input error: ${event.error}`);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        console.log("🎤 Voice recognition ended");
        setIsRecording(false);
      };
    } else {
      console.warn("⚠️ Speech recognition is NOT supported in this browser");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentQuestion]);

  const startVoiceInput = () => {
    if (!speechSupported) {
      alert("Voice input not supported in this browser. Please use Chrome or Edge.");
      return;
    }
    console.log("🎤 Starting voice input for question:", currentQuestion.id);
    try {
      setIsRecording(true);
      recognitionRef.current.start();
      console.log("✅ Voice recognition started");
    } catch (err) {
      console.error("❌ Voice recognition error:", err);
      setIsRecording(false);
      alert("Could not start voice input. Please try again.");
    }
  };

  const stopVoiceInput = () => {
    console.log("🛑 Stopping voice input");
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTextChange = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadLoading(true);
    setShowUploadPrompt(false);
    
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const response = await axios.post(
        "https://bharatvoice1.onrender.com/auto-fill-from-id",
        formDataObj,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        const extractedData = response.data.data;
        const updatedAnswers = { ...answers };
        const filled = [];

        formData.questions.forEach((q) => {
          const question = q.question.toLowerCase();
          let autoFilledValue = "";

          if (question.includes("name") && !question.includes("father") && extractedData.name) {
            autoFilledValue = extractedData.name;
          } else if ((question.includes("birth") || question.includes("dob") || question.includes("date of birth")) && extractedData.dob) {
            autoFilledValue = extractedData.dob;
          } else if (question.includes("address") && extractedData.address) {
            autoFilledValue = extractedData.address;
          } else if ((question.includes("phone") || question.includes("mobile") || question.includes("contact")) && extractedData.phone) {
            autoFilledValue = extractedData.phone;
          } else if (question.includes("email") && extractedData.email) {
            autoFilledValue = extractedData.email;
          } else if ((question.includes("gender") || question.includes("sex")) && extractedData.gender) {
            autoFilledValue = extractedData.gender;
          } else if ((question.includes("aadhaar") || question.includes("aadhar") || question.includes("id number")) && extractedData.id_number) {
            autoFilledValue = extractedData.id_number;
          } else if (question.includes("father") && extractedData.father_name) {
            autoFilledValue = extractedData.father_name;
          }

          if (autoFilledValue) {
            updatedAnswers[q.id] = autoFilledValue;
            filled.push(q.id);
          }
        });

        setAnswers(updatedAnswers);
        setAutoFilledFields(filled);
        alert(`✅ Auto-filled ${filled.length} out of ${totalQuestions} fields from your document!`);
      } else {
        alert("❌ Failed to extract data from document: " + (response.data.error || "Unknown error"));
      }
    } catch (err) {
      alert("❌ Error processing document. Please try again.");
      console.error(err);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    // Check if all required questions are answered
    const unanswered = formData.questions.filter(
      (q) => q.required && !answers[q.id]?.trim()
    );

    if (unanswered.length > 0) {
      alert(`Please answer all required questions. Missing: ${unanswered.map(q => q.question).join(", ")}`);
      return;
    }

    // Save answers to formData
    const updatedAnswers = {};
    formData.questions.forEach((q) => {
      updatedAnswers[q.id] = {
        question: q.question,
        answer: answers[q.id] || "",
        field_type: q.field_type,
      };
    });

    setFormData({
      ...formData,
      answers: updatedAnswers,
      autoFilledFields: autoFilledFields,
    });

    setStep(3); // Move to review
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  const isAutoFilled = autoFilledFields.includes(currentQuestion.id);

  return (
    <div style={styles.container}>
      {/* Header with question count */}
      <div style={styles.header}>
        <h1 style={styles.title}>📝 Fill Form Questions</h1>
        <div style={styles.questionCounter}>
          <span style={styles.counterText}>
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span style={styles.autoFilledCount}>
            ✅ {autoFilledFields.length} Auto-filled
          </span>
        </div>
      </div>

      {/* Upload document prompt - show only once at start */}
      {showUploadPrompt && currentQuestionIndex === 0 && (
        <div style={styles.uploadPrompt}>
          <div style={styles.uploadPromptContent}>
            <h3 style={styles.uploadPromptTitle}>🪪 Want to Auto-Fill?</h3>
            <p style={styles.uploadPromptText}>
              Upload your ID card or document to automatically fill matching fields
            </p>
            <label style={styles.uploadButton}>
              <input
                type="file"
                accept="image/*"
                onChange={handleDocumentUpload}
                style={{ display: "none" }}
                disabled={uploadLoading}
              />
              {uploadLoading ? "⏳ Processing..." : "📤 Upload Document"}
            </label>
            <button
              onClick={() => setShowUploadPrompt(false)}
              style={styles.skipUploadButton}
            >
              Skip, I'll fill manually
            </button>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div style={styles.progressBarContainer}>
        <div style={styles.progressBar}>
          {formData.questions.map((q, index) => {
            let barColor = "#e0e0e0"; // Not filled
            if (autoFilledFields.includes(q.id)) {
              barColor = "#4caf50"; // Auto-filled (green)
            } else if (answers[q.id]?.trim()) {
              barColor = "#2196f3"; // Manually filled (blue)
            } else if (index === currentQuestionIndex) {
              barColor = "#ff9800"; // Current question (orange)
            }

            return (
              <div
                key={q.id}
                style={{
                  ...styles.progressBarSegment,
                  background: barColor,
                }}
                title={q.question}
              />
            );
          })}
        </div>
      </div>

      {/* Current question card */}
      <div style={styles.questionCard}>
        <div style={styles.questionHeader}>
          <h2 style={styles.questionText}>
            {currentQuestion.question}
            {currentQuestion.required && (
              <span style={styles.requiredStar}> *</span>
            )}
          </h2>
          {isAutoFilled && (
            <div style={styles.autoFilledBadge}>
              ✓ Auto-filled from document
            </div>
          )}
        </div>

        {/* Text input */}
        <textarea
          value={answers[currentQuestion.id] || ""}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Type your answer here..."
          style={styles.textArea}
          rows={3}
        />

        {/* Voice input button */}
        <div style={styles.voiceSection}>
          <div style={styles.orDivider}>
            <span style={styles.orText}>OR</span>
          </div>
          <button
            onClick={isRecording ? stopVoiceInput : startVoiceInput}
            style={{
              ...styles.voiceButton,
              ...(isRecording && styles.voiceButtonActive),
            }}
            disabled={!speechSupported}
          >
            {isRecording ? (
              <>
                <span style={styles.recordingDot}></span>
                🎤 Recording... (Click to stop)
              </>
            ) : (
              <>
                🎤 Speak Your Answer
              </>
            )}
          </button>
          {!speechSupported && (
            <p style={styles.notSupported}>
              ⚠️ Voice input not supported in this browser
            </p>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div style={styles.navigationButtons}>
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          style={{
            ...styles.navButton,
            ...(currentQuestionIndex === 0 && styles.navButtonDisabled),
          }}
        >
          ← Previous
        </button>

        {currentQuestionIndex < totalQuestions - 1 ? (
          <button onClick={handleNext} style={styles.navButtonNext}>
            Next →
          </button>
        ) : (
          <button onClick={handleSubmit} style={styles.submitButtonFinal}>
            📄 Review & Generate PDF
          </button>
        )}
      </div>

      {/* Back to upload */}
      <button onClick={() => setStep(1)} style={styles.backLink}>
        ← Back to Form Upload
      </button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    paddingBottom: "100px",
  },
  header: {
    textAlign: "center",
    color: "white",
    marginBottom: "20px",
  },
  title: {
    fontSize: "32px",
    marginBottom: "15px",
  },
  questionCounter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    marginTop: "10px",
  },
  counterText: {
    fontSize: "18px",
    fontWeight: "600",
    background: "rgba(255,255,255,0.2)",
    padding: "10px 20px",
    borderRadius: "25px",
  },
  autoFilledCount: {
    fontSize: "16px",
    background: "#4caf50",
    padding: "8px 16px",
    borderRadius: "20px",
  },
  uploadPrompt: {
    maxWidth: "600px",
    margin: "0 auto 30px",
    background: "white",
    borderRadius: "15px",
    padding: "30px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  uploadPromptContent: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  uploadPromptTitle: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "5px",
  },
  uploadPromptText: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "10px",
  },
  uploadButton: {
    padding: "15px 30px",
    background: "#4caf50",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    display: "inline-block",
  },
  skipUploadButton: {
    padding: "12px",
    background: "transparent",
    border: "none",
    color: "#667eea",
    cursor: "pointer",
    fontSize: "14px",
    textDecoration: "underline",
  },
  progressBarContainer: {
    maxWidth: "900px",
    margin: "0 auto 30px",
  },
  progressBar: {
    display: "flex",
    gap: "3px",
    height: "8px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "10px",
    padding: "3px",
  },
  progressBarSegment: {
    flex: 1,
    borderRadius: "4px",
    transition: "all 0.3s",
  },
  questionCard: {
    maxWidth: "700px",
    margin: "0 auto 30px",
    background: "white",
    borderRadius: "15px",
    padding: "40px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
  },
  questionHeader: {
    marginBottom: "25px",
  },
  questionText: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    lineHeight: "1.4",
  },
  requiredStar: {
    color: "#f44336",
    fontSize: "28px",
  },
  autoFilledBadge: {
    display: "inline-block",
    marginTop: "10px",
    padding: "8px 16px",
    background: "#e8f5e9",
    color: "#4caf50",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
  },
  textArea: {
    width: "100%",
    padding: "15px",
    fontSize: "18px",
    border: "2px solid #e0e0e0",
    borderRadius: "10px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  voiceSection: {
    marginTop: "20px",
  },
  orDivider: {
    textAlign: "center",
    margin: "20px 0",
    position: "relative",
  },
  orText: {
    background: "white",
    padding: "0 15px",
    color: "#999",
    fontSize: "14px",
    fontWeight: "600",
    position: "relative",
    zIndex: 1,
  },
  voiceButton: {
    width: "100%",
    padding: "18px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "all 0.3s",
  },
  voiceButtonActive: {
    background: "#f44336",
    animation: "pulse 1.5s infinite",
  },
  recordingDot: {
    width: "12px",
    height: "12px",
    background: "white",
    borderRadius: "50%",
    display: "inline-block",
    animation: "blink 1s infinite",
  },
  notSupported: {
    marginTop: "10px",
    color: "#f44336",
    fontSize: "14px",
    textAlign: "center",
  },
  navigationButtons: {
    maxWidth: "700px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
  },
  navButton: {
    padding: "15px 30px",
    background: "white",
    color: "#667eea",
    border: "2px solid white",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  navButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  navButtonNext: {
    padding: "15px 40px",
    background: "white",
    color: "#667eea",
    border: "2px solid white",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  submitButtonFinal: {
    padding: "15px 40px",
    background: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  backLink: {
    display: "block",
    maxWidth: "700px",
    margin: "20px auto 0",
    padding: "12px",
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    textDecoration: "underline",
  },
};

export default AnswerScreen;
