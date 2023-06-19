/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import './Login.css'
import Registerr from '../Register/Register'
import { login } from '../../../api/users'
import getLoginDetails from '../../../utils/getLoginDetails'
import { setCookie } from 'react-use-cookie'
import jwt from 'jwt-decode'

const Login: React.FC = () => {
  const [showPassword, setShowPassowrd] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const navigator = useNavigate()

  const handleSubmit = (event: any) => {
    console.log('clicked')
    event.preventDefault()

    login({ email, password, code }).then(async (resp: any) => {
      console.log(resp)
      if (resp === null || resp === undefined) {
        toast.error('Invalid UserName or Password')
        return
      }

      if (resp.status !== 200) {
        console.log('Error Whle Logging in: ', resp)
      }

      setCookie('token', resp.data.token, { path: '/' })

      const user: any = await jwt(resp.data.token)

      if (user.role === 'admin') {
        navigator('/Admindashboard')
      } else if (user.role === 'student') {
        navigator('/Studentdashboard')
      }
      console.log('Logged In if here')
    }).catch(err => {
      console.log('Error While Logging in: ', err)
    })
  }

  useEffect(() => {
    const decoded: any = getLoginDetails()
    if (decoded) {
      if (decoded.role === 'student') {
        navigator('/Studentdashboard')
      } else if (decoded.role === 'admin') {
        navigator('/Admindashboard')
      }
    }
  }, [])

  return (
    <div className="main-container">
      <div className="container LoginContainer">
        <input type="checkbox" id="flip" />
        <div className="cover">
          <div className="front">
            <img
              src="https://img.freepik.com/free-vector/computer-login-concept-illustration_114360-7962.jpg?w=2000"
              className="frontimage"
              alt=""
            />
          </div>
          <div className="back">
            <img
              src="https://img.freepik.com/free-vector/sign-up-concept-illustration_114360-7965.jpg?w=2000"
              className="backimage"
              alt=""
            />
          </div>
        </div>
        <div className="forms">
          <div className="form-content">
            <div className="login-form">
              <div className="title">Login</div>
              <form onSubmit={handleSubmit}>
                <div className="input-boxes">
                  <div className="input-box">
                    <i className="fas fa-envelope" />
                    <input
                      type="text"
                      placeholder="Enter your email"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value) }}
                    />
                  </div>
                  <div className="input-box">
                    <i className="fas fa-lock" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value) }}
                      />
                  </div>
                  {/* <div className="input-box">
                    <i className="fas fa-lock" />
                    <input
                      placeholder="Enter your code"
                      value={code}
                      onChange={(e) => { setCode(e.target.value) }}
                    />
                  </div> */}
                  <div className="text">
                    <Link to="/forgot-password">Forgot password?</Link>
                  </div>
                  <div className="button input-box">
                    <input
                      type="submit"
                      value="Submit"
                      onClick={handleSubmit}
                    />
                  </div>
                  <div className="text sign-up-text">
                  Don&apos;t have an account&#x3f;{' '}
                    <label htmlFor="flip">Register now</label>

                  </div>
                </div>
              </form>
            </div>
            <Registerr />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
