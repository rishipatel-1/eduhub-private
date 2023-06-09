/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import getLoginDetails from '../../../utils/getLoginDetails'
import { signUp } from '../../../api/users'
import { useNavigate } from 'react-router-dom'

const Register: React.FC = () => {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const navigator = useNavigate()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('Name:', name)
    console.log('Email:', email)
    console.log('Password:', password)

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
    signUp(payload).then((response: any) => {
      if (response.status !== 200) {
        console.log('Error While Signup: ', response)
      }
      console.log('Signup successful:', response)
      navigator('/login')
      toast.success(response.data.message)
    })
      .catch((error) => {
        console.error('Signup error:', error)
      })
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
      <Toaster />
      <div className="signup-form">
        <div className="title">Signup</div>
        <form onSubmit={handleSubmit}>
          <div className="input-boxes">
            <div className="input-box">
              <i className="fas fa-user" />
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(event) => { setName(event.target.value) }}
                required
              />
            </div>
            <div className="input-box">
              <i className="fas fa-envelope" />
              <input
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => { setEmail(event.target.value) }}
                required
              />
            </div>
            <div className="input-box">
              <i className="fas fa-lock" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => { setPassword(event.target.value) }}
                required
              />
            </div>
            <div className="button input-box">
              <input type="submit" value="Submit" />
            </div>
            <div className="text sign-up-text">
              Already have an account? <label htmlFor="flip">Login now</label>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default Register
