import axios from "axios";
import { useState, useRef, useEffect } from "react";

export default function VoiceForm({ setStep, setFormData, formData }) {
  const [text, setText] = useState(formData.name || "");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);
  const [speechSupported, setSpeechSupported] = useState(false);

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
        setText(transcript);
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

  const handleNext = () => {
    if (!text.trim()) {
      setError("Please record your name first or type it manually below.");
      return;
    }
    setFormData({ ...formData, name: text });
    setStep(2);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎤 Welcome to BharatVoice AI</h1>
      <p style={styles.subtitle}>Voice-First Form Assistant</p>
      
      <div style={styles.card}>
        <h2 style={styles.question}>What is your full name?</h2>
        <p style={styles.instruction}>Press the microphone button and speak clearly OR type below</p>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.recordingSection}>
          {!isRecording && !isProcessing && (
            <button onClick={startRecording} style={styles.recordButton}>
              🎤 Start Recording
            </button>
          )}

          {isRecording && (
            <div style={styles.recordingIndicator}>
              <div style={styles.pulse}></div>
              <p style={styles.recordingText}>Listening...</p>
              <button onClick={stopRecording} style={styles.stopButton}>
                ⏹️ Stop Recording
              </button>
            </div>
          )}

          {isProcessing && (
            <div style={styles.processing}>
              <div style={styles.spinner}></div>
              <p>Processing your voice...</p>
            </div>
          )}
        </div>

        {text && (
          <div style={styles.resultCard}>
            <p style={styles.resultLabel}>You said:</p>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={styles.textInput}
              placeholder="Edit your name here..."
            />
            <button onClick={startRecording} style={styles.retryButton}>
              🔄 Record Again
            </button>
          </div>
        )}

        {!text && !isRecording && !isProcessing && (
          <div style={styles.manualInputSection}>
            <p style={styles.orText}>OR</p>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={styles.manualInput}
              placeholder="Type your full name here..."
            />
          </div>
        )}

        <button onClick={handleNext} style={styles.nextButton} disabled={!text.trim()}>
          Continue to Document Upload →
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  title: {
    fontSize: "2.5rem",
    textAlign: "center",
    color: "#2c3e50",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1.2rem",
    textAlign: "center",
    color: "#7f8c8d",
    marginBottom: "2rem",
  },
  card: {
    backgroundColor: "white",
    padding: "3rem",
    borderRadius: "15px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  question: {
    fontSize: "1.8rem",
    color: "#34495e",
    marginBottom: "1rem",
    textAlign: "center",
  },
  instruction: {
    fontSize: "1.1rem",
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: "2rem",
  },
  error: {
    backgroundColor: "#fee",
    color: "#c33",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    textAlign: "center",
    fontSize: "1.1rem",
  },
  recordingSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "2rem",
  },
  recordButton: {
    fontSize: "1.5rem",
    padding: "1.5rem 3rem",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(52,152,219,0.3)",
    transition: "all 0.3s",
  },
  recordingIndicator: {
    textAlign: "center",
  },
  pulse: {
    width: "80px",
    height: "80px",
    margin: "0 auto 1rem",
    backgroundColor: "#e74c3c",
    borderRadius: "50%",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  recordingText: {
    fontSize: "1.3rem",
    color: "#e74c3c",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  stopButton: {
    fontSize: "1.3rem",
    padding: "1rem 2rem",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
  },
  processing: {
    textAlign: "center",
  },
  spinner: {
    width: "60px",
    height: "60px",
    margin: "0 auto 1rem",
    border: "6px solid #f3f3f3",
    borderTop: "6px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  resultCard: {
    backgroundColor: "#ecf9f2",
    padding: "1.5rem",
    borderRadius: "10px",
    marginBottom: "2rem",
    border: "2px solid #27ae60",
  },
  resultLabel: {
    fontSize: "1rem",
    color: "#27ae60",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  resultText: {
    fontSize: "1.5rem",
    color: "#2c3e50",
    marginBottom: "1rem",
    fontWeight: "500",
  },
  textInput: {
    width: "100%",
    padding: "1rem",
    fontSize: "1.5rem",
    borderRadius: "8px",
    border: "2px solid #27ae60",
    marginBottom: "1rem",
    fontFamily: "'Segoe UI', sans-serif",
  },
  retryButton: {
    fontSize: "1rem",
    padding: "0.8rem 1.5rem",
    backgroundColor: "#f39c12",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
  },
  manualInputSection: {
    textAlign: "center",
    marginTop: "2rem",
    marginBottom: "2rem",
  },
  orText: {
    fontSize: "1.2rem",
    color: "#95a5a6",
    fontWeight: "600",
    marginBottom: "1rem",
  },
  manualInput: {
    width: "100%",
    padding: "1.2rem",
    fontSize: "1.3rem",
    borderRadius: "50px",
    border: "2px solid #bdc3c7",
    outline: "none",
    fontFamily: "'Segoe UI', sans-serif",
  },
  nextButton: {
    fontSize: "1.5rem",
    padding: "1.2rem 2.5rem",
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    width: "100%",
    boxShadow: "0 4px 6px rgba(39,174,96,0.3)",
    transition: "all 0.3s",
  },
};
