import React from 'react'
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import MalvaLayout from '../uiStructure/MalvaLayout'


class App extends React.Component {
  render() {
    return (
      <MalvaLayout>
        <p>Nothing to see here, disperse!</p>
      </MalvaLayout>
    )
  }
}

export default withRouter(connect(
  null
)(App))