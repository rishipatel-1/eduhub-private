/* eslint-disable @typescript-eslint/prefer-optional-chain */
import React, { useEffect, useState } from 'react'
import { Table, Form, Button } from 'react-bootstrap'
import './StudentDetails.css'
import { useNavigate, useParams } from 'react-router-dom'
import { getAllSubmission4, gradeSubmission } from '../../api/submission'
import LoadingSpinner from '../Loader/LoadingSpinner'

interface Course {
  courseId: string
  courseName: string
  practicals: Practical[]
}

interface Practical {
  practicalId: string
  practicalName: string
  status: string
  grade: number | null
  isEditing: boolean
  tempGrade: number | null
}
const StudentDetailsComponent: React.FC = () => {
  const navigate = useNavigate()
  const { studentId } = useParams()
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState<Course[]>([
    {
      courseId: 'course1',
      courseName: 'Course 1',
      practicals: [
        { practicalId: 'practical1', practicalName: 'Practical 1', status: 'Not Submitted', grade: null, isEditing: false, tempGrade: null },
        { practicalId: 'practical2', practicalName: 'Practical 2', status: 'Submitted', grade: null, isEditing: false, tempGrade: null }
      ]
    },
    {
      courseId: 'course2',
      courseName: 'Course 2',
      practicals: [
        { practicalId: 'practical3', practicalName: 'Practical 3', status: 'Not Submitted', grade: null, isEditing: false, tempGrade: null },
        { practicalId: 'practical4', practicalName: 'Practical 4', status: 'Not Submitted', grade: null, isEditing: false, tempGrade: null }
      ]
    }
  ])
  const [submissions, setSubmissions] = useState<any[]>()
  const [student, setStudent] = useState<{ name: string, email: string, stack: string } | null>(null)

  const fetchAllSubmission = async () => {
    setLoading(true) // Set loading to true while fetching data
    try {
      const resp = await getAllSubmission4(studentId)
      if (resp && resp.status && resp.status !== 200) {
        console.log('Error While fetching submissions')
        return
      }
      const subm = resp?.data?.submissions?.map((item: { chapters: any[] }) => {
        const chapters = item.chapters.map((chapter: any) => {
          return {
            ...chapter,
            tempgrade: null,
            isEditing: false
          }
        })
        return {
          ...item,
          chapters
        }
      })
      setStudent(resp?.data?.student)
      setSubmissions(subm)
    } catch (err) {
      console.log('Error While Fetching Submissions: ', err)
    } finally {
      setLoading(false) // Set loading to false after data is received or when there is an error
    }
  }
  useEffect(() => {
    fetchAllSubmission().catch(err => {
      console.log('Error While Fetching Submissions: ', err)
    })
  }, [])
  const handleGradeChange = (courseId: string, practicalId: string, grade: number) => {
    setCourses((prevCourses) => {
      const updatedCourses = prevCourses.map((course) => {
        if (course.courseId === courseId) {
          const updatedPracticals = course.practicals.map((practical) => {
            if (practical.practicalId === practicalId) {
              return { ...practical, tempGrade: grade }
            }
            return practical
          })
          return { ...course, practicals: updatedPracticals }
        }
        return course
      })
      return updatedCourses
    })
  }
  const toggleGradeEdit = (courseId: string, practicalId: string) => {
    setSubmissions((prevCourses: any) => {
      const updatedCourses = prevCourses.map((course: any) => {
        if (course.courseId === courseId) {
          const updatedPracticals = course.chapters.map((practical: any) => {
            if (practical._id === practicalId) {
              return { ...practical, isEditing: !practical.isEditing, tempGrade: null }
            }
            return practical
          })
          return { ...course, practicals: updatedPracticals }
        }
        return course
      })
      return updatedCourses
    })
  }

  const submitGrade = (courseId: string, practicalId: string, submissionId: string) => {
    setCourses((prevCourses) => {
      const updatedCourses = prevCourses.map((course) => {
        if (course.courseId === courseId) {
          const updatedPracticals = course.practicals.map((practical) => {
            if (practical.practicalId === practicalId) {
              const grade = practical.tempGrade !== null ? Math.max(0, Math.min(100, practical.tempGrade)) : null
              return { ...practical, grade, status: grade !== null ? 'Submitted' : 'Not Submitted', isEditing: false }
            }
            return practical
          })
          return { ...course, practicals: updatedPracticals }
        }
        return course
      })
      return updatedCourses
    })
  }

  return (
  <>
    {loading && (
      <div className="loader-container">
        <div className="text-center">
          <LoadingSpinner />
        </div>
      </div>
    )}
    <div className={`content ${loading ? 'blur' : ''}`}>
      <div className="container mt-3">
        <div>
          <button
            className="back-btn"
            onClick={() => {
              navigate('/manageEnrollment')
            }}
          >
            &larr; &nbsp; Back
          </button>
        </div>
        <h3>Student Details</h3>
        <p>Name: {student?.name ? student?.name : 'Test User'}</p>
        <p>Email: {student?.email}</p>
        <p>Stack: {student?.stack}</p>
        <Table striped bordered className="mt-4 rounded-3">
          <thead>
            <tr>
              <th>Course</th>
              <th>Practical</th>
              <th>Status</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {submissions && submissions?.map((course) =>
              course.chapters.map((practical: any, index: number) => (
                <tr key={practical._id}>
                  {index === 0 && <td rowSpan={course.chapters.length}>{course.title}</td>}
                  <td>{practical.practical}</td>
                  <td>{practical.submissions.length > 0 ? practical.submissions[0]?.status : 'Not Submitted'}</td>
                  <td>
                    {practical.submissions.length > 0 && practical.submissions[0]?.status === 'Submitted' && !practical.isEditing ? (
                      <div onClick={() => toggleGradeEdit(course._id, practical._id)}>
                        {practical.submissions[0]?.grade !== null ? `Graded: ${practical.submissions[0]?.grade}` : 'Grade it'}
                      </div>
                    ) : practical.isEditing ? (
                      <Form.Group className="mb-0">
                        <Form.Control
                          type="number"
                          placeholder="Enter grade"
                          value={practical.tempGrade !== null ? practical.tempGrade.toString() : ''}
                          onChange={(e) =>
                            handleGradeChange(course._id, practical._id, Number(e.target.value))
                          }
                          min={0}
                          max={100}
                        />
                        <Button variant="primary" size="sm" onClick={() => submitGrade(course._id, practical._id, practical.submission[0]?._id)}>
                          Submit
                        </Button>
                      </Form.Group>
                    ) : (
                      '--'
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  </>
  )
}

export default StudentDetailsComponent
