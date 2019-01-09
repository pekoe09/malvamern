import React from 'react'
import propTypes from 'prop-types'
import { Button, Modal, FormControl, FormGroup, Alert } from 'react-bootstrap'
import { MalvaForm, MalvaControlLabel } from '../common/MalvaStyledComponents'

class CountryEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: this.props.country ? this.props.country._id : '',
      name: this.props.country ? this.props.country.name : '',
      abbreviation: this.props.country ? this.props.country.abbreviation: '',
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
      _id: this.state._id,
      name: this.state.name,
      abbreviation: this.state.abbreviation
    }
    await this.props.handleSave(country)
  }

  handleEnter = () => {
    this.setState({
      _id: this.props.country._id,
      name: this.props.country.name,
      abbreviation: this.props.country.abbreviation
    })
  }

  handleCloseModal = () => {
    this.props.closeModal()
  }

  handleExit = () => {
    this.setState({
      _id: '',
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
        onEnter={this.handleEnter}
        onHide={this.handleCloseModal}
        onExit={this.handleExit}
      >
        <Modal.Header closeButton>
          <Modal.Title>Päivitä maata</Modal.Title>
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

export default CountryEdit

CountryEdit.propTypes = {
  country: propTypes.shape({
    _id: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    abbreviation: propTypes.string.isRequired
  }),
  modalIsOpen: propTypes.bool.isRequired,
  closeModal: propTypes.func.isRequired,
  handleSave: propTypes.func.isRequired,
  modalError: propTypes.string.isRequired
}