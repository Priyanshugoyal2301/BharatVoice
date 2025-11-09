import { useState } from "react";

function LoginScreen({ setStep, setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleGetStarted = () => {
    setShowForm(true);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      setUser({ name, email });
      setStep(1); // Go to form upload
    }
  };

  const handleSkip = () => {
    setUser({ name: "Guest", email: "guest@example.com" });
    setStep(1);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {!showForm ? (
          <div style={styles.welcomeSection}>
            <div style={styles.logoSection}>
              <div style={styles.logo}>🎙️</div>
              <h1 style={styles.appName}>BharatVoice</h1>
              <p style={styles.tagline}>
                Fill Government Forms with Your Voice
              </p>
            </div>

            <div style={styles.features}>
              <div style={styles.feature}>
                <span style={styles.featureIcon}>🗣️</span>
                <span style={styles.featureText}>Voice-First Input</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.featureIcon}>🤖</span>
                <span style={styles.featureText}>AI-Powered</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.featureIcon}>📄</span>
                <span style={styles.featureText}>Auto-Fill from ID</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.featureIcon}>✨</span>
                <span style={styles.featureText}>Easy & Fast</span>
              </div>
            </div>

            <button onClick={handleGetStarted} style={styles.getStartedButton}>
              Get Started →
            </button>
          </div>
        ) : (
          <div style={styles.formSection}>
            <h2 style={styles.formTitle}>Welcome! 👋</h2>
            <p style={styles.formSubtitle}>
              Enter your details to personalize your experience
            </p>

            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  style={styles.input}
                  required
                />
              </div>

              <button type="submit" style={styles.loginButton}>
                Continue
              </button>

              <button
                type="button"
                onClick={handleSkip}
                style={styles.skipButtonAlt}
              >
                Skip for now
              </button>
            </form>
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>
          Accessible • Secure • Government Approved
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "50px 40px",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  welcomeSection: {
    textAlign: "center",
  },
  logoSection: {
    marginBottom: "40px",
  },
  logo: {
    fontSize: "80px",
    marginBottom: "20px",
  },
  appName: {
    fontSize: "42px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "10px",
  },
  tagline: {
    fontSize: "18px",
    color: "#666",
    fontWeight: "500",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "40px",
  },
  feature: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    padding: "20px",
    background: "#f8f9ff",
    borderRadius: "12px",
  },
  featureIcon: {
    fontSize: "36px",
  },
  featureText: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  },
  getStartedButton: {
    width: "100%",
    padding: "18px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  formSection: {
    textAlign: "center",
  },
  formTitle: {
    fontSize: "32px",
    marginBottom: "10px",
    color: "#333",
  },
  formSubtitle: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    textAlign: "left",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    border: "2px solid #e0e0e0",
    borderRadius: "10px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  loginButton: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
  },
  skipButtonAlt: {
    width: "100%",
    padding: "14px",
    background: "transparent",
    color: "#667eea",
    border: "2px solid #667eea",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  footer: {
    marginTop: "30px",
    textAlign: "center",
  },
  footerText: {
    color: "white",
    fontSize: "14px",
    opacity: 0.9,
  },
};

export default LoginScreen;
