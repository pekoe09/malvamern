import {
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILURE,
  LOGIN_BEGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_BEGIN,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE
} from '../actions/userActions'
import {
  LOCATION_CREATE_BEGIN,
  LOCATION_CREATE_SUCCESS,
  LOCATION_CREATE_FAILURE,
  LOCATION_UPDATE_BEGIN,
  LOCATION_UPDATE_SUCCESS,
  LOCATION_UDPATE_FAILURE,
  LOCATION_DELETE_BEGIN,
  LOCATION_DELETE_SUCCESS,
  LOCATION_DELETE_FAILURE
} from '../actions/locationActions'

const initialState = {
  items: [],
  currentUser: null,
  registering: false,
  loggingIn: false,
  loggingOut: false,
  creatingLocation: false,
  updatingLocation: false,
  deletingLocation: false,
  error: null
}

const userReducer = (store = initialState, action) => {
  switch (action.type) {
    case REGISTER_USER_BEGIN:
      return {
        ...store,
        registering: true,
        error: null
      }
    case REGISTER_USER_SUCCESS:
      return {
        ...store,
        items: store.items.concat(action.payload.newUser),
        registering: false,
        error: null
      }
    case REGISTER_USER_FAILURE:
      return {
        ...store,
        registering: false,
        error: action.payload.error
      }
    case LOGIN_BEGIN:
      return {
        ...store,
        loggingIn: true,
        loggingOut: false,
        error: null
      }
    case LOGIN_SUCCESS:
      return {
        ...store,
        currentUser: action.payload.currentUser,
        loggingIn: false,
        loggingOut: false,
        error: false
      }
    case LOGIN_FAILURE:
      return {
        ...store,
        currentUser: null,
        loggingIn: false,
        loggingOut: false,
        error: action.payload.error
      }
    case LOGOUT_BEGIN:
      return {
        ...store,
        loggingOut: true,
        loggingIn: false,
        error: null
      }
    case LOGOUT_SUCCESS:
      return {
        ...store,
        currentUser: null,
        loggingOut: false,
        loggingIn: false,
        error: null
      }
    case LOGOUT_FAILURE:
      return {
        ...store,
        loggingOut: false,
        loggingIn: false,
        error: action.payload.error
      }
    case LOCATION_CREATE_BEGIN:
      return {
        ...store,
        creatingLocation: true,
        error: null
      }
    case LOCATION_CREATE_SUCCESS:
      return {
        ...store,
        creatingLocation: false,
        error: null,
        currentUser: {
          ...store.currentUser,
          locations: store.currentUser.locations.concat(action.payload.location)
        }
      }
    case LOCATION_CREATE_FAILURE:
      return {
        ...store,
        creatingLocation: false,
        error: action.payload.error
      }
    case LOCATION_UPDATE_BEGIN:
      return {
        ...store,
        updatingLocation: true,
        error: null
      }
    case LOCATION_UPDATE_SUCCESS: {
      const location = action.payload.location
      return {
        ...store,
        updatingLocation: false,
        error: null,
        currentUser: {
          ...store.currentUser,
          locations: store.currentUser.locations.map(l =>
            l._id.toString() === location._id.toString() ? location : l)
        }
      }
    }
    case LOCATION_UDPATE_FAILURE:
      return {
        ...store,
        updatingLocation: false,
        error: action.payload.error
      }
    case LOCATION_DELETE_BEGIN:
      return {
        ...store,
        deletingLocation: true,
        error: null
      }
    case LOCATION_DELETE_SUCCESS: {
      const location = action.payload.location
      return {
        ...store,
        deletingLocation: false,
        error: null,
        currentUser: {
          ...store.currentUser,
          locations: store.currentUser.filter(l => l._id.toString() !== location._id.toString())
        }
      }
    }
    case LOCATION_DELETE_FAILURE:
      return {
        ...store,
        deletingLocation: false,
        error: action.payload.error
      }
    default:
      return store
  }
}

export default userReducer