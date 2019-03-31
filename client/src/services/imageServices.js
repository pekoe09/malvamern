import axios from 'axios'
import { getConfig } from './servicehelpers'

const baseUrl = '/api/images'

const arrayBufferToBase64 = (buffer) => {
  var binary = ''
  var bytes = [].slice.call(new Uint8Array(buffer))
  bytes.forEach((b) => binary += String.fromCharCode(b))
  return 'data:image/jpeg;base64,' + window.btoa(binary)
}

const addImage = async (image) => {
  const config = getConfig()
  config.headers = {
    ...config.headers,
    'Content-Type': 'multipart/form-data'
  }
  var formData = new FormData()
  formData.append('file', image.file)
  formData.append('name', image.name)
  formData.append('ordinality', image.ordinality)
  formData.append('plantId', image.plantId)
  const response = await axios.post(`${baseUrl}/upload`, formData, config)
  return response.data
}

const updateImage = async (image) => {
  const updatedImage = {
    name: image.name,
    ordinality: image.ordinality
  }
  const response = await axios.put(`${baseUrl}/details/${image._id}`, updatedImage, getConfig())
  return response.data
}

const deleteImage = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig())
  return response.data
}

const getImage = async (id, size) => {
  const config = getConfig()
  const url = size ? `${baseUrl}/${id}?size=${size}` : `${baseUrl}/${id}`
  const response = await axios.get(url, config)
  const src = arrayBufferToBase64(response.data.Body.data)
  const image = {
    _id: id,
    size: size ? size : 'original'
  }
  image[size] = src
  return image
}

export default {
  addImage,
  updateImage,
  deleteImage,
  getImage
}