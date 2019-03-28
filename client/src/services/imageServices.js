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
  for (var key of formData.entries()) {
    console.log(key[0] + ': ' + key[1])
  }
  const response = await axios.post(`${baseUrl}/upload`, formData, config)
  return response.data
}

const getImage = async (id) => {
  const config = getConfig()
  const response = await axios.get(`${baseUrl}/${id}`, config)
  console.log('image response;', response)
  const src = arrayBufferToBase64(response.data.Body.data)
  const image = {
    _id: id,
    src
  }
  console.log('packaged image', image)
  return image
}

export default {
  addImage,
  getImage
}