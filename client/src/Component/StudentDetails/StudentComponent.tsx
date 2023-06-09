/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
import React, { useState, useEffect, useRef } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { BsPencil, BsTrash } from 'react-icons/bs'
import { useSelector } from 'react-redux'
import { type RootState } from '../../store/Store' // Replace 'path/to/redux/store' with the actual path to your store configuration file
import './StudentComponent.css'
import { getAllCourses, enrollmultiplecourses, removeEnrollment } from '../../api/courses'
import { getAllUsers } from '../../api/users'
import { toast } from 'react-hot-toast'

interface Student {
  id: number
  name: string
  stack: string
  courseslist: string[]
  coursetitles: any[]
  email: string
  user_role: string
  username: string
  _id: string
  courses: any[]
}

const UserComponent: React.FC = () => {
  const courseTitles = useSelector((state: RootState) =>
    state.course.courses.map((course) => course.title)
  )

  const [students, setStudents] = useState<any[]>([])
  const [courses, setCourses] = useState<string[]>([]) // Added state for courses
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newStudent, setNewStudent] = useState<any>({
    id: 0,
    name: '',
    stack: '',
    courseslist: [],
    coursetitles: [],
    email: '',
    user_role: 'student',
    username: '',
    _id: '',
    courses: []
  })
  // const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const tableRef = useRef<HTMLTableElement>(null)

  const fetchAllUsers = async () => {
    getAllUsers().then(async (resp: any) => {
      if (resp.status !== 200) {
        console.log('Error While Fetching  All Users:', resp)
        return
      }
      // setCourses(resp.data.courses)
      console.log('All Users:', resp.data.users)
      setStudents(resp.data.users)
    }).catch(err => {
      console.log('Error While Fetching  All Users: ', err)
    })
  }

  useEffect(() => {
    // Fetch students from API or any data source
    // Initially, the students list will be empty
    fetchAllUsers().catch(err => {
      console.log('Error', err)
    })
    // setStudents([])
  }, [])

  useEffect(() => {
    // Fetch courses from API or any data source
    // Initially, the courses list will be empty
    getAllCourses().then(async (resp: any) => {
      if (resp.status !== 200) {
        console.log('Error While Fetching  All Courses:', resp)
        return
      }
      setCourses(resp.data.courses)
      console.log('All Courses:', resp.data.courses)
    }).catch(err => {
      console.log('Error While Fetching ALl courses: ', err)
    })
    // setCourses([])
  }, [])

  const handleModalOpen = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleEditModalOpen = (student: Student) => {
    setSelectedStudent(student)
    setIsEditModalOpen(true)
  }

  const handleEditModalClose = () => {
    setIsEditModalOpen(false)
    setSelectedStudent(null)
  }

  const handleSaveStudent = () => {
    console.log('enroll_student: ', newStudent)
    // const id = Math.floor(Math.random() * 9000) + 1000 // Generate random 4-digit ID
    // const updatedNewStudent = { ...newStudent, id }
    // const updatedStudents = [...students, updatedNewStudent]

    enrollmultiplecourses({ studentEmail: newStudent.email, stack: newStudent.stack, courseList: newStudent.courseslist }).then(async (resp: any) => {
      if (resp.status !== 200) {
        console.log('Error While Adding Student:', resp)
        return
      }
      // setCourses(resp.data.courses)
      toast.success(resp.data.message)
      console.log('All Students Added Result:', resp.data.users)
      // setStudents(resp.data.users)
    }).catch(err => {
      console.log('Error While Adding Students: ', err)
    })

    //  setStudents(updatedStudents)
    setNewStudent({
      id: 0,
      name: '',
      stack: '',
      courseslist: [],
      coursetitles: [],
      email: '',
      user_role: 'student',
      username: '',
      _id: '',
      courses: []
    })

    fetchAllUsers().catch(err => {
      console.log('Error', err)
    })
    setIsModalOpen(false)
    scrollToLatestStudent()
  }

  const handleUpdateStudent = () => {
    const updatedStudents = students.map((student) => {
      if (student.id === selectedStudent?.id) {
        return {
          ...student,
          name: selectedStudent?.name,
          stack: selectedStudent?.stack,
          courses: selectedStudent?.courses
        }
      }
      return student
    })
    setStudents(updatedStudents)
    setSelectedStudent(null)
    setIsEditModalOpen(false)
  }

  const handleDeleteStudent = (studentId: string, courseId: string) => {
    // const updatedStudents = students.filter((student) => student.id !== id)
    // setStudents(updatedStudents)

    removeEnrollment({ studentId, courseId }).then(async (resp: any) => {
      if (resp.status !== 200) {
        console.log('Error While Deleting Student Enrollment:', resp)
        return
      }

      // setCourses(resp.data.courses)
      toast.success(resp.data.message)
      console.log('Student Enrollment Deleted:', resp.data)
      fetchAllUsers()
      // setStudents(resp.data.users)
    }).catch(err => {
      console.log('Error While Deleting Students Enrollment: ', err)
    })

    fetchAllUsers()
    // fetchAllUsers().catch(err => {
    //   console.log('Error', err)
    // })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'courseslist') {
      const courseslist = value.split(',').map((course) => course.trim())
      setNewStudent((prevStudent: any) => ({ ...prevStudent, [name]: courseslist }))
    } else {
      setNewStudent((prevStudent: any) => ({ ...prevStudent, [name]: value }))
    }
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'courseslist') {
      const courseslist = value.split(',').map((course) => course.trim())
      setSelectedStudent((prevStudent: any) =>
        prevStudent != null ? { ...prevStudent, [name]: courseslist } : null
      )
    } else {
      setSelectedStudent((prevStudent: any) =>
        prevStudent != null ? { ...prevStudent, [name]: value } : null
      )
    }
  }
  const handleCourseSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // console.log('E.target: ', e.target.value, e.target.title)
    const { value } = e.target

    if (newStudent.courses.includes(value)) {
      alert('Course is already selected')
      return
    }
    setNewStudent((prevStudent: { courseslist: any }) => ({
      ...prevStudent,
      courseslist: [...prevStudent.courseslist, value]
    }))

    // const selcourse: any = courses.filter((course: any) => course._id === value)
    // console.log('Already Presetn: ', newStudent.coursetitles)
    // console.log('sel Course: ', selcourse[0]?.title)

    // setNewStudent((prevStudent) => ({
    //   ...prevStudent,
    //   coursetitles: [...prevStudent.coursetitles, selcourse[0]?.title]
    // }))
    // console.log('Title: ', newStudent.coursetitles)
  }

  const handleEditCourseSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    // setSelectedStudent((prevStudent: { courses: any }) => {
    //   if (prevStudent != null) {
    //     const updatedCourses = [...prevStudent.courseslist, value]
    //     return { ...prevStudent, courseslist: updatedCourses }
    //   }
    //   return null
    // })
  }

  // const handleEditDeleteCourse = (course: string) => {
  //   setSelectedStudent((prevStudent) => {
  //     if (prevStudent) {
  //       const updatedCourses = prevStudent.courses.filter((c) => c !== course);
  //       return { ...prevStudent, courses: updatedCourses };
  //     }
  //     return null;
  //   });
  // };

  const scrollToLatestStudent = () => {
    if (tableRef.current != null) {
      tableRef.current.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="container">
      <h3>Student Details</h3>
      <button onClick={handleModalOpen}>Add Student</button>
      <div className="table-container">
        <table ref={tableRef}>
          <thead>
            <tr>
              <th>user name</th>
              <th>email</th>
              <th>Stack</th>
              <th>Courses</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses && courses.map((course: any) => (
              course.enrolled_students?.map((student: any) => (
                <tr key={`${student._id}-${course._id}`}>
                  <td>{student.username}</td>
                  <td>{student.email}</td>
                  <td>{student.stack === null ? 'No Stack' : student.stack}</td>
                  <td>{course.title}</td>
                  <td>
                    <BsPencil
                      className="m-2"
                      onClick={() => {
                        console.log('Selected Student: ', student)
                        handleEditModalOpen(student)
                      }}
                    />
                    <BsTrash
                      className="m-2"
                      onClick={() => {
                        handleDeleteStudent(student._id, course._id)
                      }}
                    />
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={isModalOpen} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              name="email"
              value={newStudent.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="stack">Stack:</label>
            <input
              type="text"
              id="stack"
              name="stack"
              value={newStudent.stack}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="select-course">Courses:</label>
            <select id="select-course" name="courseslist" value={newStudent.courseslist} onChange={handleInputChange} >
              <option value="">-- Select Course --</option>
              {courses && courses.map((course: any) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveStudent}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isEditModalOpen} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label htmlFor="email">email:</label>
            <input
              type="text"
              id="email"
              name="email"
              value={selectedStudent?.email ?? ''}
              onChange={handleEditInputChange}
            />
          </div>
          <div>
            <label htmlFor="stack">Stack:</label>
            <input
              type="text"
              id="stack"
              name="stack"
              value={selectedStudent?.stack ?? ''}
              onChange={handleEditInputChange}
            />
          </div>

          <div>
            <label htmlFor="courses">Courses:</label>
            <input
              type="text"
              id="courses"
              name="courses"
              onChange={handleEditInputChange}
              value={selectedStudent
                ? selectedStudent?.enrolled_courses.map((course: any) => {
                  const selcourse: any = courses.filter((c: any) => c._id === course._id)
                  console.log('selected:', selcourse)
                  return selcourse[0]?.title
                }).join(', ')
                : ''}
              readOnly

            />
          </div>
          <div>
            <label htmlFor="select-course">Select Course:</label>
            <select id="select-course" onChange={handleEditCourseSelect}>
              <option value="">-- Select Course --</option>
              {courses && courses.map((course: any) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateStudent}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default UserComponent
