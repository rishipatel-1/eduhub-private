/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useEffect, useState } from 'react'
import CourseDetails from './Courses'
import './StudentCourse.css'
import { getCourses } from '../../api/courses'
import { Link } from 'react-router-dom'

const StudentCourse: React.FC = () => {
  const [courses, setCourses] = useState([])
  const fetchCourse = async () => {
    try {
      const resp: any = await getCourses()
      if (resp.status !== 200) {
        console.log('Error While Fetching Course: ', resp)
        return
      }
      setCourses(resp.data.courses)
    } catch (err) {
      console.log('Error While Fetching Course Details: ', err)
    }
  }
  useEffect(() => {
    fetchCourse()
  }, [])

  return (
    <div className="course-container">

          <h2 className="course-title">Your Courses</h2>
          <div className="course-list">
            {courses.map((course: any) => (
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
  )
}

export default StudentCourse
