/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import './Course.css'
import { useParams } from 'react-router-dom'
import { getCourseProgress } from '../../api/courses'
import { submitChapter } from '../../api/submission'
import { toast } from 'react-hot-toast'

interface Chapter {
  id: number
  title: string
  practical: string
}

interface CourseDetailsProps {
  course: {
    id: number
    title: string
    description: string
    chapters: Chapter[]
  }
  onBack: () => void
}

const CourseProgress: React.FC = () => {
  // const [practicalSubmissions, setPracticalSubmissions] = useState<string[]>(
  //   []
  // )
  const [gradesVisible, setGradesVisible] = useState(false)
  const [course, setCourse] = useState<any>({})
  const [chapters, setChapters] = useState<any>([])
  const [submission, setSubmission] = useState<any>([])
  const { courseId } = useParams()
  // const handlePracticalSubmit = (chapterId: number, submission: string) => {
  //   const updatedSubmissions = [...practicalSubmissions]
  //   updatedSubmissions[chapterId - 1] = submission
  //   setPracticalSubmissions(updatedSubmissions)
  // }

  const handleShowGrades = () => {
    setGradesVisible(true)
  }

  const { getRootProps, getInputProps } = useDropzone()

  const fetchCourseProgress = async () => {
    try {
      const resp: any = await getCourseProgress(courseId)
      if (resp.status !== 200) {
        console.log('Error While Fetching Course: ', resp)
        return
      }

      console.log('Course:', resp.data.course)
      console.log('chapters: ', resp.data.chapters)
      console.log('Submission: ', resp.data.submission)
      setCourse(resp.data.course)
      setChapters(resp.data.chapters)
      setSubmission(resp.data.submission)
    } catch (err) {
      console.log('Error While Fetching Course Details: ', err)
    }
  }

  const submitPractical = (chapterId: string) => {
    submitChapter(chapterId, {}).then((resp: any) => {
      if (resp.status !== 200) {
        console.log('Error While Submitting Practical: ', resp)
        return
      }
      toast.success(resp.data.message)
      console.log('Practical Sumbitted Succesffully', resp)
    }).catch(err => {
      console.log('Error While Submitting Practical: ', err)
    })
  }

  useEffect(() => {
    fetchCourseProgress()
  }, [])

  return (
    <div className="container-mained">
      <div className="course-details">
        <h2 className="course-title">{course.title}</h2>
        <p className="course-description">{course.description}</p>

        {chapters.map((chapter: any) => (
          <div className="chapter" key={chapter._id}>
            <h3 className="chapter-title">{chapter.title}</h3>
            <p className="chapter-practical">{chapter.practical}</p>
            <div className="dropzone" {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag and drop a file here, or click to select a file </p>
            </div>
            <button onClick={() => { submitPractical(chapter._id) }}> Submit</button>
          </div>
        ))}
        <button className="back-button"
        // onClick={onBack}
        >
          Back
        </button>

        <div className={`grade-section ${gradesVisible ? 'show' : ''}`}>
          {submission.map((sub: any) => (
            <div className="grade-item" key={sub.chapter._id}>
              <h4 className="grade-title">{sub.chapter.title} Grade:</h4>
              <p className="grade-value">{sub.grade !== undefined ? sub.grade : 'No Grade Yet' }</p>
            </div>
          ))}
        </div>

        <button className="show-grades-button" onClick={handleShowGrades}>
          Show Grades
        </button>
      </div>
    </div>
  )
}

export default CourseProgress
