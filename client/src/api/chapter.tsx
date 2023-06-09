import axiosInstance from '../config/axiosInstance'

export const addChapters = async (courseId: string, payload: any) => (
  await axiosInstance(`/addChapter/${courseId}`, {
    method: 'POST',
    data: payload
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const updateChapters = async (chapterId: string, payload: any) => (
  await axiosInstance(`/updateChapter/${chapterId}`, {
    method: 'PUT',
    data: payload
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const deleteChapter = async (chapterId: string) => (
  await axiosInstance(`/deleteChapter/${chapterId}`, {
    method: 'DELETE'
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)

export const getChapterForCourse = async (courseId: string) => (
  await axiosInstance(`/getChaptersForCourse/${courseId}`, {
    method: 'GET'
  }).then((resp) => resp).catch((err) => {
    console.log(err)
  })
)
