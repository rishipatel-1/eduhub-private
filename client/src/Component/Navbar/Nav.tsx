import React, { useState, useEffect, Children, ReactNode } from 'react'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { setCookie } from 'react-use-cookie'
import { IoLogOutOutline } from 'react-icons/io5'

interface NavbarProps {
  isAdmin: boolean
  children: ReactNode
}
const Navbar = ({ isAdmin, children }: NavbarProps) => {
  const [isMenuOpen, setMenuOpen] = useState(window.innerWidth >= 700)
  const [isMobile, setIsMobile] = useState(false)
  const [isDashboardVisible, setDashboardVisible] = useState(false)
  const navigator = useNavigate()

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth > 700)
    }

    handleResize() // Check initial screen width
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  function handleSignout (): void {
    setCookie('token', '', { path: '/' })
    navigator('/login')
  }

  return (
    <div>
      <div className="top-bar">
        {isMobile && (
          <div>
          <i
            className={`nav__toggle fa ${isMenuOpen ? 'fa-times' : 'fa-bars'
              } m-2`}
            aria-hidden="true"
            onClick={toggleMenu}
          ></i>
              <strong>
                  Edu<span>Hub</span>
                </strong>
          </div>
        )}
        {!isMobile && (
          <div>
          <img
            className="logo__icon ms-2 rounded-4"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaj1fmCB9MtpT1zpCv6vARJMN_wqmgIa_QIQ&usqp=CAU"
            alt="Logo"
            onClick={toggleMenu}
          />
          <strong>
          Edu<span>Hub</span>
        </strong>
        </div>
        )}
        <div className='d-flex'>
        <div className="Logout-main" onClick={handleSignout}>
        <IoLogOutOutline className='me-1 icon-logout'/><span className='log-out-text me-3'>Log out</span>
            </div>
        </div>
      </div>
      <div className="d-flex">
        {isMenuOpen && (
          <div>
            <nav className={`nav ${isMobile ? 'show' : ''}`}>
              <div className="m-logo">
                <img
                  className="logo__icon rounded-4"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaj1fmCB9MtpT1zpCv6vARJMN_wqmgIa_QIQ&usqp=CAU"
                  alt="Logo"
                />
                <strong className='Eduhub-text'>
                  Edu <span>Hub</span>
                </strong>
              </div>
              <hr className='m-0 mt-3' />
              {isAdmin === true && (
                <>
                  <Link
                    className="nav__item mt-4"
                    role="button"
                    to="/AdminDashboard"
                    style={{
                      textDecoration: 'none',
                      color: 'white'
                    }}
                  >
                    <i className="fa fa-home" aria-hidden="true"></i>
                    <span>Dashboard</span>
                  </Link>
                  <Link className="nav__item" role="button" to='/manageEnrollment' style={{
                    textDecoration: 'none',
                    color: 'white'
                  }}>
                    <i className="fa fa-users" aria-hidden="true"></i>
                    <span>Manage Students</span>
                  </Link>
                </>
              )}

              {isAdmin === false && (
                <Link className="nav__item mt-3" role="button" to='/courses'
                  style={{
                    textDecoration: 'none',
                    color: 'white'
                  }}
                >
                  <i className="fa fa-graduation-cap" aria-hidden="true"></i>
                  <span>Courses</span>
                </Link>
              )}

              <div className="nav-footer" onClick={toggleMenu}>
                <i className="fa fa-angle-left" aria-hidden="true"></i>
              </div>

            </nav>
          </div>
        )}

        <main className="main">
          <div className="title-bar text-center me-4">
            <h2>Overview</h2>
          </div>
          <div className="content-area">
            {!isDashboardVisible &&
              (
                <p className="text-center">
                  {isAdmin === true
                    ? (
                      <>
                       <strong className='text-welcome'> Welcome Admin</strong>{' '}
                        <i className="fa fa-smile-o" aria-hidden="true"></i>
                      </>
                    )
                    : (
                      <>
                        <strong className='text-welcome'> Welcome Student</strong>{' '}
                        <i className="fa fa-smile-o" aria-hidden="true"></i>
                      </>
                    )}
                </p>
              )}

            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Navbar
