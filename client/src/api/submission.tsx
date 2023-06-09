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
