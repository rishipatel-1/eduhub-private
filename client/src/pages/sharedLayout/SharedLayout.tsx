/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Nav from '../../Component/Navbar/Nav'
import getLoginDetails from '../../utils/getLoginDetails'

const SharedLayout = () => {
  const decoded: any = getLoginDetails()
  const navigator = useNavigate()

  useEffect(() => {
    console.log('Checking ', decoded)
    if (!decoded.role) {
      navigator('/login')
    }
  }, [])

  return (
    <>
      <Toaster />
      <Nav isAdmin={decoded.role === 'admin'}>
        <Outlet />
      </Nav>
    </>
  )
}

export default SharedLayout
