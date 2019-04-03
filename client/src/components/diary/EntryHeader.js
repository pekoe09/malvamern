import React from 'react'
import PropTypes from 'prop-types'

const EntryHeader = ({ text }) => {
  return (
    <h4>{text}</h4>
  )
}

export default EntryHeader

EntryHeader.propTypes = {
  text: PropTypes.string.isRequired
}