import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import DateHeader from './DateHeader'
import DateSubHeader from './DateSubHeader'
import Entry from './Entry'
import EmptyListNote from '../common/EmptyListNote'

const datePageStyle = {
  height: '100vh',
  padding: 15
}

const getSubHeaders = (entries) => {
  return (
    <>
      <DateSubHeader text='Istutukset' />
      {getEntries(entries, 'plantingEntry')}
      <DateSubHeader text='Hoitotyöt' />
      {getEntries(entries, 'taskEntry')}
      <DateSubHeader text='Omat merkinnät' />
      {getEntries(entries, 'userEntry')}
    </>
  )
}

const getEntries = (entries, type) => {
  if (!entries || entries.length === 0) {
    return null
  }
  return entries
    .filter(e => e.type === type)
    .map(e =>
      <Entry
        key={e._id}
        title={e.title}
        body={e.body}
        images={e.images}
      />
    )
}

const DatePage = ({ entries, date }) => {
  let dateStr = moment(Date.now()).format('D.M.YYYY')
  if (date) {
    dateStr = moment(date).format('D.M.YYYY')
  }
  return (
    <div style={datePageStyle}>
      <DateHeader text={dateStr} />
      {(!entries || entries.length === 0) && <EmptyListNote text='Sinulla ei ole vielä päiväkirjamerkintöjä' />}
      {getSubHeaders(entries)}
    </div>
  )
}

export default DatePage

DatePage.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  entries: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    body: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      caption: PropTypes.string
    }))
  })).isRequired
}