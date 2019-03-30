import imageService from '../services/imageServices'

export const IMAGE_CREATE_BEGIN = 'IMAGE_CREATE_BEGIN'
export const IMAGE_CREATE_SUCCESS = 'IMAGE_CREATE_SUCCESS'
export const IMAGE_CREATE_FAILURE = 'IMAGE_CREATE_FAILURE'
export const IMAGE_GET_BEGIN = 'IMAGE_GET_BEGIN'
export const IMAGE_GET_SUCCESS = 'IMAGE_GET_SUCCESS'
export const IMAGE_GET_FAILURE = 'IMAGE_GET_FAILURE'

const addImageBegin = () => ({
  type: IMAGE_CREATE_BEGIN
})

const addImageSuccess = image => ({
  type: IMAGE_CREATE_SUCCESS,
  payload: { image }
})

const addImageFailure = error => ({
  type: IMAGE_CREATE_FAILURE,
  payload: { error }
})

const getImageBegin = () => ({
  type: IMAGE_GET_BEGIN
})

const getImageSuccess = image => ({
  type: IMAGE_GET_SUCCESS,
  payload: { image }
})

const getImageFailure = error => ({
  type: IMAGE_GET_FAILURE,
  payload: { error }
})

export const addImage = (image) => {
  return async (dispatch) => {
    dispatch(addImageBegin())
    try {
      image = await imageService.addImage(image)
      dispatch(addImageSuccess(image))
    } catch (error) {
      console.log(error)
      dispatch(addImageFailure(error))
    }
  }
}

export const getImage = (id, size) => {
  return async (dispatch) => {
    dispatch(getImageBegin())
    try {
      const image = await imageService.getImage(id, size)
      dispatch(getImageSuccess(image))
    } catch (error) {
      console.log(error)
      dispatch(getImageFailure(error))
    }
  }
}