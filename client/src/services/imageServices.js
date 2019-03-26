import axios from 'axios'
import { getConfig } from './servicehelpers'

const baseUrl = '/api/images'

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
  for(var key of formData.entries()){
    console.log(key[0] + ': ' + key[1])
  }
  const response = await axios.post(`${baseUrl}/upload`, formData, config)
  return response.data
}

export default {
  addImage
}