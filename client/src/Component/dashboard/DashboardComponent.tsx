/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import './DashboardComponent.css'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { type RootState } from '../../store/Store'
import { BsPencil, BsTrash } from 'react-icons/bs'
import LoadingSpinner from '../Loader/LoadingSpinner'
import { Button, Spinner } from 'react-bootstrap'
import { addCourse } from '../../slice/CourseSlice'
import { addCourses, getAllCourses, updateCourse } from '../../api/courses'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export interface Course {
  _id?: string
  title: string
  description: string
}

export interface SubCategory {
  title: string
  practical: boolean
}

const DashboardComponent: React.FC = () => {
  const dispatch = useDispatch()

  const courses = useSelector((state: RootState) => state.course.courses)

  const [fetchedCourse, setFetchedCourse] = useState([])
  const [studentData, setStudentData] = useState([{ label: 'Total Students', data: 100 }])
  const [loading, setLoading] = useState(false)
  const [courseData, setCourseData] = useState([{ label: 'Total Courses', data: 20 }])
  // const courseData = [{ label: 'Total Courses', data: 20 }]
  const navigator = useNavigate()
  const [showDetails, setShowDetails] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const formik = useFormik({
    initialValues: {
      title: '',
      description: ''
    },
    validate: (values: { title: string, description: string }) => {
      const errors: { title?: string, description?: string } = {}
      if (values.title === '') {
        errors.title = 'Title is required'
      }
      if (values.description === '') {
        errors.description = 'Description is required'
      }
      return errors
    },
    onSubmit: async (values) => {
      setLoading(true) // Set loading to true before making the API call

      const newCourse: Course = {
        title: values.title,
        description: values.description
      }
      setShowDetails(false)

      if (selectedCourse !== null) {
        try {
          const resp: any = await updateCourse(selectedCourse._id ?? '', newCourse)
          if (resp.status !== 200) {
            console.log('Error While Adding Course:', resp)
            return
          }
          toast.success(resp.data.message)
          console.log('Course Updated:', resp)
        } catch (err) {
          console.log('Error While Updating Course: ', err)
        }
      } else {
        try {
          const resp: any = await addCourses(newCourse)
          if (resp.status !== 200) {
            console.log('Error While Adding Course:', resp)
            return
          }
          toast.success(resp.data.message)
          console.log('Course Created:', resp)
        } catch (err) {
          console.log('Error While Creating Course: ', err)
        }

        dispatch(addCourse(newCourse))
      }

      formik.resetForm()
      fetchCourses().catch((err) => {
        console.log('Error', err)
      })

      setLoading(false) // Set loading to false after the API call is complete
    }
  })

  const handleArrowClick = (course: Course) => {
    setSelectedCourse(course)
    formik.setValues({
      title: course.title,
      description: course.description
    })
    toggleSidebar()
  }

  const handleGoBack = () => {
    setShowDetails(false)
    setSelectedCourse(null)
  }

  const handleModal = () => {
    setShowDetails(false)
  }

  const fetchCourses = async () => {
    try {
      setLoading(true) // Set loading to true before making the API call
      const resp: any = await getAllCourses()
      if (resp.status !== 200) {
        console.log('Error While Fetching Course: ', resp)
        return
      }
      console.log('Courses:', resp.data.courses)
      setFetchedCourse(resp.data.courses)
      setStudentData([{ label: 'Total Students', data: resp.data.totalStudents }])
      setCourseData([{ label: 'Total Courses', data: resp.data.courses.length }])
    } catch (err) {
      console.log('Error While Fetching Course: ', err)
    } finally {
      setLoading(false) // Set loading to false after the API call is complete
    }
  }

  useEffect(() => {
    fetchCourses().catch((err) => {
      console.log('Error', err)
    })
  }, [])

  const toggleSidebar = () => {
    setShowDetails((prevState) => !prevState)
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
        <div className="container DashboardContainer">
          <h3>Dashboard</h3>
          <div className="row mt-4">
            <div className="col-md-6 chart">
              <BarChart width={200} height={200} data={studentData}>
                <Bar dataKey="data" fill="rgba(54, 162, 235, 0.6)" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
              </BarChart>
            </div>
            <div className="col-md-6 chart">
              <BarChart width={200} height={200} data={courseData}>
                <Bar dataKey="data" fill="rgba(75, 192, 192, 0.6)" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
              </BarChart>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center">
  <div className="text-center mt-4">
    <h2 className="fw-bold">Courses</h2>
    <hr/>
  </div>
  <div className="text-end mt-4">
    <button
      className="btn btn-primary m-1"
      onClick={() => {
        if (!showDetails && selectedCourse !== null) {
          setSelectedCourse(null)
          formik.setValues({
            title: '',
            description: ''
          })
        }
        toggleSidebar()
      }}
    >
      {showDetails ? 'Add Course' : 'Add Course'}
    </button>
    <hr/>
  </div>
</div>

          <div className="row mt-4">
            {fetchedCourse.map((course: any, index) => (
              <div className="col-md-4 mt-3" key={index}>
                <div className="card mt-3">
                  <div className="card-header text-center">
                    {course.title}
                    <Button
                      variant="link"
                      className="m-0 p-0 ms-2"
                      onClick={() => {
                        handleArrowClick(course)
                      }}
                    >
                      <BsPencil />
                    </Button>
                  </div>
                  <div className="card-body Description">
                    <p className="card-text">{course.description}</p>
                    <div className="float-end">
                      <button
                        className="arrow-button"
                        onClick={() => {
                          navigator(`/ShowCourseDetails/${course._id}`)
                        }}
                      >
                        &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={`sidebar ${showDetails ? 'sidebar-open' : ''} ${loading ? 'd-none' : ''}`}>
          <div className="row mt-4 m-4">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">{selectedCourse ? 'Update Course' : 'Add Course'}</div>
                <div className="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.title && (
                        <div className="error error-add-course">{formik.errors.title}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                      ></textarea>
                      {formik.errors.description && (
                        <div className="error error-add-course">{formik.errors.description}</div>
                      )}
                    </div>
                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn btn-primary mt-3 adddbtn"
                        disabled={!formik.isValid}
                      >
                        {selectedCourse ? 'Update Course' : 'Add Course'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <button className="ms-5" onClick={handleModal}>
            Back
          </button>
        </div>
      </div>
    </>
  )
}

export default DashboardComponent
