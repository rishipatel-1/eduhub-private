import React, { useState, useEffect } from 'react'
import getAllStudents, { Student } from '../../api/getAllStudents'
import './TotalStudent.css'
import LoadingSpinner from '../Loader/LoadingSpinner'
import { AxiosResponse } from 'axios'

const TotalStudent: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await getAllStudents() as AxiosResponse
        if (response && response.data) {
          setStudents(response.data.students)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [])

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
<div className='container totalstudent'>
  <h3 className='text-center'>Total Students</h3>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          {/* Add more table headers as needed */}
        </tr>
      </thead>
      <tbody>
        {Array.isArray(students) && students.length > 0 ? (
          students.map((student) => (
            <tr key={student._id}>
              <td>{student.username}</td>
              <td>{student.email}</td>
              {/* Add more table cells as needed */}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={2}>No students found</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  </div>
</>
  )
}

export default TotalStudent
