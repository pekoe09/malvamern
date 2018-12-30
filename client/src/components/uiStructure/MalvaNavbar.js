import React from 'react'
import { connect } from 'react-redux'
import { Navbar } from 'react-bootstrap'

class MalvaNavbar extends React.Component {

  render() {
    return (
      <Navbar style={{ marginBottom: 0 }}>
        <Navbar.Header>
          <Navbar.Brand>
            Luppio
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>
    )
  }
}

export default connect(
  null
)(MalvaNavbar)