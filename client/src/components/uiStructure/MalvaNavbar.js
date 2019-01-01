import React from 'react'
import { connect } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import Login from '../users/Login'
import Logout from '../users/Logout'

const StyledNavbar = styled(Navbar)`
      background: green;
      marginBottom: 0;
    `

const AnonymousVisitorNavs = () => {
  return (
    <Nav bsClass='malva-navitem'>
      <LinkContainer to='/plants'>
        <NavItem>
          Kasvit
        </NavItem>
      </LinkContainer>
    </Nav>
  )
}

const AnonymousVisitorActions = () => {
  return (
    <Nav pullRight bsClass='malva-navitem'>
      <LinkContainer to='/register'>
        <NavItem>
          Rekisteröidy tästä
        </NavItem>
      </LinkContainer>
      <NavItem style={{ padding: 0, marginTop: 0 }}>
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
    <StyledNavbar fixedTop fluid className='malva-navbar-default'>
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