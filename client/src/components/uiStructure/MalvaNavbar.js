import React from 'react'
import { connect } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import Login from '../users/Login'
import Logout from '../users/Logout'

const StyledNavbar = styled(Navbar)`
      background: green;
      marginBottom: 0;
    `

const AnonymousVisitorNavs = () => {
  return (
    <Nav>
      <NavItem>
        <NavLink to='/plants'>
          Kasvit
        </NavLink>
      </NavItem>
    </Nav>
  )
}

const AnonymousVisitorActions = () => {
  return (
    <Nav pullRight>
      <NavItem>
        <NavLink to='/register' style={{ fontSize: '1.3em', color: 'white', textDecoration: 'none', fontFamily: 'sans-serif' }}>
          Rekisteröidy!
        </NavLink>
      </NavItem>
      <NavItem style={{ padding: 0 }}>
        <Login />
      </NavItem>
    </Nav>
  )
}

const LoggedInVisitorNavs = () => {
  return (
    <Nav>
      <NavItem>
        <NavLink to='/plants'>
          Kasvit
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink to='/calendar'>
          Kalenteri
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink to='/diary'>
          Päiväkirja
        </NavLink>
      </NavItem>
    </Nav>
  )
}

const LoggedInVisitorActions = ({ currentUser }) => {
  return (
    <Nav pullRight>
      <NavItem>
        <Logout />
      </NavItem>
      <Navbar.Text>
        <NavLink to='/my-info'>
          {currentUser.firstNames}
        </NavLink>
      </Navbar.Text>
    </Nav>
  )
}

const MalvaNavbar = ({ currentUser }) => {

  return (
    <StyledNavbar fixedTop fluid>
      <Navbar.Header>
        <Navbar.Brand>
          <NavLink to='/'>
            Luppio
          </NavLink>
        </Navbar.Brand>
      </Navbar.Header>

      {currentUser && <LoggedInVisitorNavs />}
      {!currentUser && <AnonymousVisitorNavs />}

      {!currentUser && <AnonymousVisitorActions />}
      {currentUser && <LoggedInVisitorActions currentUser={currentUser} />}
    </StyledNavbar>
  )
}

const mapStateToProps = store => ({
  currentUser: store.users.currentUser
})

export default withRouter(connect(
  mapStateToProps
)(MalvaNavbar))