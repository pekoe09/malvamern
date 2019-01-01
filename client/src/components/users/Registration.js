import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Col, Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap'
import ViewHeader from '../common/ViewHeader'
import LinkButton from '../common/LinkButton'
import { register } from '../../actions/userActions'
import { addUIMessage } from '../../actions/uiMessageActions'

const StyledForm = styled(Form)`
  font-family: 'sans serif'
`

const StyledControlLabel = styled(ControlLabel)`
      font-weight: 500
    `

class Registration extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      password2: '',
      lastName: '',
      firstNames: '',
      email: '',
      touched: {
        username: false,
        password: false,
        password2: false,
        lastName: false,
        firstNames: false,
        email: false
      }
    }
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handlePasswordChange = (event) => {
    console.log(event.target.value)
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    if (this.state.password !== this.state.password2) {
      this.props.addUIMessage('"Password and "Confirm password" fields do not match!', 'error', 10)
    } else {
      const user = {
        username: this.state.username,
        password: this.state.password,
        password2: this.state.password2,
        lastName: this.state.lastName,
        firstNames: this.state.firstNames,
        email: this.state.email
      }
      await this.props.register(user)
      if (!this.props.error) {
        this.props.addUIMessage(
          `Hi ${user.firstNames}, welcome to use Droplets! Please login with your new username and password.`,
          'success',
          10
        )
        this.props.history.push('/')
      } else {
        this.props.addUIMessage('Registration failed!', 'error', 10)
      }
    }
  }

  handleBlur = (field) => () => {
    this.setState({
      touched: {
        ...this.state.touched,
        [field]: true
      }
    })
  }

  validate = () => {
    return {
      username: !this.state.username,
      password: !this.state.password,
      password2: !this.state.password2,
      lastName: !this.state.lastName,
      firstNames: !this.state.firstNames,
      email: !this.state.email
    }
  }

  render() {
    const errors = this.validate()
    const isEnabled = !Object.keys(errors).some(x => errors[x])

    return (
      <div>
        <ViewHeader text='Aloita Luppion käyttö nyt!' />
        {this.props.registering && <h3>Handling registration...</h3>}

        <Col sm={6}>
          <StyledForm onSubmit={this.handleSubmit}>
            <FormGroup validationState={errors.username && this.state.touched.username}>
              <StyledControlLabel>Käyttäjätunnus</StyledControlLabel>
              <FormControl
                type='text'
                name='username'
                value={this.state.username}
                onChange={this.handleChange}
                onBlur={this.handleBlur('username')}
              />
            </FormGroup>
            <FormGroup validationState={errors.password && this.state.touched.password}>
              <StyledControlLabel>Salasana</StyledControlLabel>
              <FormControl
                type='password'
                name='password'
                value={this.state.password}
                onChange={this.handleChange}
                onBlur={this.handleBlur('password')}
              />
            </FormGroup>
            <FormGroup validationState={errors.password2 && this.state.touched.password2}>
              <StyledControlLabel>Vahvista Salasana</StyledControlLabel>
              <FormControl
                type='password'
                name='password2'
                value={this.state.password2}
                onChange={this.handleChange}
                onBlur={this.handleBlur('password2')}
              />
            </FormGroup>
            <FormGroup validationState={errors.email && this.state.touched.email}>
              <StyledControlLabel>Sähköposti</StyledControlLabel>
              <FormControl
                type='text'
                name='email'
                value={this.state.email}
                onChange={this.handleChange}
                onBlur={this.handleBlur('email')}
              />
            </FormGroup>
            <FormGroup validationState={errors.lastName && this.state.touched.lastName}>
              <StyledControlLabel>Sukunimi</StyledControlLabel>
              <FormControl
                type='text'
                name='lastName'
                value={this.state.lastName}
                onChange={this.handleChange}
                onBlur={this.handleBlur('lastName')}
              />
            </FormGroup>
            <FormGroup validationState={errors.firstNames && this.state.touched.firstNames}>
              <StyledControlLabel>Etunimi</StyledControlLabel>
              <FormControl
                type='text'
                name='firstNames'
                value={this.state.firstNames}
                onChange={this.handleBlur('firstNames')}
                onBlur={this.handleBlur('firstNames')}
              />
            </FormGroup>
            <Button
              bsStyle='primary'
              disabled={!isEnabled}
              style={{ marginRight: 5 }}
            >
              Rekisteröidy!
            </Button>
            <LinkButton
              text='Peruuta'
              to='/'
              type='default'
            />
          </StyledForm>
        </Col>
      </div>
    )
  }
}

const mapStateToProps = store => ({
  registering: store.users.registering,
  error: store.users.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    addUIMessage,
    register
  }
)(Registration))