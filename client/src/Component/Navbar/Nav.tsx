import React, { useState, useEffect, Children } from 'react'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { setCookie } from 'react-use-cookie'

const Navbar = ({ isAdmin, children }: any) => {
  // Accept a prop "isAdmin" to determine the user role
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

  function handleSignout (event: any): void {
    setCookie('token', '', { path: '/' })
    navigator('/login')
  }

  return (
    <div>
      <div className="top-bar">
        {isMobile && (
          <i
            className={`nav__toggle fa ${isMenuOpen ? 'fa-times' : 'fa-bars'
              } m-2`}
            aria-hidden="true"
            onClick={toggleMenu}
          ></i>
        )}
        {!isMobile && (
          <img
            className="logo__icon ms-2"
            src="https://www.youshe.id/favicon.ico"
            alt="Logo"
            onClick={toggleMenu}
          />
        )}
        <div className="drop-item  fixed-bottom-dropdown">
        <a
  href="#"
  className="d-flex align-items-center text-decoration-none dropdown-toggle text-white"
  id="dropdownUser2"
  data-bs-toggle="dropdown"
  aria-expanded="false"
>
  <div className="sign-out-icon text-white">
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M11.5 4.5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0v-6zm-4.5 9a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 1 0v2a.5.5 0 0 1-.5.5zm5-9a.5.5 0 0 1 0-1H13a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6.5a.5.5 0 0 1 0-1H13a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H6.5a.5.5 0 0 1 0-1H13z"/>
    </svg>
  </div>
</a>

          <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
            <li>
              <div className="dropdown-item" onClick={handleSignout}>
                Sign out
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="d-flex">
        {isMenuOpen && (
          <div>
            <nav className={`nav ${isMobile ? 'show' : ''}`}>
              <div className="m-logo">
                <img
                  className="logo__icon"
                  src="https://www.youshe.id/favicon.ico"
                  alt="Logo"
                />
                <strong>
                  Edu <span>Hub</span>
                </strong>
              </div>
              <hr />
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
                  <Link
                    className="nav__item"
                    role="button"
                    to="/gradeStudent"
                    style={{
                      textDecoration: 'none',
                      color: 'white'
                    }}
                  >
                    <i className="fa fa-user" aria-hidden="true"></i>
                    <span>Student Update</span>
                  </Link>
                </>
              )}

              {isAdmin === false && (
                <Link className="nav__item" role="button" to='/courses'
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
                        Welcome Admin{' '}
                        <i className="fa fa-smile-o" aria-hidden="true"></i>
                      </>
                      )
                    : (
                      <>
                        Welcome Student{' '}
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
