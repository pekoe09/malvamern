import imageService from '../services/imageServices'

export const IMAGE_CREATE_BEGIN = 'IMAGE_CREATE_BEGIN'
export const IMAGE_CREATE_SUCCESS = 'IMAGE_CREATE_SUCCESS'
export const IMAGE_CREATE_FAILURE = 'IMAGE_CREATE_FAILURE'

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

export const addImage = (image) => {
  return async (dispatch) => {
    dispatch(addImageBegin())
    try {
      console.log('In action', image)
      image = await imageService.addImage(image)
      dispatch(addImageSuccess(image))
    } catch (error) {
      console.log(error)
      dispatch(addImageFailure(error))
    }
  }
}