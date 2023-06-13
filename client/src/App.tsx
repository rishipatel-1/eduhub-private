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

function App () {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/email-verified" element={<EmailVerificationSuccess />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<SharedLayout/>} >
            <Route path='/AdminDashboard' Component={DashboardComponent} />
            <Route path='/Studentdashboard' Component={StudentCourse} />
            <Route path='/ShowCourseDetails/:courseId' Component={Coursedetails} />
            <Route path='/manageEnrollment' Component={UserComponent} />
            <Route path='/courses' Component={StudentCourse} />
            <Route path='/courseProgress/:courseId' Component={CourseProgress} />
            <Route path='/gradeStudent/:studentId' Component={UserDetailsComponent} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
