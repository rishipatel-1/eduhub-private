/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useState, useEffect } from 'react'
import './EmailVerifyPage.css'
import { getCookie } from 'react-use-cookie'
import { useLocation, useNavigate } from 'react-router-dom'
import jwt from 'jwt-decode'

const EmailVerificationSuccess: React.FC = () => {
  const QrCodeUrl = getCookie('QrCodeUrl')
  const [urole, seturole] = useState('')

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const token: any = queryParams.get('token')
  const navigator = useNavigate()

  const redirectUser = async () => {
    const decoded: any = await jwt(token)
    console.log('decoded:', decoded)
    console.log('Decoded: ', decoded?.role)
    seturole(decoded.role)
  }

  const NowRedirect = () => {
    if (urole === 'admin') {
      navigator('/Admindashboard')
    } else if (urole === 'student') {
      navigator('/Studentdashboard')
    }
  }

  useEffect(() => {
    redirectUser()
  }, [])

  return (
    <div className='verifyEmailDiv'>
    <div className="email-verification-success">
      <h2>Email Verification Successful!</h2>
      <p>Your email has been successfully verified. You can now access your account.</p>
      <br />
        <img
          src={`${QrCodeUrl}`}
          alt='QR Code'
          style={{
            marginTop: '20px'
          }}
        />
        <br />
        <button
          className="btn btn-primary"
          onClick={() => {
            NowRedirect()
          }}
          style={{
            marginTop: '20px'
          }}
        >
          Continue
        </button>
    </div>
    </div>
  )
}

export default EmailVerificationSuccess
