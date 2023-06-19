/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Dropzone, { useDropzone } from 'react-dropzone'
import './Course.css'
import { useNavigate, useParams } from 'react-router-dom'
import { getCourseProgress } from '../../api/courses'
import { submitChapter, uploadSubmission } from '../../api/submission'
import { toast } from 'react-hot-toast'
import LoadingSpinner from '../Loader/LoadingSpinner'

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
interface Course {
  _id: string
  createdBy: string
  description: string
  image: string
  isEditing: boolean
  practical: string
  submissions: Submission[]
  tempGrade: null
  title: string
  __v: number
}

interface Submission {
  chapter: string
  grade: number
  gradedBy: string
  status: string
  student: string
  submission: string
  __v: number
  _id: string
}

const CourseProgress: React.FC = () => {
  const [gradesVisible, setGradesVisible] = useState(false)
  const [course, setCourse] = useState<any>({})
  const [chapters, setChapters] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [submissionFiles, setSubmissionFiles] = useState<any>([])
  const [submission, setSubmission] = useState<any>([])
  const { courseId } = useParams()
  const navigator = useNavigate()

  const handleShowGrades = () => {
    setGradesVisible(true)
  }

  const uploadZipSubmission = (chapterId: string, file: File | null) => {
    try {
      if (file) {
        const formData = new FormData()
        formData.append('submission_file', file)
        formData.append('chapterId', chapterId)

        uploadSubmission(formData)
          .then((resp: any) => {
            if (resp && resp.status === 200) {
              const fileLink = resp.data.upload_location
              setSubmissionFiles((prevSubmissionFiles: any[]) => {
                const existingSubmissionFile = prevSubmissionFiles.find((submissionFile) => submissionFile.chapterId === chapterId)
                if (existingSubmissionFile) {
                  const updatedSubmissionFiles = prevSubmissionFiles.map((submissionFile) => {
                    if (submissionFile.chapterId === chapterId) {
                      return { ...submissionFile, fileLink }
                    }
                    return submissionFile
                  })
                  return updatedSubmissionFiles
                } else {
                  const newSubmissionFile = { chapterId, fileLink }
                  return [...prevSubmissionFiles, newSubmissionFile]
                }
              })
            } else {
              console.log('Error While Uploading file')
            }
          })
          .catch((err) => {
            console.log('Error while uploading file:', err)
          })
      } else {
        console.log('No file selected')
      }
    } catch (err) {
      console.log('Error while uploading file:', err)
    }
  }

  const fetchCourseProgress = async () => {
    try {
      setLoading(true)
      const resp: any = await getCourseProgress(courseId)
      if (resp.status !== 200) {
        console.log('Error While Fetching Course: ', resp)
        return
      }
      const updatedSubmissionFiles = resp.data.submission.map((sub: any) => ({
        chapterId: sub.chapter._id,
        fileLink: sub.submission ? sub.submission : ''
      }))
      setSubmissionFiles(updatedSubmissionFiles)
      setCourse(resp.data.course)
      setChapters(resp.data.chapters)
      setSubmission(resp.data.submission)
    } catch (err) {
      console.log('Error While Fetching Course Details: ', err)
    } finally {
      setLoading(false)
    }
  }

  const submitPractical = (chapterId: string) => {
    const submissionFile = submissionFiles.find((file: any) => file.chapterId === chapterId)
    const fileLink = submissionFile ? submissionFile.fileLink : ''

    submitChapter(chapterId, { fileUrl: fileLink }).then((resp: any) => {
      if (resp.status !== 200) {
        console.log('Error While Submitting Practical: ', resp)
        return
      }
      toast.success(resp.data.message)
    }).catch(err => {
      console.log('Error While Submitting Practical: ', err)
    })
  }

  useEffect(() => {
    fetchCourseProgress()
  }, [])

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
<div className="container-mained">
  <div className="course-details">
    <button className="back-button" onClick={() => { navigator('/courses') }}>
      Back
    </button>
    <h2 className="course-title">{course.title}</h2>
    <p className="course-description">{course.description}</p>

    {chapters.length === 0 ? (
      <p className="no-chapters-message text-center">Chapters Not Added Yet</p>
    ) : (
      <div className="chapter-container">
        {chapters.map((chapter: any, index: number) => (
          <div className="chapter-card" key={chapter._id}>
            <h3 className="chapter-title">{chapter.title}</h3>
            <h5 className="mt-4 chapter-description mb-4">{chapter.description}</h5>
            <p className="chapter-practical">{chapter.practical}</p>
            <div className="dropzone">
              <Dropzone onDrop={(acceptedFiles) => { uploadZipSubmission(chapter._id, acceptedFiles[0]) }}>
                {({ getRootProps, getInputProps, isDragActive, acceptedFiles }) => (
                  <div className={`dropzonee ${isDragActive ? 'active' : ''}`} {...getRootProps()}>
                    <input {...getInputProps()} />
                    {acceptedFiles.length === 0 ? (
                      <p>Drag and Drop a file here, or click to select a file</p>
                    ) : (
                      <p>Selected file: {acceptedFiles[0].name}</p>
                    )}
                  </div>
                )}
              </Dropzone>
            </div>

            <button className="mt-3 m-0 p-2" onClick={() => { submitPractical(chapter._id) }}>Submit</button>
          </div>
        ))}
      </div>
    )}

    <div className={`grade-section ${gradesVisible ? 'd-block' : ''}`}>
      {submission.map((sub: any) => (
        <div className="grade-item d-flex flex-sm-row" key={sub.chapter._id}>
          <h4 className="grade-title m-3">{sub.chapter.title}</h4>
          <h5 className="grade-value ms-3 m-3">--- Grade :{sub.grade !== undefined ? sub.grade : 'No Grade Yet'}%</h5>
        </div>
      ))}
    </div>

    <button className="show-grades-button" onClick={handleShowGrades}>
      Show Grades
    </button>
  </div>
</div>
</div>
</>
  )
}

export default CourseProgress
