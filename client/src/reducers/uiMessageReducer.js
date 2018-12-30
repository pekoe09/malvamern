import {
  UIMESSAGE_ADD,
  UIMESSAGE_CLEAR
} from '../actions/uiMessageActions'

const initialState = {
  items: []
}

const uiMessageReducer = (store = initialState, action) => {
  switch (action.type) {
    case UIMESSAGE_ADD:
      return {
        ...store,
        items: store.items.concat(action.payload.message)
      }
    case UIMESSAGE_CLEAR:
      return {
        ...store,
        items: store.items.filter(m => m.timestamp !== action.payload.message.timestamp)
      }
    default:
      return store
  }
}

export default uiMessageReducer