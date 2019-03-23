import axios from 'axios'
import { getConfig } from './servicehelpers'

const baseUrl = '/api/images'

const addImage = async (image) => {
  const config = getConfig()
  config.headers = {
    ...config.headers,
    'Content-Type': 'multipart/form-data'
  }
  const response = await axios.post(`${baseUrl}/upload`, image, config)
  return response.data
}

export default {
  addImage
}