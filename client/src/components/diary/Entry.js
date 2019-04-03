import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import EntryHeader from './EntryHeader'
import EntryBody from './EntryBody'

const entryStyle = {
  border: 'solid 1px lightGreen',
  borderRadius: 3,
  padding: 10
}

const Entry = ({ title, body, images }) => {
  return (
    <div style={entryStyle}>
      <Row>
        <Col sm={8}>
          {title && <EntryHeader text={title} />}
          {body && <EntryBody body={body} />}
        </Col>
        <Col sm={4}>

        </Col>
      </Row>
    </div>
  )
}

export default Entry

Entry.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    caption: PropTypes.string
  }))
}