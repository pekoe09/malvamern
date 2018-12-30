import moment from 'moment'
import { setTimeout } from 'timers'

export const UIMESSAGE_ADD = 'UIMESSAGE_ADD'
export const UIMESSAGE_CLEAR = 'UIMESSAGE_CLEAR'

const addMessage = message => ({
  type: UIMESSAGE_ADD,
  payload: { message }
})

const clearMessage = message => ({
  type: UIMESSAGE_CLEAR,
  payload: { message }
})

export const addUIMessage = (content, type, timeout) => {
  return async (dispatch) => {
    const timestamp = new moment()
    const message = {
      content,
      type,
      timestamp
    }
    await dispatch(addMessage(message))
    setTimeout(() => {
      dispatch(clearMessage(message))
    }, timeout * 1000)
  }
}