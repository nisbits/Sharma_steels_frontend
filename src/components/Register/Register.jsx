import React, { useState, useEffect } from 'react';
import './Register.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [phone_no, setPhoneNo] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [timer, setTimer] = useState(180);
  const [otpError, setOtpError] = useState('');

  // Timer logic to resend OTP
  useEffect(() => {
    let countdown;
    if (showOtpInput && timer > 0) {
      countdown = setInterval(() => setTimer((prevTimer) => prevTimer - 1), 1000);
    } else if (timer === 0) {
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [showOtpInput, timer]);

  const sendOtp = () => {
    if (phone_no.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    axios.post('http://sharmasteel.in:8080/user-accounts/send-otp/', { phone_no })
      .then((response) => {
        console.log('OTP Send Response:', response.data); // Debugging

        // Check if the message field contains "OTP sent successfully"
        if (response.status === 200 && response.data.message === 'OTP sent successfully') {
          setShowOtpInput(true);
          setTimer(180); // Reset timer to 180 seconds
          toast.success('OTP sent successfully');
        } else {
          toast.error('Error sending OTP. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error sending OTP:', error.response ? error.response.data : error.message);
        toast.error('Error sending OTP. Please try again.');
      });
  };

  const verifyOtp = () => {
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    axios.post('http://sharmasteel.in:8080/user-accounts/verify-otp/', { phone_no, otp })
    .then((response) => {
      console.log('OTP Verification Response:', response.data);

      // Check if the message field contains "OTP verified successfully"
      if (response.status === 200 && response.data.message === 'OTP verified successfully') {
        setShowForm(true); // Show form if OTP is correct
        setShowOtpInput(false); // Hide OTP input fields
        toast.success('OTP verified successfully');
      } else {
        // Display the error message sent from the API
        setOtpError(response.data.message || 'OTP verification failed. Please try again.');
      }
    })
    .catch((error) => {
      console.error('Error verifying OTP:', error.response ? error.response.data : error.message);
      
      // Display the dynamic error message returned by the API
      setOtpError(error.response?.data?.message || 'Error verifying OTP. Please try again.');
      toast.error(error.response?.data?.message || 'Error verifying OTP. Please try again.');
    });
};

  const resendOtp = () => {
    setTimer(180);
    sendOtp();
  };

  return (
    <div className='register-container'>
      <ToastContainer /> {/* Include ToastContainer for toast notifications */}

      {!showForm && (
        <div className='otp-form-container'>
          <div className="form-group">
            <label htmlFor="inputMobile">Mobile Number</label>
            <input
              type="tel"
              className="form-control"
              id="inputMobile"
              value={phone_no}
              onChange={(e) => setPhoneNo(e.target.value)}
              placeholder="Enter Mobile Number"
              pattern="[0-9]{10}"
              required
            />
            {!showOtpInput && (
              <button type="button" className="btn btn-primary" onClick={sendOtp}>
                Send OTP
              </button>
            )}
          </div>

          {showOtpInput && (
            <>
              <div className="form-group">
                <label htmlFor="inputOtp">Enter OTP</label>
                <input
                  type="text"
                  className="form-control"
                  id="inputOtp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                />
                <button type="button" className="btn btn-success" onClick={verifyOtp}>
                  Verify OTP
                </button>
              </div>

              {otpError && <p className="error-text">{otpError}</p>}

              <div className="resend-otp">
                {timer > 0 ? (
                  <p>Resend OTP in {timer} seconds</p>
                ) : (
                  <button onClick={resendOtp} className="btn btn-secondary">Resend OTP</button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {showForm && (
        <form className='register-form'>
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

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="userCategory">User Category</label>
              <select className="form-control" id="userCategory" required>
                <option value="Normal User">Normal User (default)</option>
                <option value="Contractor">Contractor</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Register</button>
        </form>
      )}
    </div>
  );
};

export default Register;
