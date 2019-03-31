import {
  PLANTS_GETCOUNT_BEGIN,
  PLANTS_GETCOUNT_SUCCESS,
  PLANTS_GETCOUNT_FAILURE,
  PLANTS_GETALL_BEGIN,
  PLANTS_GETALL_SUCCESS,
  PLANTS_GETALL_FAILURE,
  PLANTS_GETBYPAGE_BEGIN,
  PLANTS_GETBYPAGE_SUCCESS,
  PLANTS_GETBYPAGE_FAILURE,
  PLANT_GET_BEGIN,
  PLANT_GET_SUCCESS,
  PLANT_GET_FAILURE,
  PLANT_CREATE_BEGIN,
  PLANT_CREATE_SUCCESS,
  PLANT_CREATE_FAILURE,
  PLANT_UPDATE_BEGIN,
  PLANT_UPDATE_SUCCESS,
  PLANT_UDPATE_FAILURE,
  PLANT_DELETE_BEGIN,
  PLANT_DELETE_SUCCESS,
  PLANT_DELETE_FAILURE,
} from '../actions/plantActions'
import {
  IMAGE_CREATE_SUCCESS,
  IMAGE_UPDATE_SUCCESS,
  IMAGE_DELETE_SUCCESS
} from '../actions/imageActions'

const initialState = {
  items: [],
  cache: [],
  count: 0,
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null
}

const plantReducer = (store = initialState, action) => {
  switch (action.type) {
    case PLANTS_GETCOUNT_BEGIN:
      return {
        ...store,
        loading: true,
        error: null
      }
    case PLANTS_GETCOUNT_SUCCESS:
      return {
        ...store,
        count: action.payload.count,
        loading: false,
        error: null
      }
    case PLANTS_GETCOUNT_FAILURE:
      return {
        ...store,
        loading: false,
        error: action.payload.error
      }
    case PLANT_GET_BEGIN:
      return {
        ...store,
        loading: true,
        error: null
      }
    case PLANT_GET_SUCCESS:
      const match = store.cache.find(p => p._id === action.payload.plant._id)
      return {
        ...store,
        loading: false,
        error: null,
        cache: match ? store.cache : store.cache.concat(action.payload.plant)
      }
    case PLANT_GET_FAILURE:
      return {
        ...store,
        loading: false,
        error: action.payload.error
      }
    case PLANTS_GETALL_BEGIN:
      return {
        ...store,
        loading: true,
        error: null
      }
    case PLANTS_GETALL_SUCCESS:
      return {
        ...store,
        items: action.payload.plants,
        loading: false,
        error: null
      }
    case PLANTS_GETALL_FAILURE:
      return {
        ...store,
        loading: false,
        error: action.payload.error
      }
    case PLANTS_GETBYPAGE_BEGIN:
      return {
        ...store,
        loading: true,
        error: null
      }
    case PLANTS_GETBYPAGE_SUCCESS:
      return {
        ...store,
        items: action.payload.plants,
        loading: false,
        error: null
      }
    case PLANTS_GETBYPAGE_FAILURE:
      return {
        ...store,
        loading: false,
        error: action.payload.error
      }
    case PLANT_CREATE_BEGIN:
      return {
        ...store,
        creating: true,
        error: null
      }
    case PLANT_CREATE_SUCCESS:
      return {
        ...store,
        items: store.items.concat(action.payload.plant),
        creating: false,
        error: null
      }
    case PLANT_CREATE_FAILURE:
      return {
        ...store,
        creating: false,
        error: action.payload.error
      }
    case PLANT_UPDATE_BEGIN:
      return {
        ...store,
        updating: true,
        error: null
      }
    case PLANT_UPDATE_SUCCESS:
      const updated = action.payload.plant
      return {
        ...store,
        items: store.items.map(p => p._id === updated._id ? updated : p),
        cache: store.cache.map(p => p._id === updated._id ? updated : p),
        updating: false,
        error: null
      }
    case PLANT_UDPATE_FAILURE:
      return {
        ...store,
        updating: false,
        error: action.payload.error
      }
    case PLANT_DELETE_BEGIN:
      return {
        ...store,
        deleting: true,
        error: null
      }
    case PLANT_DELETE_SUCCESS:
      return {
        ...store,
        items: store.items.filter(p => p._id !== action.payload.id),
        deleting: false,
        error: null
      }
    case PLANT_DELETE_FAILURE:
      return {
        ...store,
        deleting: false,
        error: action.payload.error
      }
    case IMAGE_CREATE_SUCCESS:
      const image = action.payload.image
      if (image.plantId) {
        return {
          ...store,
          items: store.items.map(p => p._id === image.plantId ?
            {
              ...p,
              images: p.images ? p.images.concat(image) : [image]
            }
            : p),
          cache: store.cache.map(p => p._id === image.plantId ?
            {
              ...p,
              images: p.images ? p.images.concat(image) : [image]
            }
            : p)
        }
      } else {
        return store
      }
    case IMAGE_UPDATE_SUCCESS:
      const updatedImage = action.payload.image
      if (updatedImage.plantId) {
        return {
          ...store,
          items: store.items.map(p => p._id === updatedImage.plantId ?
            {
              ...p,
              images: p.images.map(i => i._id === updatedImage._id ? updatedImage : i)
            }
            : p
          ),
          cache: store.cache.map(p => p._id === updatedImage.plantId ?
            {
              ...p,
              images: p.images.map(i => i._id === updatedImage._id ? updatedImage : i)
            }
            : p
          )
        }
      } else {
        return store
      }
    case IMAGE_DELETE_SUCCESS:
      const deletedImage = action.payload.image
      if (deletedImage.plantId) {
        return {
          ...store,
          items: store.items.map(p => p._id === deletedImage.plantId ?
            {
              ...p,
              images: p.images.filter(i => i._id !== deletedImage._id)
            }
            : p
          ),
          cache: store.cache.map(p => p._id === deletedImage.plantId ?
            {
              ...p,
              images: p.images.filter(i => i._id !== deletedImage._id)
            }
            : p
          )
        }
      } else {
        return store
      }
    default:
      return store
  }
}

export default plantReducer