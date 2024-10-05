import React, { useState, useEffect } from "react";
import "./Register.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [phone_no, setPhoneNo] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [timer, setTimer] = useState(180);
  const [otpError, setOtpError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userCategory, setUserCategory] = useState("Normal User");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let countdown;
    if (showOtpInput && timer > 0) {
      countdown = setInterval(
        () => setTimer((prevTimer) => prevTimer - 1),
        1000
      );
    } else if (timer === 0) {
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [showOtpInput, timer]);

  const sendOtp = () => {
    if (phone_no.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    axios
      .post("http://sharmasteel.in:8080/user-accounts/send-otp/", { phone_no })
      .then((response) => {
        if (
          response.status === 200 &&
          response.data.message === "OTP sent successfully"
        ) {
          setShowOtpInput(true);
          setTimer(180); 
          toast.success("OTP sent successfully");
        } else {
          toast.error("Error sending OTP. Please try again.");
        }
      })
      .catch((error) => {
       
        if (error.response && error.response.data && error.response.data.message) {
          console.error(error.response.data.message); // Log the error message from API
          toast.error(error.response.data.message);   // Display the error message from API
        } else {
          console.error(error.message); // Fallback to generic error message if API doesn't return a message
          toast.error("Error sending OTP. Please try again.");
        }
      });
  };

  const verifyOtp = () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    axios
      .post("http://sharmasteel.in:8080/user-accounts/verify-otp/", {
        phone_no,
        otp,
      })
      .then((response) => {
        if (
          response.status === 200 &&
          response.data.message === "OTP verified successfully"
        ) {
          setShowForm(true);
          setShowOtpInput(false);
          toast.success("OTP verified successfully");
        } else {
          setOtpError(
            response.data.message ||
              "OTP verification failed. Please try again."
          );
        }
      })
      .catch((error) => {
        setOtpError(
          error.response?.data?.message ||
            "Error verifying OTP. Please try again."
        );
        toast.error(
          error.response?.data?.message ||
            "Error verifying OTP. Please try again."
        );
      });
  };

  const resendOtp = () => {
    setTimer(180);
    sendOtp();
  };

  const handleRegister = (e) => {
    e.preventDefault();
  
    if (!firstName || !lastName || !password || !confirmPassword || !userCategory) {
      toast.error("Please fill out all required fields.");
      return;
    }
  
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }
  
    setPasswordError("");
  
    const registrationData = {
      first_name: firstName,
      last_name: lastName, 
      email,
      password,
      phone_number: phone_no,
      user_catagory: userCategory,
    };
  
    axios
      .post("http://sharmasteel.in:8080/user-accounts/register/", registrationData)
      .then((response) => {
        if (response.status === 201) {
          toast.success("Registration successful");
          setTimeout(() => {
            navigate("/login"); 
          }, 2000);
        } else {
          toast.error("Registration failed. Please try again.");
        }
      })
      .catch((error) => {
        console.log(error.response?.data); // Check for detailed error
  
        // Display the exact error message from the backend
        const backendMessage = error.response?.data?.message;
  
        if (backendMessage) {
          toast.error(backendMessage);
        } else {
          toast.error("Error occurred during registration. Please try again.");
        }
      });
  };
  

  return (
    <div className="register-container">
      <ToastContainer />

      {!showForm && (
        <div className="otp-form-container">
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
              <button
                type="button"
                className="btn btn-primary"
                onClick={sendOtp}
              >
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
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={verifyOtp}
                >
                  Verify OTP
                </button>
              </div>

              {otpError && <p className="error-text">{otpError}</p>}

              <div className="resend-otp">
                {timer > 0 ? (
                  <p>Resend OTP in {timer} seconds</p>
                ) : (
                  <button onClick={resendOtp} className="btn btn-secondary">
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {showForm && (
        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="inputFirstName">First Name</label>
              <input
                type="text"
                className="form-control"
                id="inputFirstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="inputLastName">Last Name</label>
              <input
                type="text"
                className="form-control"
                id="inputLastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="inputEmail4">Email</label>
              <input
                type="email"
                className="form-control"
                id="inputEmail4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="inputPassword4">Password</label>
              <input
                type="password"
                className="form-control"
                id="inputPassword4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
              />
              {passwordError && <p className="error-text">{passwordError}</p>}
            </div>
          </div>

          <div className="form-row">
           <div className="form-group col-md-6">
              <label htmlFor="userCategory">User Category</label>
            <select
                className="form-control"
                 id="userCategory"
                 value={userCategory}
                 onChange={(e) => setUserCategory(e.target.value)}                
                  required
               >
                 <option value="Normal User">Normal User (default)</option>
                 <option value="Contractor">Contractor</option>
              </select>
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















// import React, { useState, useEffect } from "react";
// import "./Register.css";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//   const [phone_no, setPhoneNo] = useState("");
//   const [otp, setOtp] = useState("");
//   const [showOtpInput, setShowOtpInput] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [timer, setTimer] = useState(180);
//   const [otpError, setOtpError] = useState("");

//   const [name, setName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [userCategory, setUserCategory] = useState("Normal User");
//   const [passwordError, setPasswordError] = useState("");
//   const navigate = useNavigate();
//   // Timer logic to resend OTP
//   useEffect(() => {
//     let countdown;
//     if (showOtpInput && timer > 0) {
//       countdown = setInterval(
//         () => setTimer((prevTimer) => prevTimer - 1),
//         1000
//       );
//     } else if (timer === 0) {
//       clearInterval(countdown);
//     }
//     return () => clearInterval(countdown);
//   }, [showOtpInput, timer]);

//   const sendOtp = () => {
//     if (phone_no.length !== 10) {
//       toast.error("Please enter a valid 10-digit mobile number");
//       return;
//     }

//     axios
//       .post("http://sharmasteel.in:8080/user-accounts/send-otp/", { phone_no })
//       .then((response) => {
//         if (
//           response.status === 200 &&
//           response.data.message === "OTP sent successfully"
//         ) {
//           setShowOtpInput(true);
//           setTimer(180); 
//           toast.success("OTP sent successfully");
//         } else {
//           toast.error("Error sending OTP. Please try again.");
//         }
//       })
//       .catch((error) => {
//         toast.error("Error sending OTP. Please try again.");
//       });
//   };

//   const verifyOtp = () => {
//     if (!otp) {
//       toast.error("Please enter the OTP");
//       return;
//     }

//     axios
//       .post("http://sharmasteel.in:8080/user-accounts/verify-otp/", {
//         phone_no,
//         otp,
//       })
//       .then((response) => {
//         if (
//           response.status === 200 &&
//           response.data.message === "OTP verified successfully"
//         ) {
//           setShowForm(true);
//           setShowOtpInput(false);
//           toast.success("OTP verified successfully");
//         } else {
//           setOtpError(
//             response.data.message ||
//               "OTP verification failed. Please try again."
//           );
//         }
//       })
//       .catch((error) => {
//         setOtpError(
//           error.response?.data?.message ||
//             "Error verifying OTP. Please try again."
//         );
//         toast.error(
//           error.response?.data?.message ||
//             "Error verifying OTP. Please try again."
//         );
//       });
//   };

//   const resendOtp = () => {
//     setTimer(180);
//     sendOtp();
//   };

//   const handleRegister = (e) => {
//     e.preventDefault();

//     if (!name || !password || !confirmPassword || !userCategory) {
//       toast.error("Please fill out all required fields.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setPasswordError("Passwords do not match");
//       toast.error("Passwords do not match");
//       return;
//     }

//     setPasswordError("");

//     const registrationData = {
//       first_name:,
//       last_name:, 
//       email,
//       password,
//       phone_number: phone_no,
//       user_catagory: userCategory,
//     };

//     axios
//     .post("http://sharmasteel.in:8080/user-accounts/register/", registrationData)
//     .then((response) => {
//       if (response.status === 200) {
//         toast.success("Registration successful");
//         setTimeout(() => {
//           navigate("/login"); // Redirect to the login page after 2 seconds
//         }, 2000);
//       } else {
//         toast.error("Registration failed. Please try again.");
//       }
//     })
//     .catch((error) => {
//       console.log(error.response?.data); // Check for detailed error
  
//       // Display the exact error message from the backend
//       const backendMessage = error.response?.data?.message;
  
//       if (backendMessage) {
//         toast.error(backendMessage);
//       } else {
//         toast.error("Error occurred during registration. Please try again.");
//       }
//     });
  
     
//   };
  

//   return (
//     <div className="register-container">
//       <ToastContainer />

//       {!showForm && (
//         <div className="otp-form-container">
//           <div className="form-group">
//             <label htmlFor="inputMobile">Mobile Number</label>
//             <input
//               type="tel"
//               className="form-control"
//               id="inputMobile"
//               value={phone_no}
//               onChange={(e) => setPhoneNo(e.target.value)}
//               placeholder="Enter Mobile Number"
//               pattern="[0-9]{10}"
//               required
//             />
//             {!showOtpInput && (
//               <button
//                 type="button"
//                 className="btn btn-primary"
//                 onClick={sendOtp}
//               >
//                 Send OTP
//               </button>
//             )}
//           </div>

//           {showOtpInput && (
//             <>
//               <div className="form-group">
//                 <label htmlFor="inputOtp">Enter OTP</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="inputOtp"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   placeholder="Enter OTP"
//                   required
//                 />
//                 <button
//                   type="button"
//                   className="btn btn-success"
//                   onClick={verifyOtp}
//                 >
//                   Verify OTP
//                 </button>
//               </div>

//               {otpError && <p className="error-text">{otpError}</p>}

//               <div className="resend-otp">
//                 {timer > 0 ? (
//                   <p>Resend OTP in {timer} seconds</p>
//                 ) : (
//                   <button onClick={resendOtp} className="btn btn-secondary">
//                     Resend OTP
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       )}

//       {showForm && (
//         <form className="register-form" onSubmit={handleRegister}>
//           <div className="form-row">
//             <div className="form-group col-md-6">
//               <label htmlFor="inputName">Full Name</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="inputName"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="Full Name"
//                 required
//               />
//             </div>
//             <div className="form-group col-md-6">
//               <label htmlFor="inputEmail4">Email</label>
//               <input
//                 type="email"
//                 className="form-control"
//                 id="inputEmail4"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Email"
//                 required
//               />
//             </div>
//           </div>
//           <div className="form-row">
//             <div className="form-group col-md-6">
//               <label htmlFor="inputPassword4">Password</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 id="inputPassword4"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Password"
//                 required
//               />
//             </div>
//             <div className="form-group col-md-6">
//               <label htmlFor="inputConfirmPassword">Confirm Password</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 id="inputConfirmPassword"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 placeholder="Confirm Password"
//                 required
//               />
//               {passwordError && <p className="error-text">{passwordError}</p>}
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group col-md-6">
//               <label htmlFor="userCategory">User Category</label>
//               <select
//                 className="form-control"
//                 id="userCategory"
//                 value={userCategory}
//                 onChange={(e) => setUserCategory(e.target.value)}
//                 required
//               >
//                 <option value="Normal User">Normal User (default)</option>
//                 <option value="Contractor">Contractor</option>
//               </select>
//             </div>
//           </div>

//           <button type="submit" className="btn btn-primary">
//             Register
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default Register;
