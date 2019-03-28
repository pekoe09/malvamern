import {
  IMAGE_CREATE_BEGIN,
  IMAGE_CREATE_SUCCESS,
  IMAGE_CREATE_FAILURE,
  IMAGE_GET_BEGIN,
  IMAGE_GET_SUCCESS,
  IMAGE_GET_FAILURE
} from '../actions/imageActions'

const initialState = {
  uploading: false,
  error: null,
  items: []
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
    case IMAGE_GET_SUCCESS:
      return {
        ...store,
        items: store.items.concat(action.payload.image)
      }
    default:
      return store
  }
}

export default imageReducer