import React from 'react'
import moment from 'moment'
import DateHeader from './DateHeader'
import EmptyListNote from '../common/EmptyListNote'

const datePageStyle = {
  backgroundColor: 'lightGrey',
  height: '100vh',
  padding: 15
}

const DatePage = ({ entries, date }) => {
  let dateStr = moment(Date.now()).format('D.M.YYYY')
  if (date) {
    dateStr = moment(date).format('D.M.YYYY')
  }
  return (
    <div style={datePageStyle}>
      <DateHeader text={dateStr} />
      {!entries && <EmptyListNote text='Sinulla ei ole vielä päiväkirjamerkintöjä' />}
    </div>
  )
}

export default DatePage