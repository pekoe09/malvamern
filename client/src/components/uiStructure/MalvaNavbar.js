import React from 'react'
import { connect } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
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
    <Nav bsClass='malva-navitem'>
      <LinkContainer to='/plants'>
        <NavItem>
          Kasvit
        </NavItem>
      </LinkContainer>
      <LinkContainer to='/calendar'>
        <NavItem>
          Kalenteri
        </NavItem>
      </LinkContainer>
      <LinkContainer to='/diary'>
        <NavItem>
          Päiväkirja
        </NavItem>
      </LinkContainer>
    </Nav>
  )
}

const LoggedInAdminNavs = () => {
  return (
    <Nav bsClass='malva-navitem'>
      <NavDropdown title='Ohjaustiedot'>
        <LinkContainer to='/countries'>
          <MenuItem>Maat</MenuItem>
        </LinkContainer>
      </NavDropdown>
    </Nav>
  )
}

const LoggedInVisitorActions = () => {
  return (
    <Nav pullRight bsClass='malva-navitem'>
      <NavItem style={{ padding: 0, marginTop: 0 }}>
        <Logout />
      </NavItem>
    </Nav>
  )
}

const LoggedInVisitorSelf = ({ currentUser }) => {
  return (
    <LinkContainer to='/my-info' pullRight>
      <Navbar.Text className='malva-navbar-textlink'>
        {currentUser.firstNames}
      </Navbar.Text>
    </LinkContainer>
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
      {currentUser && <LoggedInAdminNavs />}
      {!currentUser && <AnonymousVisitorNavs />}

      {!currentUser && <AnonymousVisitorActions />}

      {currentUser && <LoggedInVisitorActions />}
      {currentUser && <LoggedInVisitorSelf currentUser={currentUser} />}
    </StyledNavbar>
  )
}

const mapStateToProps = store => ({
  currentUser: store.users.currentUser
})

export default withRouter(connect(
  mapStateToProps
)(MalvaNavbar))