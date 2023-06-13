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
  const [submissionFiles, setSubmissionFiles] = useState<any>([])
  const [submission, setSubmission] = useState<any>([])
  const { courseId } = useParams()
  const navigator = useNavigate()
  const fileInputRefs = useRef<any[]>([])
  // const handlePracticalSubmit = (chapterId: number, submission: string) => {
  //   const updatedSubmissions = [...practicalSubmissions]
  //   updatedSubmissions[chapterId - 1] = submission
  //   setPracticalSubmissions(updatedSubmissions)
  // }

  const handleShowGrades = () => {
    setGradesVisible(true)
  }
  const { getRootProps, getInputProps } = useDropzone({})

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
              console.log('Response: ', resp)
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
    <div className="container-mained">
  <div className="course-details">
  <button className="back-button" onClick={() => { navigator('/courses') }}>
      Back
    </button>
    <h2 className="course-title">{course.title}</h2>
    <p className="course-description">{course.description}</p>

    <div className="chapter-container">
      {chapters.map((chapter: any, index: number) => (
        <div className="chapter-card" key={chapter._id}>
          <h3 className="chapter-title">{chapter.title}</h3>
          <h5 className='mt-4 chapter-description mb-4'>{chapter.description}</h5>
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
    <div className={`grade-section ${gradesVisible ? 'show' : ''}`}>
      {submission.map((sub: any) => (
        <div className="grade-item" key={sub.chapter._id}>
          <h4 className="grade-title">{sub.chapter.title} Grade:</h4>
          <p className="grade-value">{sub.grade !== undefined ? sub.grade : 'No Grade Yet'}</p>
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
