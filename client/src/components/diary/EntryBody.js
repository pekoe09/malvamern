import React from 'react'
import PropTypes from 'prop-types'

const EntryBody = ({ body }) => {
  return (
    <div>
      {body}
    </div>
  )
}

export default EntryBody

EntryBody.propTypes = {
  body: PropTypes.string.isRequired
}