import React from 'react'
import { connect } from 'react-redux'
import { Alert } from 'react-bootstrap'

const getAlerts = (messages) => {
  return messages.map(m =>
    <Alert
      bsStyle={m.type}
      key={m.timestamp + m.content}>{m.content} {m.timestamp + ' '}
    </Alert>
  )
}

const UIMessages = ({ messages }) => {
  return (
    <div>
      {messages ? getAlerts(messages) : ''}
    </div>
  )
}

const mapStateToProps = store => {
  return {
    messages: store.uiMessages.items
  }
}

export default connect(
  mapStateToProps
)(UIMessages)