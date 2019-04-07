import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Navbar, FormGroup, FormControl, Button } from 'react-bootstrap'
import { login } from '../../actions/userActions'
import { addUIMessage } from '../../actions/uiMessageActions'
import { getAllCountries } from '../../actions/countryActions'
import { getAllSoilTypes } from '../../actions/soilTypeActions'
import { getAllEntries } from '../../actions/diaryActions'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const credentials = {
      username: this.state.username,
      password: this.state.password
    }
    console.log('Login (Login.js)', credentials)
    await this.props.login(credentials)
    if (this.props.error) {
      await this.props.addUIMessage('Wrong username or password', 'error', 10)
    } else {
      console.log('Getting static data')
      await this.props.getAllCountries()
      await this.props.getAllSoilTypes()
      console.log('Static data retrieved')
      console.log('Getting personal data')
      await this.props.getAllEntries()
    }
  }

  render() {
    return (
      <Navbar.Form>
        <FormGroup>
          <FormControl
            placeholder='Username'
            name='username'
            size='mini'
            value={this.state.username}
            onChange={this.handleChange}
            style={{ marginRight: 5 }}
          />
          <FormControl
            placeholder='Password'
            name='password'
            size='mini'
            value={this.state.password}
            onChange={this.handleChange}
            style={{ marginRight: 5 }}
          />
        </FormGroup>
        <Button type='submit' onClick={this.handleSubmit}>Login</Button>
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
    addUIMessage,
    getAllCountries,
    getAllSoilTypes,
    getAllEntries
  }
)(Login))