/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Button } from 'react-bootstrap'
import { BsPencil, BsTrash, BsEyeFill, BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import { useSelector } from 'react-redux'
import { type RootState } from '../../store/Store' // Replace 'path/to/redux/store' with the actual path to your store configuration file
import './StudentComponent.css'
import { getAllCourses, enrollmultiplecourses, removeEnrollments, getAllCoursesAndStudents, updateEnrollment } from '../../api/courses'
import { getAllUsers } from '../../api/users'
import { toast } from 'react-hot-toast'
import Select, { ActionMeta, MultiValue } from 'react-select'
import LoadingSpinner from '../Loader/LoadingSpinner'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { AxiosResponse } from 'axios'

export interface Student {
  id: number
  name: string
  stack: string
  courseslist: string[]
  email: string
  user_role: string
  username: string
  _id: string
  courses: Course[]
  coursesnames: string
  enrolled_courses: Course[]
}
interface newStudent {
  id: number
  name: string
  stack: string
  courseslist: string[]
  email: string
  user_role: string
  username: string
  _id: string
  courses: Course[]
}
// export interface Course {
//   _id?: string
//   title: string
//   description: string
// }
// interface CourseType {
//   _id: string
//   title: string
// }
export interface Course {
  _id: string
  title: string
  description: string
  enrolled_students: Student[]
  createdBy: string
  __v: number
}

interface EnrolledStudent {
  _id: string
  username: string
  email: string
  password: string
  user_role: string
  verificationToken: string | null
  is_verified: boolean
  Enable_2FactAuth: boolean
  twoFactSecret: string | null
  otpauth_url: string | null
  stack: string
  enrolled_courses: Course[] // You can define a more specific type if needed
  __v: number
}

const UserComponent: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<string[]>([]) // Added state for courses
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [data, setData] = useState([])
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [selectedStudentToDelete, setSelectedStudentToDelete] = useState<Student | null>(null)
  const itemsPerPage = 5
  const [currentPage, setCurrentPage] = useState(1)

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1)
  }
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1)
  }
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const paginatedCourses = data && data.slice(startIndex, endIndex)
  const [newStudent, setNewStudent] = useState<any>({
    id: 0,
    name: '',
    stack: '',
    courseslist: [],
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

  const navigate = useNavigate()
  const fetchAllUsers = async () => {
    setLoading(true) // Set loading to true before fetching data

    try {
      const resp = await getAllUsers() as AxiosResponse
      if (resp.status !== 200) {
        return
      }
      setStudents(resp.data.users)
    } catch (err) {
      console.log('Error While Fetching All Users:', err)
    } finally {
      setLoading(false) // Set loading to false after receiving the response or in case of an error
    }
  }
  useEffect(() => {
    fetchAllUsers().catch(err => {
      console.log('Error', err)
    })
    // setStudents([])
  }, [])

  const fetchNewData = async () => {
    try {
      const resp = await getAllCoursesAndStudents() as AxiosResponse
      if (resp.status !== 200) {
        console.log('Error While Fetching All Users:', resp)
        return
      }

      const usedata = resp.data.enroll_data.map((stud: Student) => {
        const coursesnames = stud.enrolled_courses.map((cour: Course) => (cour.title)).join(',')

        return { ...stud, coursesnames }
      })

      setData(usedata)
    } catch (err) {
      console.log('Error While Fetching Data:', err)
    }
  }
  useEffect(() => {
    fetchNewData().catch(err => {
      console.log('Error', err)
    })
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await getAllCourses() as AxiosResponse
        if (resp.status !== 200) {
          console.log('Error While Fetching All Courses:', resp)
          return
        }
        setCourses(resp.data.courses)
      } catch (err) {
        console.log('Error While Fetching All Courses:', err)
      }
    }
    fetchData()
  }, [])
  const handleModalClose = () => {
    setShowDetails(false)
    setSelectedStudent(false)
  }

  const handleEditModalOpen = (student: Student) => {
    const courseslist = student.enrolled_courses.map((cour: Course) => cour._id)
    setSelectedStudent({ ...student, courseslist })
    setIsEditModalOpen(true)
  }
  const renderTooltip = (text: string) => (
    <Tooltip id="tooltip">{text}</Tooltip>
  )
  const handleEditModalClose = () => {
    setIsEditModalOpen(false)
    setSelectedStudent(null)
  }

  const handleSaveStudent = async () => {
    setLoading(true) // Set loading state to true
    try {
      const resp = await enrollmultiplecourses({
        studentEmail: newStudent.email,
        stack: newStudent.stack,
        courseList: newStudent.courseslist
      }) as AxiosResponse
      if (resp.status !== 200) {
        console.log('Error While Adding Student:', resp)
        return
      }
      toast.success(resp.data.message)
    } catch (err) {
      console.log('Error While Adding Students:', err)
    } finally {
      setLoading(false) // Set loading state back to false
      setNewStudent({
        id: 0,
        name: '',
        stack: '',
        courseslist: [],
        email: '',
        user_role: 'student',
        username: '',
        _id: '',
        courses: []
      })
      try {
        const dinnnnn = await fetchNewData()
      } catch (err) {
        console.log('Error:', err)
      }
      setIsModalOpen(false)
      scrollToLatestStudent()
      setShowDetails(false)
    }
  }
  const handleUpdateStudent = async () => {
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
    try {
      await updateEnrollment({
        studentEmail: selectedStudent.email,
        stack: selectedStudent.stack,
        courseList: selectedStudent.courseslist
      })
      toast.success('Student enrollment updated successfully')
    } catch (err) {
      console.log('Error While updating student enrollment:', err)
    } finally {
      setStudents(updatedStudents)
      setSelectedStudent(false)
      setIsEditModalOpen(false)
    }
  }
  const handleDeleteStudent = (student: Student) => {
    setSelectedStudentToDelete(student)
    setShowConfirmationModal(true)
  }
  const confirmDeleteStudent = async () => {
    try {
      const courseId: Array<string | undefined> = selectedStudentToDelete?.enrolled_courses.map((cour: Course) => cour._id) ?? []
      const studentId: string = selectedStudentToDelete?._id ?? ''
      const resp = await removeEnrollments({ studentId, courseId }) as AxiosResponse
      if (resp.status !== 200) {
        console.log('Error While Deleting Student Enrollment:', resp)
        return
      }
      toast.success(resp.data.message)
      fetchAllUsers()
    } catch (err) {
      console.log('Error While Deleting Students Enrollment:', err)
    }
    fetchNewData()
    setShowConfirmationModal(false)
  }
  const handleCloseModal = () => {
    setShowConfirmationModal(false)
  }
  const handleViewGrades = (studentId: string) => {
    navigate(`/gradeStudent/${studentId}`)
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'email' || name === 'stack') {
      setNewStudent((prevStudent: Student) => ({ ...prevStudent, [name]: value }))
    }
  }
  const handleCourseChange = (
    selectedOptions: MultiValue<{ value: string, label: string }>,
    actionMeta: ActionMeta<{ value: string, label: string }>
  ) => {
    const selectedCourses = selectedOptions.map((option) => option.value)
    setNewStudent((prevStudent: Student) => ({ ...prevStudent, courseslist: selectedCourses }))
  }
  const handleEditCourseChange = (
    selectedOptions: MultiValue<{ value: string, label: string }>,
    actionMeta: ActionMeta<{ value: string, label: string }>
  ) => {
    const selectedCourses = selectedOptions.map((option) => option.value)
    setSelectedStudent((prevStudent: Student) => ({ ...prevStudent, courseslist: selectedCourses }))
  }
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'courseslist') {
      const courseslist = value.split(',').map((course) => course.trim())
      setSelectedStudent((prevStudent: Student) =>
        prevStudent != null ? { ...prevStudent, [name]: courseslist } : null
      )
    } else {
      setSelectedStudent((prevStudent: Student) =>
        prevStudent != null ? { ...prevStudent, [name]: value } : null
      )
    }
  }
  const toggleSidebar = () => {
    setShowDetails((prevState) => !prevState)
  }
  const scrollToLatestStudent = () => {
    if (tableRef.current != null) {
      tableRef.current.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
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
        <Modal show={showConfirmationModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this student enrollment?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDeleteStudent}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="container StudentTableDiv">
          <div className="container-fluid w-100">
            <div className="col-auto p-0">
              <h3 className="mt-3">Student Details</h3>
            </div>
            <div className="row d-flex justify-content-between align-items-center">

              <div className="col-auto p-0">
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => {
                    toggleSidebar()
                  }}
                >
                  {showDetails ? 'Add Student' : 'Add Student'}
                </button>
              </div>
              <div className='col-auto p-0 input-search'>
                <input
                  className='input-search'
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, stack, or course"
                />
              </div>
            </div>
          </div>
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
                {paginatedCourses && paginatedCourses.filter((student: Student) =>
                  (student.name && student.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (student.stack && student.stack.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (student.email && student.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (student.coursesnames && student.coursesnames.toLowerCase().includes(searchQuery.toLowerCase()))
                ).map((student: Student) => (
                  <tr key={`${student._id}`}>
                    <td>{student.username}</td>
                    <td>{student.email}</td>
                    <td>{student.stack === null ? 'No Stack' : student.stack}</td>
                    <td>{student.coursesnames}</td>
                    <td className='actions-student'>
                      <div className="icon-container">
                        <BsPencil
                          className="icon m-1"
                          onClick={() => {
                            handleEditModalOpen(student)
                          }}
                        />
                        <BsTrash
                          className="icon m-1"
                          onClick={() => {
                            handleDeleteStudent(student)
                          }}
                        />
                        <BsEyeFill
                          className="icon m-1"
                          onClick={() => {
                            handleViewGrades(student._id)
                          }}
                        />
                      </div>

                    </td>
                  </tr>
                ))

                }
              </tbody>

            </table>
          </div>
          <div className="pagination-buttons text-center">
            <button
              className='page-arrow m-2'
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <BsArrowLeft className="icon text-dark" />
            </button>
            <span className="current-page m-2">{currentPage}</span>
            <button
              className='page-arrow m-2'
              onClick={handleNextPage}
              disabled={currentPage >= (Math.ceil(courses.length / itemsPerPage)) - 2}
            >
              <BsArrowRight className="icon text-dark" />
            </button>
          </div>
        </div>
        <div className={`sidebar ${selectedStudent ? 'sidebar-open' : ''} ${loading ? 'd-none' : ''}`}>
          <div className="row mt-4 m-4">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">Update Student</div>
                <div className="card-body">
                  <div>
                    <label htmlFor="email">email:</label>
                    <input
                      type="text"
                      className='w-100'
                      id="email"
                      name="email"
                      value={selectedStudent?.email ?? ''}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="stack">Stack:</label>
                    <input
                      className='w-100'
                      type="text"
                      id="stack"
                      name="stack"
                      value={selectedStudent?.stack ?? ''}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="select-course">Select Course:</label>
                    <Select
                      closeMenuOnSelect={false}
                      id="select-course"
                      name="courseslist"
                      isMulti
                      options={courses && courses.map((course: any) => ({
                        value: course._id,
                        label: course.title
                      }))}
                      value={selectedStudent?.courseslist?.map((courseId: Course, title: string) => ({
                        value: courseId,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        label: courses.find((course: Course) => course._id === courseId)?.title
                      }))}
                      onChange={handleEditCourseChange}

                    />
                  </div>
                  <div className='float-end'>
                    <Button variant="secondary" onClick={handleEditModalClose} className='m-2 mt-5'>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdateStudent} className='m-2 mt-5'>
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button className="ms-5" onClick={handleModalClose}>
            Back
          </button>
        </div>
        <div className={`sidebar ${showDetails ? 'sidebar-open' : ''} ${loading ? 'd-none' : ''}`}>
          <div className="row mt-4 m-4">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">Add Student</div>
                <div className="card-body">
                  <div>
                    <label htmlFor="email">Email:</label>
                    <input
                      className='w-100'
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
                      className='w-100'
                      type="text"
                      id="stack"
                      name="stack"
                      value={newStudent.stack}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="select-course">Courses:</label>
                    <Select
                      closeMenuOnSelect={false}
                      id="select-course"
                      name="courseslist"
                      isMulti
                      options={courses && courses.map((course: any) => ({
                        value: course._id,
                        label: course.title
                      }))}
                      value={newStudent.courseslist.map((courseId: Course, title: string) => ({
                        value: courseId,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        label: courses.find((course: Course) => course._id === courseId)?.title // Get the course title based on the course ID
                      }))}
                      onChange={handleCourseChange}
                    />
                  </div>
                  <div className='float-end'>
                    <Button variant="secondary" onClick={handleModalClose} className="m-2 mt-5">
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveStudent} className="m-2 mt-5">
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button className="ms-5" onClick={handleModalClose}>
            Back
          </button>
        </div>
      </div>
    </>
  )
}

export default UserComponent
