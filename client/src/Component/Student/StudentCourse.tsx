/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useEffect, useState } from 'react'
import CourseDetails from './Courses'
import './StudentCourse.css'
import { getCourses } from '../../api/courses'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../Loader/LoadingSpinner'
import { AxiosResponse } from 'axios'

interface Course {
  _id: string
  title: string
  description: string
}

const StudentCourse: React.FC = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const fetchCourse = async () => {
    try {
      setLoading(true)
      const resp = await getCourses() as AxiosResponse
      if (resp.status !== 200) {
        console.log('Error While Fetching Course: ', resp)
        return
      }

      console.log('Course:', resp.data.courses)
      setCourses(resp.data.courses)
    } catch (err) {
      console.log('Error While Fetching Course Details: ', err)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchCourse()
  }, [])

  return (
    <>
              {loading && (
        <div className="loader-container">
          <div className="text-center">
            <LoadingSpinner/>
          </div>
        </div>
      )}
       <div className={`content ${loading ? 'blur' : ''}`}>
    <div className="course-container">

          <h2 className="course-title">Your Courses</h2>
          <div className="course-list">
            {courses.map((course: Course) => (
              <Link
                className="course-item"
                key={course._id}
                to={`/courseProgress/${course._id}`}
              >
                <h3 className="course-item-title">{course.title}</h3>
                <p className="course-item-description">{course.description}</p>
              </Link>
            ))}
          </div>

    </div>
    </div>
    </>
  )
}

export default StudentCourse
