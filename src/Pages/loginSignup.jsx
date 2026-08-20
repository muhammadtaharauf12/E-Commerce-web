import React from 'react'
import './CSS/LoginSignup.css'

const LoginSignup = () => {
  return (
    <div className="loginsignup">
      <div className="loginsignup-container">

        <div className="loginsignup-header">
          <h1>Create Account</h1>
          <p>Join us today and start shopping</p>
        </div>

        <div className="loginsignup-fields">
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
            />
          </div>
        </div>

        <button className="signup-button">
          Create Account
        </button>

        <p className="loginsignup-login">
          Already have an account?
          <span> Login here</span>
        </p>

        <div className="loginsignup-agree">
          <input type="checkbox" id="agree" />
          <label htmlFor="agree">
            By continuing, I agree to the{" "}
            <span>Terms of Use</span> and{" "}
            <span>Privacy Policy</span>.
          </label>
        </div>

      </div>
    </div>
  );
};




export default LoginSignup