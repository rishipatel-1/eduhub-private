/* eslint-disable @typescript-eslint/prefer-optional-chain */
import React, { useEffect, useState } from 'react'
import { Table, Form, Button } from 'react-bootstrap'
import './StudentDetails.css'
import { useNavigate, useParams } from 'react-router-dom'
import { getAllSubmission4, gradeSubmission } from '../../api/submission'
import LoadingSpinner from '../Loader/LoadingSpinner'

interface Course {
  _id: string
  courseId: string
  courseName: string
  practicals: Practical[]
}

interface Practical {
  _id: string
  practicalId: string
  practicalName: string
  status: string
  grade: number | null
  isEditing: boolean
  tempGrade: number | null
}

interface Submission {
  _id: string
  chapters: Chapter[]
  grade: number | null
  status: string
  title: string
}

interface Chapter {
  _id: string
  practical: string
  submissions: Submission[]
  tempGrade: number | null
  isEditing: boolean
  grade: number | null
}

const StudentDetailsComponent: React.FC = () => {
  const navigate = useNavigate()
  const { studentId } = useParams()
  const [loading, setLoading] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<string>('')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [student, setStudent] = useState<{ username: string, email: string, stack: string } | null>(null)

  const fetchAllSubmission = async () => {
    setLoading(true) // Set loading to true while fetching data
    try {
      const resp = await getAllSubmission4(studentId)
      if (resp && resp.status && resp.status !== 200) {
        console.log('Error While fetching submissions')
        return
      }
      const subm: Submission[] = resp?.data?.submissions?.map((item: { chapters: Chapter[] }) => {
        const chapters = item.chapters.map((chapter: Chapter) => {
          return {
            ...chapter,
            tempGrade: null,
            isEditing: false
          }
        })
        return {
          ...item,
          chapters
        }
      })
      console.log('Data: ', subm)
      const studentName = resp?.data?.student?.name
      const studentEmail = resp?.data?.student?.email
      const studentStack = resp?.data?.student?.stack
      setStudent(resp?.data?.student)
      setSubmissions(subm)
      console.log('Student Name: ', studentName)
      console.log('Student Email: ', studentEmail)
      console.log('Student Stack: ', studentStack)
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
    setSubmissions(prevCourses => {
      const updatedCourses = prevCourses.map(course => {
        if (course._id === courseId) {
          const updatedPracticals = course.chapters.map(practical => {
            if (practical._id === practicalId) {
              console.log('Practical Grade Change: ', grade)
              return { ...practical, tempGrade: grade }
            }
            return practical
          })
          return { ...course, chapters: updatedPracticals }
        }
        return course
      })
      return updatedCourses
    })
  }

  const toggleGradeEdit = (courseId: string, practicalId: string) => {
    setSubmissions(prevCourses => {
      const updatedCourses = prevCourses.map(course => {
        if (course._id === courseId) {
          const updatedPracticals = course.chapters.map(practical => {
            if (practical._id === practicalId) {
              console.log('Setting True: ', practical)
              return { ...practical, isEditing: !practical.isEditing, tempGrade: practical.grade !== null ? Number(practical.grade) : null }
            }
            return practical
          })
          return { ...course, chapters: updatedPracticals }
        }
        return course
      })
      console.log('update edit: ', updatedCourses)
      return updatedCourses
    })
  }

  const submitGrade = async (courseId: string, practicalId: string, submissionId: string) => {
    try {
      const submission = submissions?.find(sub => sub._id === courseId)?.chapters.find(chap => chap._id === practicalId)
      if (submission) {
        const grade = submission.tempGrade !== null ? Math.max(0, Math.min(100, submission.tempGrade)) : null
        await gradeSubmission(submissionId, { grade })
        void fetchAllSubmission()
      }
    } catch (error) {
      console.log('Error While Grading Student', error)
    }
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
        <div className="container gradeContainer mt-3">
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
          <p>Name: {student?.username ? student?.username : 'Test User'}</p>
          <p>Email: {student?.email}</p>
          <p>Stack: {student?.stack}</p>
          <div>
            <Form.Group controlId="courseSelect">
              <Form.Label>Select Course:</Form.Label>
              <Form.Control
                as="select"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
              >
                <option value="">All Courses</option>
                {submissions.map((course) => (
                  <option key={course._id} value={course._id} className="text-dark">
                    {course.title}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>
          <div className='table-div'>
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
                {submissions
                  .filter((course) => selectedCourseId === '' || course._id === selectedCourseId)
                  .map((course) =>
                    course.chapters.map((practical: Chapter, index: number) => (
                      <tr key={practical._id}>
                        {index === 0 && <td className='Course-col' rowSpan={course.chapters.length}>{course.title}</td>}
                        <td className='Practical-col'>{practical.practical}</td>
                        <td className='status-col'>{practical.submissions.length > 0 ? practical.submissions[0]?.status : 'Not Submitted'}</td>
                        <td className='td-grade'>
                          {practical.submissions.length > 0 && !practical.isEditing ? (
                            <div onClick={() => { console.log('Clicked on grade Edit'); toggleGradeEdit(course._id, practical._id) }}>
                              {(practical.submissions[0]?.grade !== null ? `Graded: ${practical.submissions[0]?.grade} %` : 'Grade it')}
                            </div>
                          ) : practical.isEditing ? (
                            <Form.Group className="mb-0 d-flex grade-div justify-content-center">
                              <Form.Control
                                className='input-grade'
                                type="number"
                                placeholder="Enter grade"
                                value={practical.tempGrade !== null ? practical.tempGrade.toString() : ''}
                                onChange={(e) =>
                                  handleGradeChange(course._id, practical._id, Number(e.target.value))
                                }
                                min={0}
                                max={100}
                              />
                              <Button variant="primary" className='grade-btn m-0' size="sm" onClick={async () => await submitGrade(course._id, practical._id, practical.submissions[0]?._id)}>
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
      </div>
    </>
  )
}

export default StudentDetailsComponent
