import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Navbar, FormGroup, FormControl, Button } from 'react-bootstrap'
import { login } from '../../actions/userActions'
import { addUIMessage } from '../../actions/uiMessageActions'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const credentials = {
      username: this.state.username,
      password: this.state.password
    }
    await this.props.login(credentials)
    if (this.props.error) {
      await this.props.addUIMessage('Wrong username or password', 'error', 10)
    }
  }

  render() {
    return (
      <Navbar.Form onSubmit={this.handleSubmit}>
        <FormGroup inline>
          <FormControl
            inline
            placeholder='Username'
            name='username'
            size='mini'
            value={this.state.username}
            onChange={this.handleChange}
          />
          <FormControl
            inline
            placeholder='Password'
            name='password'
            size='mini'
            value={this.state.password}
            onChange={this.handleChange}
          />
        </FormGroup>
        <Button primary size='mini'>Login</Button>
      </Navbar.Form>
    )
  }
}

const mapStateToProps = store => ({
  loggingIn: store.users.loggingIn,
  error: store.users.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    login,
    addUIMessage
  }
)(Login))