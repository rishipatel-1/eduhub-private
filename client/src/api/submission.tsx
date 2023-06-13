import axiosInstance from '../config/axiosInstance'

export const submitChapter = async (chapterId: string, payload: any) => (
  await axiosInstance(`/submitChapter/${chapterId}`, {
    method: 'POST',
    data: payload
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const updateSubmission = async (submissionId: string, payload: any) => (
  await axiosInstance(`/updateSubmission/${submissionId}`, {
    method: 'PUT',
    data: payload
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const gradeSubmission = async (submissionId: string, payload: any) => (
  await axiosInstance(`/gradeSubmission/${submissionId}`, {
    method: 'PUT',
    data: payload
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const deleteSubmission = async (submissionId: string) => (
  await axiosInstance(`/deleteSubmission/${submissionId}`, {
    method: 'DELETE'
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const getSubmissionByStudentId = async () => (
  await axiosInstance('/getSubmission', {
    method: 'GET'
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const getAllSubmission = async () => (
  await axiosInstance('/getAllSubmission', {
    method: 'GET'
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const getAllSubmission2 = async () => (
  await axiosInstance('/getAllSubmission2', {
    method: 'GET'
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const getAllSubmission3 = async () => (
  await axiosInstance('/getAllSubmission3', {
    method: 'GET'
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const getAllSubmission4 = async (studentId: any) => (
  await axiosInstance(`/getAllSubmission4/${studentId}`, {
    method: 'GET'
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const uploadSubmission = async (payload: any) => {
  try {
    axiosInstance.defaults.headers['Content-Type'] = 'multipart/form-data'

    const response = await axiosInstance.post('/uploadSubmission', payload)
    axiosInstance.defaults.headers['Content-Type'] = 'application/json'

    console.log('FrontEnd Response:', response)
    return response
  } catch (error) {
    console.log('Error While Uploading File:', error)
    throw error
  }
}

export const deletefileSubmission = async (payload: any) => (
  await axiosInstance('/deletezipsubmission', {
    method: 'PUT',
    data: payload
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)
