import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import './Register.css';

// Initialize Firebase (replace with your own Firebase config)
const firebaseConfig = {
  apiKey: "AIzaSyDme3Zms3VBYrCRxxXI4WeuwfGuF-s1Yco",
  authDomain: "sharma-steels.firebaseapp.com",
  projectId: "sharma-steels",
  storageBucket: "sharma-steels.appspot.com",
  messagingSenderId: "189236975985",
  appId: "1:189236975985:web:f146040f57de6989b7bed0",
  measurementId: "G-71KGDBP8L8"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Register = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [verificationId, setVerificationId] = useState(null);

  const sendOtp = () => {
    // Initialize ReCAPTCHA if not already initialized
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: function (response) {
          // reCAPTCHA solved, allow OTP to be sent
          sendOtp();
        },
        'expired-callback': () => {
          // Reset reCAPTCHA if it expires
          window.recaptchaVerifier.reset();
        }
      });
    }
  
    // Render the reCAPTCHA
    window.recaptchaVerifier.render().then(function (widgetId) {
      window.recaptchaWidgetId = widgetId;
    });
  
    const phoneNumber = `+91${mobile}`; // Modify for your country code
  
    firebase.auth().signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        setShowOtpInput(true);
      })
      .catch((error) => {
        console.error('Error sending OTP:', error.message);
      });
  };



  const verifyOtp = () => {
    const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, otp);
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(() => {
        setShowOtpInput(false);
        setShowForm(true); // Show the rest of the form
      })
      .catch((error) => {
        console.log('Error verifying OTP', error);
      });
  };

  return (
    <div className='register-container'>
      {showOtpInput && (
        <div className="otp-container">
          <div className="form-group">
            <label htmlFor="inputMobile">Mobile Number</label>
            <input
              type="tel"
              className="form-control"
              id="inputMobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter Mobile Number"
              pattern="[0-9]{10}"
              required
            />
            <button type="button" className="btn btn-primary" onClick={sendOtp}>
              Send OTP
            </button>
          </div>
          <div id="recaptcha-container"></div>

          <div className="form-group" style={{ marginTop: '10px' }}>
            <label htmlFor="inputOtp">OTP</label>
            <input
              type="text"
              className="form-control"
              id="inputOtp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <button type="button" className="btn btn-success" onClick={verifyOtp}>
              Verify OTP
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <form>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="inputName">Name</label>
              <input
                type="text"
                className="form-control"
                id="inputName"
                placeholder="Full Name"
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="inputEmail4">Email (Optional)</label>
              <input
                type="email"
                className="form-control"
                id="inputEmail4"
                placeholder="Email"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="inputPassword4">Password</label>
              <input
                type="password"
                className="form-control"
                id="inputPassword4"
                placeholder="Password"
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="inputConfirmPassword">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="inputConfirmPassword"
                placeholder="Confirm Password"
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
      )}
    </div>
  );
};

export default Register;
