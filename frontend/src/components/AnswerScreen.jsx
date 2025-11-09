import { useState, useRef, useEffect } from "react";
import axios from "axios";

function AnswerScreen({ setStep, formData, setFormData, user }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validation, setValidation] = useState(null);
  const recognitionRef = useRef(null);
  const [speechSupported, setSpeechSupported] = useState(false);

  const currentQuestion = formData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / formData.questions.length) * 100;

  // Load pre-filled answer when question changes
  useEffect(() => {
    if (currentQuestion && formData.answers[currentQuestion.id]) {
      const existingAnswer = formData.answers[currentQuestion.id].answer;
      setAnswer(existingAnswer || "");
    } else {
      setAnswer("");
    }
    setValidation(null);
  }, [currentQuestionIndex, currentQuestion, formData.answers]);

  // Initialize Web Speech API on component mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setSpeechSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN'; // Indian English

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setAnswer(transcript);
        setIsRecording(false);
        setError("");
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        
        if (event.error === 'no-speech') {
          setError("No speech detected. Please try again or type your answer.");
        } else if (event.error === 'not-allowed') {
          setError("Microphone access denied. Please type your answer.");
        } else {
          setError("Voice recognition error. Please type your answer.");
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    } else {
      setSpeechSupported(false);
      console.log("Web Speech API not supported in this browser");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    if (!speechSupported) {
      setError("Voice input not supported in this browser. Please type your answer.");
      return;
    }

    try {
      setError("");
      setIsRecording(true);
      recognitionRef.current.start();
    } catch (err) {
      setError("Could not start voice recognition. Please type your answer.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const validateAndSaveAnswer = async () => {
    if (!answer.trim()) {
      setError("Please provide an answer");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Validate answer with AI
      const validateFormData = new FormData();
      validateFormData.append("question", currentQuestion.question);
      validateFormData.append("answer", answer);

      const validationResponse = await axios.post(
        "https://bharatvoice1.onrender.com/validate-answer",
        validateFormData
      );

      if (validationResponse.data.success) {
        const isValid = validationResponse.data.is_valid;
        const suggestion = validationResponse.data.suggestion;

        if (!isValid && suggestion) {
          setValidation({ isValid: false, suggestion });
          setLoading(false);
          return;
        }
      }

      // Save answer
      const updatedAnswers = {
        ...formData.answers,
        [currentQuestion.id]: {
          question: currentQuestion.question,
          answer: answer,
          field_type: currentQuestion.field_type,
        },
      };

      setFormData({ ...formData, answers: updatedAnswers });

      // Move to next question or next step
      if (currentQuestionIndex < formData.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setAnswer("");
        setValidation(null);
      } else {
        // All questions answered, check if documents needed
        const needsDocuments = formData.questions.some(
          (q) => q.field_type === "document"
        );
        setStep(needsDocuments ? 3 : 4);
      }
    } catch (err) {
      setError("Error saving answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevAnswer =
        formData.answers[formData.questions[currentQuestionIndex - 1].id];
      setAnswer(prevAnswer?.answer || "");
      setValidation(null);
    } else {
      setStep(1);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🎙️ Answer Questions</h1>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }}></div>
        </div>
        <p style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {formData.questions.length}
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.questionBox}>
          <span style={styles.questionLabel}>Question:</span>
          <h2 style={styles.question}>{currentQuestion?.question}</h2>
          {currentQuestion?.required && (
            <span style={styles.requiredBadge}>* Required</span>
          )}
        </div>

        <div style={styles.voiceSection}>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={loading}
            style={{
              ...styles.voiceButton,
              ...(isRecording && styles.voiceButtonRecording),
            }}
          >
            {isRecording ? (
              <>
                <span style={styles.pulseIcon}>🔴</span>
                Stop Recording
              </>
            ) : (
              <>
                🎤 Record Answer
              </>
            )}
          </button>
          <p style={styles.voiceHint}>or type your answer below</p>
        </div>

        <div style={styles.textSection}>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type or speak your answer..."
            style={styles.textarea}
            rows="4"
          />
        </div>

        {validation && !validation.isValid && (
          <div style={styles.validationBox}>
            <strong>💡 Suggestion:</strong> {validation.suggestion}
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.buttonRow}>
          <button onClick={goBack} style={styles.backBtn} disabled={loading}>
            ← Back
          </button>
          <button
            onClick={validateAndSaveAnswer}
            style={styles.nextBtn}
            disabled={loading || !answer.trim()}
          >
            {loading ? "Validating..." : currentQuestionIndex < formData.questions.length - 1 ? "Next →" : "Finish Questions"}
          </button>
        </div>

        <div style={styles.answeredBox}>
          <h4>Answered Questions:</h4>
          <div style={styles.answeredList}>
            {formData.questions.map((q, idx) => (
              <div
                key={q.id}
                style={{
                  ...styles.answeredItem,
                  ...(idx === currentQuestionIndex && styles.answeredItemActive),
                }}
              >
                {formData.answers[q.id] ? "✅" : "⭕"} Q{idx + 1}
              </div>
            ))}
          </div>
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
    marginBottom: "20px",
  },
  progressBar: {
    width: "100%",
    maxWidth: "600px",
    height: "10px",
    background: "rgba(255,255,255,0.3)",
    borderRadius: "10px",
    margin: "0 auto 10px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "white",
    transition: "width 0.3s",
    borderRadius: "10px",
  },
  progressText: {
    fontSize: "16px",
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
  questionBox: {
    padding: "25px",
    background: "#f8f9ff",
    borderRadius: "12px",
    marginBottom: "30px",
    borderLeft: "4px solid #667eea",
  },
  questionLabel: {
    fontSize: "14px",
    color: "#667eea",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  question: {
    fontSize: "24px",
    color: "#333",
    margin: "10px 0",
  },
  requiredBadge: {
    display: "inline-block",
    padding: "4px 12px",
    background: "#ff6b6b",
    color: "white",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  voiceSection: {
    textAlign: "center",
    marginBottom: "20px",
  },
  voiceButton: {
    padding: "20px 40px",
    fontSize: "20px",
    fontWeight: "600",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "transform 0.2s",
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
  },
  voiceButtonRecording: {
    background: "#ff6b6b",
    animation: "pulse 1.5s infinite",
  },
  pulseIcon: {
    animation: "pulse 1s infinite",
  },
  voiceHint: {
    marginTop: "15px",
    color: "#999",
    fontSize: "14px",
  },
  textSection: {
    marginBottom: "20px",
  },
  textarea: {
    width: "100%",
    padding: "15px",
    fontSize: "16px",
    border: "2px solid #e0e0e0",
    borderRadius: "10px",
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none",
  },
  validationBox: {
    padding: "15px",
    background: "#fff3cd",
    border: "1px solid #ffc107",
    borderRadius: "8px",
    marginBottom: "20px",
    color: "#856404",
  },
  error: {
    padding: "15px",
    background: "#fee",
    color: "#c00",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  buttonRow: {
    display: "flex",
    gap: "15px",
    justifyContent: "space-between",
  },
  backBtn: {
    padding: "15px 30px",
    fontSize: "16px",
    background: "#f0f0f0",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
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
  answeredBox: {
    marginTop: "30px",
    padding: "20px",
    background: "#f8f9ff",
    borderRadius: "10px",
  },
  answeredList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "15px",
  },
  answeredItem: {
    padding: "8px 15px",
    background: "white",
    borderRadius: "20px",
    fontSize: "14px",
    border: "2px solid #e0e0e0",
  },
  answeredItemActive: {
    borderColor: "#667eea",
    background: "#e8edff",
  },
};

export default AnswerScreen;
