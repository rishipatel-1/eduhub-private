import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
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
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [code, setCode] = useState('')
  const navigator = useNavigate()

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
    validateEmail(event.target.value)
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
    validatePassword(event.target.value)
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) {
      setEmailError('Enter a valid email address')
    } else {
      setEmailError('')
    }
  }

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{}':"\\|,.<>/?]).{8,}$/
    if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password must conatin a capital letter and atleast be 8 character long'
      )
    } else {
      setPasswordError('')
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isEmailValid(email) || !isPasswordValid(password)) {
      return
    }

    login({ email, password, code })
      .then(async (resp: any) => {
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
      })
      .catch((err) => {
        console.log('Error While Logging in: ', err)
      })
  }

  const isEmailValid = (email: string): boolean => {
    // Email validation logic
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) {
      setEmailError('Enter a valid email address')
      return false
    }

    setEmailError('')
    return true
  }

  const isPasswordValid = (password: string): boolean => {
    // Password validation logic
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{}':"\\|,.<>/?]).{8,}$/
    if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password should be at least 8 characters long, contain at least one capital letter, and one special symbol'
      )
      return false
    }

    setPasswordError('')
    return true
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
                <div className='d-flex flex-column  position-relative'>
            <div className='input-box mb-3'>
<i className='fas fa-envelope' />
              <input
                type='text'
                placeholder='Enter your email'
                value={email}
                onChange={handleEmailChange}
                required
              />
</div>
              <div className='position-absolute errorDivemail'>
                {emailError && (
                  <span className='input-error'>{emailError}</span>
                )}
              </div>
            </div>
            <div className='d-flex flex-column  position-relative'>
              <div className='input-box mb-5'>
                <i className='fas fa-lock' />
                <input
                  type='password'
                  placeholder='Enter your password'
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className='position-absolute errorDiv'>
                {passwordError && (
                  <span className='input-error'>{passwordError}</span>
                )}
              </div>
            </div>
                  {/* <div className="text">
                    <Link to="/forgot-password">Forgot password?</Link>
                  </div> */}
                  <div className="button input-box">
                    <input type="submit" value="Submit" />
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
