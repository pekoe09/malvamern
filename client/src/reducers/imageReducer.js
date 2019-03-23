import {
  IMAGE_CREATE_BEGIN,
  IMAGE_CREATE_SUCCESS,
  IMAGE_CREATE_FAILURE
} from '../actions/imageActions'

const initialState = {
  uploading: false,
  error: null
}

const imageReducer = (store = initialState, action) => {
  switch (action.type) {
    case IMAGE_CREATE_BEGIN:
      return {
        ...store,
        uploading: true,
        error: null
      }
    case IMAGE_CREATE_SUCCESS:
      return {
        ...store,
        uploading: false,
        error: null
      }
    case IMAGE_CREATE_FAILURE:
      return {
        ...store,
        uploading: false,
        error: action.payload.error
      }
    default:
      return store
  }
}

export default imageReducer