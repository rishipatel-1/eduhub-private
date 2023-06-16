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
import { getAllCourses, enrollmultiplecourses, removeEnrollment } from '../../api/courses'
import { getAllUsers } from '../../api/users'
import { toast } from 'react-hot-toast'
import Select from 'react-select'
import LoadingSpinner from '../Loader/LoadingSpinner'

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
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
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
  const paginatedCourses = courses && courses.slice(startIndex, endIndex)
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

  const navigate = useNavigate()
  const fetchAllUsers = async () => {
  setLoading(true) // Set loading to true before fetching data

  try {
    const resp: any = await getAllUsers()
    if (resp.status !== 200) {
      console.log('Error While Fetching All Users:', resp)
      return
    }
    console.log('All Users:', resp.data.users)
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

  useEffect(() => {
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
  const handleModalClose = () => {
    setShowDetails(false)
    setSelectedStudent(false)
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
    setLoading(true) // Set loading state to true
    console.log('enroll_student:', newStudent)
    enrollmultiplecourses({ studentEmail: newStudent.email, stack: newStudent.stack, courseList: newStudent.courseslist })
      .then(async (resp: any) => {
        if (resp.status !== 200) {
          console.log('Error While Adding Student:', resp)
          return
        }
        toast.success(resp.data.message)
        console.log('All Students Added Result:', resp.data.users)
      })
      .catch(err => {
        console.log('Error While Adding Students:', err)
      })
      .finally(() => {
        setLoading(false) // Set loading state back to false
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
          console.log('Error:', err)
        })
        setIsModalOpen(false)
        scrollToLatestStudent()
        setShowDetails(false)
      })
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
    setSelectedStudent(false)
    setIsEditModalOpen(false)
  }

  const handleDeleteStudent = (studentId: string, courseId: string) => {
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
  const handleViewGrades = (studentId: string) => {
    navigate(`/gradeStudent/${studentId}`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'email' || name === 'stack') {
      setNewStudent((prevStudent: any) => ({ ...prevStudent, [name]: value }))
    }
  }
  const handleCourseChange = (selectedOptions: any) => {
    const selectedCourses = selectedOptions.map((option: any) => option.value)
    setNewStudent((prevStudent: any) => ({ ...prevStudent, courseslist: selectedCourses }))
  }
  console.log('Courses:', courses)
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
  const toggleSidebar = () => {
    setShowDetails((prevState) => !prevState)
  }
  const handleEditCourseSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
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
            <LoadingSpinner/>
          </div>
        </div>
      )}
      <div className={`content ${loading ? 'blur' : ''}`}>
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
  {paginatedCourses &&
    paginatedCourses.map((course: any) =>
      course.enrolled_students
        ?.filter(
          (student: Student) =>
            (student.name && student.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (student.email && student.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (student.stack && student.stack.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (course.title && course.title.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .map((student: Student) => (
          <tr key={`${student._id}-${course._id}`}>
            <td>{student.username}</td>
            <td>{student.email}</td>
            <td>{student.stack === null ? 'No Stack' : student.stack}</td>
            <td>{course.title}</td>
            <td className='actions-student'>
              <div className="icon-container">
                <BsPencil
                  className="icon m-1"
                  onClick={() => {
                    console.log('Selected Student:', student)
                    handleEditModalOpen(student)
                  }}
                />
                <BsTrash
                  className="icon m-1"
                  onClick={() => {
                    handleDeleteStudent(student._id, course._id)
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
    )}
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
  disabled={currentPage >= Math.ceil(courses.length / itemsPerPage)}
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
            <Select
  closeMenuOnSelect={false}
  id="select-course"
  name="courseslist"
  isMulti
  options={courses && courses.map((course: any) => ({
    value: course._id,
    label: course.title
  }))}
  value={newStudent.courseslist.map((courseId: any, title: string) => ({
    value: courseId,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    label: courses.find((course: any) => course._id === courseId)?.title // Get the course title based on the course ID
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
