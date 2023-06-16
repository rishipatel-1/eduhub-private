import React, { useState } from 'react'
import Login from './pages/auth/Login/Login'
import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom'
import './App.css'
import EmailVerificationSuccess from './pages/auth/verify_email/EmailVerifyPage'
import SharedLayout from './pages/sharedLayout/SharedLayout'
import DashboardComponent from './Component/dashboard/DashboardComponent'
import UserComponent from './Component/StudentDetails/StudentComponent'
import CourseProgress from './Component/Student/Courses'
import Coursedetails from './Component/Course/Coursedetails'
import UserDetailsComponent from './Component/StudentDetails/StudentDetailsComponent'
import StudentCourse from './Component/Student/StudentCourse'
import ErrorBoundary from './Component/ErrorBoundry/ErrorBoundry'

function App () {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/email-verified" element={<EmailVerificationSuccess />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<ErrorBoundary><SharedLayout /></ErrorBoundary>}>
            <Route path='/AdminDashboard' element={<ErrorBoundary><DashboardComponent /></ErrorBoundary>} />
            <Route path='/Studentdashboard' element={<ErrorBoundary><StudentCourse /></ErrorBoundary>} />
            <Route path='/ShowCourseDetails/:courseId' element={<ErrorBoundary><Coursedetails /></ErrorBoundary>} />
            <Route path='/manageEnrollment' element={<ErrorBoundary><UserComponent /></ErrorBoundary>} />
            <Route path='/courses' element={<ErrorBoundary><StudentCourse /></ErrorBoundary>} />
            <Route path='/courseProgress/:courseId' element={<ErrorBoundary><CourseProgress /></ErrorBoundary>} />
            <Route path='/gradeStudent/:studentId' element={<ErrorBoundary><UserDetailsComponent /></ErrorBoundary>} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
