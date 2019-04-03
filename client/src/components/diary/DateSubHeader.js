import React from 'react'
import PropTypes from 'prop-types'

const dateSubHeaderStyle = {
  backgroundColor: 'darkGreen',
  color: 'white',
  textAlign: 'center',
  padding: 5,
  marginBottom: 5,
  borderRadius: 3
}

const DateSubHeader = ({ text }) => {
  return (
    <div style={dateSubHeaderStyle}>{text}</div>
  )
}

export default DateSubHeader

DateSubHeader.propTypes = {
  text: PropTypes.string.isRequired
}