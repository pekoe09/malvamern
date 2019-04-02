import React from 'react'

const dateHeaderStyle = {
  textAlign: 'center',
  marginTop: 0
}

const DateHeader = ({ text }) => {
  return (
    <h3 style={dateHeaderStyle}>{text}</h3>
  )
}

export default DateHeader