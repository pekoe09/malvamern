import React from 'react'
import PropTypes from 'prop-types'

const dateHeaderStyle = {
  textAlign: 'center',
  marginTop: 0
}

const dateHeaderLineStyle = {
  backgroundColor: 'darkGreen',
  height: 2,
  margin: 0,
  marginBottom: 10,
  border: 'none'
}

const DateHeader = ({ text }) => {
  return (
    <>
      <h3 style={dateHeaderStyle}>{text}</h3>
      <hr style={dateHeaderLineStyle} />
    </>
  )
}

export default DateHeader

DateHeader.propTypes = {
  text: PropTypes.string.isRequired
}