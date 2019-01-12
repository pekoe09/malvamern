import React from 'react'
import PropTypes from 'prop-types'

const emptyListNoteStyle = {
  textAlign: 'center',
  fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, Trebuchet MS, sans-serif",
  marginTop: 15,
  padding: 15,
  backgroundColor: 'lightgrey',
  borderRadius: 8
}

const EmptyListNote = ({ text }) => {
  return (
    <h4 style={emptyListNoteStyle}>{text}</h4>
  )
}

export default EmptyListNote

EmptyListNote.propTypes = {
  text: PropTypes.string
}