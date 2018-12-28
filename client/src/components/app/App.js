import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

class App extends React.Component {
  render() {
    return (
      <div>
        <p>Nothing to see here, disperse!</p>
      </div>
    )
  }
}

export default withRouter(connect(
  null
)(App))