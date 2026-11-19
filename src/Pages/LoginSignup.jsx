import React, { useState, useContext } from 'react'
import './CSS/LoginSignup.css'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { ShopContext } from '../Context/ShopContext'

const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(true)
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useContext(ShopContext)
  const navigate = useNavigate()

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async () => {
    if (isSignup && !agree) return alert('Pehle Terms ko accept karein')
    setLoading(true)
    try {
      const data = await api(isSignup ? '/api/auth/signup' : '/api/auth/login', {
        method: 'POST',
        body: form,
      })
      login(data.token, data.user)
      navigate('/')
    } catch (e) {
      alert(e.message)
    }
    setLoading(false)
  }

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <div className="loginsignup-header">
          <h1>{isSignup ? 'Create Account' : 'Login'}</h1>
          <p>{isSignup ? 'Join us today and start shopping' : 'Welcome back'}</p>
        </div>

        <div className="loginsignup-fields">
          {isSignup && (
            <div className="input-group">
              <label>Full Name</label>
              <input name="full_name" value={form.full_name} onChange={onChange}
                type="text" placeholder="Enter your name" />
            </div>
          )}
          <div className="input-group">
            <label>Email Address</label>
            <input name="email" value={form.email} onChange={onChange}
              type="email" placeholder="Enter your email" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input name="password" value={form.password} onChange={onChange}
              type="password" placeholder="Enter your password" />
          </div>
        </div>

        <button className="signup-button" onClick={submit} disabled={loading}>
          {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Login'}
        </button>

        <p className="loginsignup-login">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={() => setIsSignup(!isSignup)} style={{ cursor: 'pointer' }}>
            {isSignup ? ' Login here' : ' Sign up here'}
          </span>
        </p>

        {isSignup && (
          <div className="loginsignup-agree">
            <input type="checkbox" id="agree" checked={agree}
              onChange={(e) => setAgree(e.target.checked)} />
            <label htmlFor="agree">
              By continuing, I agree to the <span>Terms of Use</span> and{' '}
              <span>Privacy Policy</span>.
            </label>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginSignup