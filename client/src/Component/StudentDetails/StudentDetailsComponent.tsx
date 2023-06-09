/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useEffect, useState } from 'react'
import { ProgressBar, Form, Table } from 'react-bootstrap'
import './StudentDetails.css'
import { getAllSubmission2 } from '../../api/submission'

interface User {
  id: number
  name: string
  stack: string
  courses: []
  tasksCompleted: number
  totalTasks: number
  submittedPracticals: []
  selectedCourse?: string
  grade?: number
  isSubmitted?: boolean
}

const StudentDetailsComponent = () => {
  const [selectedStack, setSelectedStack] = useState('All')
  const [selectedCourse, setSelectedCourse] = useState('All')
  const [gradedUsers, setGradedUsers] = useState<number[]>([])
  const [stacks, setStacks] = useState([])
  const [showGradeInput, setShowGradeInput] = useState(false)
  const [users, setUsers] = useState<any[]>([])

  const handleStackChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSelectedStack(event.target.value)
    setSelectedCourse('All')
  }
  const handleCourseChange = (
    event: React.ChangeEvent<any>,
    userId: number
  ) => {
    const selectedValue = event.target.value
    // Update the selected course for the specific user
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          selectedCourse: selectedValue,
          grade: undefined
        }
      }
      return user
    })

    // Update the users array with the updated users
    setUsers(updatedUsers)
    setGradedUsers((prevGradedUsers) =>
      prevGradedUsers.filter((id) => id !== userId)
    )
  }

  const getSubmissions2 = () => {
    getAllSubmission2().then(async (resp: any) => {
      if (resp.status !== 200) {
        console.log('error while feetching submission: ')
      }
      console.log('Submission Fetched: ', resp.data)

      setUsers(resp.data.allsubmission)
      setStacks(resp.data.stacks)
    }).catch(err => {
      console.log('Error While Fetching Submissions: ', err)
    })
  }

  useEffect(() => {
    getSubmissions2()
  }, [])

  const handleGradeSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    userId: number
  ) => {
    event.preventDefault()

    const gradeInput = (event.target as HTMLFormElement).grade.value
    const grade = parseInt(gradeInput)

    // Validate the grade value
    if (grade < 0 || grade > 100) {
      return // Invalid grade, do not update the state
    }

    // Update the grade for the specific user
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          grade
        }
      }
      return user
    })

    // Update the users array with the updated users
    setUsers(updatedUsers)
    setGradedUsers((prevGradedUsers) => [...prevGradedUsers, userId])
    setShowGradeInput(false)
  }

  const filteredUsers = users.filter((user) => {
    if (selectedStack === 'All' && selectedCourse === 'All') {
      return true
    } else if (selectedStack === 'All') {
      return user.courses.includes(selectedCourse)
    } else if (selectedCourse === 'All') {
      return user.stack === selectedStack
    } else {
      return (
        user.stack === selectedStack && user.courses.includes(selectedCourse)
      )
    }
  })

  return (
    <div className="container mt-3">
      <h3>Student Details</h3>
      <Form>
        <Form.Group controlId="stackSelect">
          <Form.Label>Stack:</Form.Label>
          <Form.Control
            as="select"
            value={selectedStack}
            onChange={handleStackChange}
          >
            <option value="All">All</option>
            {stacks.map((stack) => (<option key={stack} value={stack}>{stack}</option>))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="courseSelect">
          <Form.Label className="mt-3">Course:</Form.Label>
          <Form.Control
            as="select"
            value={selectedCourse}
            onChange={(event) => {
              setSelectedCourse(event.target.value)
            }}
          >
            <option value="All">All</option>
            {users
              .flatMap((user) => user.courses)
              .filter((course, index, self) => self.indexOf(course) === index)
              .map((course) => (
                <option key={course._id} value={course.title}>
                  {course.title}
                </option>
              ))}

          </Form.Control>
        </Form.Group>
      </Form>
      <div className="tableDiv">
        <Table striped bordered className="mt-4 rounded-3 ">
          <thead>
            <tr>
              <th>Name</th>
              <th>Stack</th>
              <th>Course</th>
              <th>Status</th>
              <th>Grade</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0
              ? (
                  filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.stack}</td>
                  <td className="courseTable">
                    <Form.Control
                      as="select"
                      value={user.selectedCourse ?? selectedCourse}
                      onChange={(event) => {
                        handleCourseChange(event, user.id)
                      }}
                    >
                      <option value="All">All</option>
                      {user.courses.map((course: any) => (
                        <option
                          key={course._id}
                          value={course._id}
                          className="courseTable"
                        >
                          {course.title}
                        </option>
                      ))}
                    </Form.Control>
                  </td>
                  <td>
                    <span
                      style={{
                        marginRight: '5px',
                        color:
                           'green'
                      }}
                    >
                      {user.submittedPracticals.includes(user.selectedCourse ?? selectedCourse)
                        ? 'Submitted'
                        : 'Not Submitted'}
                    </span>
                  </td>
                  <td className="gradeRow">
                    {gradedUsers.includes(user.id)
                      ? (
                      <span className="graded-text">Graded: {user.grade}%</span>
                        )
                      : (
                      <>
                        {user.submittedPracticals.includes(user.selectedCourse ?? selectedCourse)
                          ? (
                          <>
                            {showGradeInput
                              ? (
                              <form
                                onSubmit={(event) => {
                                  handleGradeSubmit(event, user.id)
                                }}
                                className="gradeform"
                              >
                                <input
                                  type="number"
                                  name="grade"
                                  placeholder="Grade"
                                  className="grade-input"
                                />
                                <button type="submit" className="submit-button">
                                  &#x2714;
                                </button>
                              </form>
                                )
                              : (
                              <span
                                className="grade-it-text"
                                onClick={() => {
                                  setShowGradeInput(true)
                                }}
                              >
                                Grade It
                              </span>
                                )}
                          </>
                            )
                          : (
                          <span className="not-graded-text">Not Graded</span>
                            )}
                      </>
                        )}
                  </td>
                  <td>
                    <ProgressBar
                      now={(user.tasksCompleted / user.totalTasks) * 100}
                      label={`${user.tasksCompleted}/${user.totalTasks}`}
                    />
                  </td>
                </tr>
                  ))
                )
              : (
              <tr>
                <td colSpan={7}>No users found</td>
              </tr>
                )}

          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default StudentDetailsComponent
