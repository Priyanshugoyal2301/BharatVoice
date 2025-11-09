import { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import FormUploadScreen from './components/FormUploadScreen';
import AnswerScreen from './components/AnswerScreenNew';
import ReviewScreen from './components/ReviewScreen';
import "./App.css";

function App() {
  const [step, setStep] = useState(0); // 0: Login, 1: Upload Form, 2: Answer, 3: Review
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    extractedText: "",
    questions: [],
    answers: {},
    documents: {},
    autoFilledFields: [], // Track which fields were auto-filled
  });

  return (
    <div className="App">
      {step === 0 && (
        <LoginScreen setStep={setStep} setUser={setUser} />
      )}
      {step === 1 && (
        <FormUploadScreen
          setStep={setStep}
          formData={formData}
          setFormData={setFormData}
          user={user}
        />
      )}
      {step === 2 && (
        <AnswerScreen
          setStep={setStep}
          formData={formData}
          setFormData={setFormData}
          user={user}
        />
      )}
      {step === 3 && (
        <ReviewScreen formData={formData} user={user} setStep={setStep} />
      )}
    </div>
  );
}

export default App;

