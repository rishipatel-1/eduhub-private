import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react'
import getLoginDetails from '../../../utils/getLoginDetails'
import { signUp } from '../../../api/users'
import { useNavigate } from 'react-router-dom'
import './Register.css'

const Register: React.FC = () => {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string>('')
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
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{}':'\\|,.<>/?]).{8,}$/
    if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password must conatin a capital letter and atleast 8 be character long'
      )
    } else {
      setPasswordError('')
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isPasswordValid(password)) {
      return
    }

    const payload = {
      email,
      username: name,
      password,
      role: 'student',
      Enable_2FactAuth: false
    }

    setName('')
    setEmail('')
    setPassword('')

    signUp(payload)
      .then((response: any) => {
        if (response.status !== 200) {
          console.log('Error While Signup: ', response)
        }
        navigator('/login')
      })
      .catch((error) => {
        console.error('Signup error:', error)
      })
  }

  const isPasswordValid = (password: string): boolean => {
    // Password validation logic
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{}':'\\|,.<>/?]).{8,}$/
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
      if (decoded.role === 'admin') {
        navigator('/Admindashboard')
      } else if (decoded.role === 'student') {
        navigator('/Studentdashboard')
      }
    }
  }, [])

  return (
    <>
      <div className='signup-form'>
        <div className='title'>Register</div>
        <form onSubmit={handleSubmit}>
          <div className='input-boxes'>
            <div className='input-box '>
              <i className='fas fa-user' />
              <input
                type='text'
                placeholder='Enter your name'
                value={name}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setName(event.target.value)
                }}
                required
              />
            </div>
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
            <div className='button input-box'>
              <input type='submit' value='Submit' />
            </div>
            <div className='text sign-up-text'>
              Already have an account? <label htmlFor='flip'>Login now</label>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default Register
