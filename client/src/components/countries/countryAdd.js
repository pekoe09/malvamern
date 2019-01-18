import React from 'react'
import propTypes from 'prop-types'
import { Button, Modal, FormControl, FormGroup, Alert } from 'react-bootstrap'
import { MalvaForm, MalvaControlLabel } from '../common/MalvaStyledComponents'

class CountryAdd extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      abbreviation: '',
      touched: {
        name: false,
        abbreviation: false
      }
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleBlur = (field) => () => {
    this.setState({
      touched: {
        ...this.state.touched,
        [field]: true
      }
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const country = {
      name: this.state.name,
      abbreviation: this.state.abbreviation
    }
    await this.props.handleSave(country)
  }

  handleCloseModal = () => {
    this.props.closeModal()
  }

  handleExit = () => {
    this.setState({
      name: '',
      abbreviation: '',
      touched: {
        name: false,
        abbreviation: false
      }
    })
  }

  validate = () => {
    return {
      name: !this.state.name,
      abbreviation: !this.state.abbreviation
    }
  }

  getValidationState = (errors, fieldName) => {
    if (errors[fieldName] && this.state.touched[fieldName]) {
      return 'error'
    } else {
      return null
    }
  }

  render() {
    const errors = this.validate()
    const isEnabled = !Object.keys(errors).some(x => errors[x])

    return (
      <Modal
        show={this.props.modalIsOpen}
        onHide={this.handleCloseModal}
        onExit={this.handleExit}
      >
        <Modal.Header closeButton>
          <Modal.Title>Lisää maa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.modalError && <Alert bsStyle='danger'>{this.props.modalError}</Alert>}
          <MalvaForm>
            <FormGroup validationState={this.getValidationState(errors, 'name')}>
              <MalvaControlLabel>Nimi</MalvaControlLabel>
              <FormControl
                type='text'
                name='name'
                value={this.state.name}
                onChange={this.handleChange}
                onBlur={this.handleBlur('name')}
              />
            </FormGroup>
            <FormGroup validationState={this.getValidationState(errors, 'abbreviation')}>
              <MalvaControlLabel>Lyhenne</MalvaControlLabel>
              <FormControl
                type='text'
                name='abbreviation'
                value={this.state.abbreviation}
                onChange={this.handleChange}
                onBlur={this.handleBlur('abbreviation')}
              />
            </FormGroup>
          </MalvaForm>

        </Modal.Body>
        <Modal.Footer>
          <Button
            bsStyle='primary'
            type='submit'
            onClick={this.handleSubmit}
            disabled={!isEnabled}
            style={{ marginRight: 5 }}
          >
            Tallenna
          </Button>
          <Button
            bsStyle='default'
            onClick={this.handleCloseModal}
          >
            Peruuta
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default CountryAdd

CountryAdd.propTypes = {
  modalIsOpen: propTypes.bool.isRequired,
  closeModal: propTypes.func.isRequired,
  handleSave: propTypes.func.isRequired,
  modalError: propTypes.string.isRequired
}