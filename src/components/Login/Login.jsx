import React from 'react'
import './Login.css'

const Login = () => {
  return (
    <div className='login-container'>
 <form>
        <div className="form-group">
          <label htmlFor="exampleInputMobile">Mobile Number</label>
          <input
            type="tel"
            className="form-control"
            id="exampleInputMobile"
            placeholder="Enter mobile number"
            pattern="[0-9]{10}" // ensures only 10 digits are entered
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
          />
        </div>
        
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  )
}

export default Login
