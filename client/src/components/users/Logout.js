import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Navbar, Button } from 'react-bootstrap'
import { logout } from '../../actions/userActions'

const Logout = ({ logout, history }) => {
  const handleLogout = () => {
    logout()
    history.push('/')
  }

  return (
    <Navbar.Form>
      <Button
        onClick={handleLogout}
        size='mini'
      >
        Logout
      </Button>
    </Navbar.Form>
  )
}

export default withRouter(connect(
  null,
  {
    logout
  }
)(Logout))