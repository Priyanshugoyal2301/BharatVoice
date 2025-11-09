import { useState } from "react";
import axios from "axios";

function ReviewScreen({ formData, user, setStep }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const downloadPDF = async () => {
    setLoading(true);
    console.log("📄 Generating PDF...");
    console.log("Form data:", formData);
    console.log("User:", user);
    
    try {
      const data = {
        answers: formData.answers || {},
        documents: formData.documents || {},
        user_profile: user || {}
      };
      
      console.log("Sending to backend:", data);
      
      const response = await axios.post(
        "https://bharatvoice1.onrender.com/generate-filled-form",
        data,
        { responseType: "blob" }
      );
      
      console.log("✅ PDF generated successfully!");
      
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "filled_form.pdf";
      link.click();
      setSuccess(true);
    } catch (err) {
      console.error("❌ Error generating PDF:", err);
      console.error("Error response:", err.response);
      
      // Try to read the error blob
      if (err.response?.data instanceof Blob) {
        const text = await err.response.data.text();
        console.error("Error blob content:", text);
        try {
          const errorJson = JSON.parse(text);
          alert("Error generating PDF: " + (errorJson.detail || text));
        } catch {
          alert("Error generating PDF: " + text);
        }
      } else {
        alert("Error generating PDF: " + (err.response?.data?.detail || err.message));
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "20px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", background: "white", borderRadius: "20px", padding: "40px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          {success ? "✅ Success!" : "📋 Review Form"}
        </h1>
        
        {!success ? (
          <>
            <div style={{ marginBottom: "30px" }}>
              <h2 style={{ borderBottom: "2px solid #667eea", paddingBottom: "10px", marginBottom: "20px" }}>Answers:</h2>
              {Object.entries(formData.answers || {}).map(([id, data]) => (
                <div key={id} style={{ padding: "15px", background: "#f8f9ff", borderRadius: "10px", marginBottom: "10px" }}>
                  <div style={{ color: "#667eea", marginBottom: "5px" }}><strong>Q:</strong> {data.question}</div>
                  <div><strong>A:</strong> {data.answer}</div>
                </div>
              ))}
            </div>
            
            {Object.keys(formData.documents || {}).length > 0 && (
              <div style={{ marginBottom: "30px" }}>
                <h2 style={{ borderBottom: "2px solid #667eea", paddingBottom: "10px", marginBottom: "20px" }}>Documents:</h2>
                {Object.entries(formData.documents).map(([type, info]) => (
                  <div key={type} style={{ padding: "15px", background: "#f8f9ff", borderRadius: "10px", marginBottom: "10px" }}>
                    📎 {type}: {info.filename}
                  </div>
                ))}
              </div>
            )}
            
            <div style={{ display: "flex", gap: "15px" }}>
              <button onClick={() => setStep(2)} style={{ padding: "15px 30px", background: "#f0f0f0", border: "none", borderRadius: "10px", cursor: "pointer" }}>
                ← Back
              </button>
              <button onClick={downloadPDF} disabled={loading} style={{ flex: 1, padding: "20px", fontSize: "20px", fontWeight: "600", background: "#667eea", color: "white", border: "none", borderRadius: "12px", cursor: "pointer" }}>
                {loading ? "Generating..." : "📥 Download PDF"}
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "80px", marginBottom: "20px" }}>🎉</div>
            <h2 style={{ marginBottom: "20px" }}>Form Downloaded!</h2>
            <p style={{ marginBottom: "30px", color: "#666", fontSize: "18px" }}>Your filled form is ready to submit.</p>
            <button onClick={() => window.location.reload()} style={{ padding: "15px 30px", background: "#4caf50", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "16px" }}>
              📝 Fill New Form
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewScreen;