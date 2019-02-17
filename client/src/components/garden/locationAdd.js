import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, FormControl, Checkbox, Alert } from 'react-bootstrap'
import Select from 'react-select'
import { MalvaForm, MalvaControlLabel, MalvaFormGroup, MalvaButton } from '../common/MalvaStyledComponents'

class LocationAdd extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      city: '',
      country: 'Suomi',
      soilTypes: [],
      isActive: true,
      touched: {
        name: false
      }
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSoilTypeChange = (soilTypes) => {
    this.setState({ soilTypes })
  }

  handleCheckboxToggle = (event) => {
    this.setState({ [event.target.name]: !this.state[event.target.name] })
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
    const location = {
      name: this.state.name,
      city: this.state.city,
      country: this.state.country,
      soilTypes: this.state.soilTypes,
      isActive: this.state.isActive
    }
    await this.props.handleSave(location)
  }

  handleCloseModal = () => {
    this.props.closeModal()
  }

  handleExit = () => {
    this.setState({
      name: '',
      city: '',
      country: 'Suomi',
      soilTypes: [],
      isActive: true,
      touched: {
        name: false
      }
    })
  }

  validate = () => {
    return {
      name: !this.state.name
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
          <Modal.Title>Lisää istutuspaikka</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.props.modalError && <Alert bsStyle='danger'>{this.props.modalError}</Alert>}
          <MalvaForm>
            <MalvaFormGroup validationState={this.getValidationState(errors, 'name')}>
              <MalvaControlLabel>Nimi</MalvaControlLabel>
              <FormControl
                type='text'
                name='name'
                value={this.state.name}
                onChange={this.handleChange}
                onBlur={this.handleBlur('name')}
              />
            </MalvaFormGroup>

            <MalvaFormGroup validationState={this.getValidationState(errors, 'city')}>
              <MalvaControlLabel>Paikkakunta</MalvaControlLabel>
              <FormControl
                type='text'
                name='city'
                value={this.state.city}
                onChange={this.handleChange}
                onBlur={this.handleBlur('city')}
              />
            </MalvaFormGroup>
            <MalvaFormGroup validationState={this.getValidationState(errors, 'country')}>
              <MalvaControlLabel>Maa</MalvaControlLabel>
              <FormControl
                type='text'
                name='country'
                value={this.state.country}
                onChange={this.handleChange}
                onBlur={this.handleBlur('country')}
              />
            </MalvaFormGroup>
            <MalvaFormGroup>
              <Checkbox
                name='isActive'
                checked={this.state.isActive}
                onChange={this.handleCheckboxToggle}
                inline
              >
                Aktiivinen
              </Checkbox>
            </MalvaFormGroup>
            <MalvaFormGroup validationState={this.getValidationState(errors, 'soilTypes')}>
              <MalvaControlLabel>Maaperätyypit</MalvaControlLabel>
              <Select
                name='soilTypes'
                value={this.state.soilTypes}
                onChange={this.handleSoilTypeChange}
                options={this.props.soilTypes}
                isMulti
              />
            </MalvaFormGroup>
          </MalvaForm>

        </Modal.Body>

        <Modal.Footer>
          <MalvaButton
            name='savebtn'
            onClick={this.handleSubmit}
            btntype='primary'
            disabled={!isEnabled}
          >
            Tallenna
          </MalvaButton>
          <MalvaButton
            name='cancelbtn'
            btntype='default'
            onClick={this.handleCloseModal}
          >
            Peruuta
          </MalvaButton>
        </Modal.Footer>
      </Modal>
    )
  }
}

const mapStateToProps = store => ({
  soilTypes: store.soilTypes.items.map(s => (
    {
      ...s,
      value: s._id,
      label: s.name
    }
  ))
})

export default connect(
  mapStateToProps
)(LocationAdd)

LocationAdd.propTypes = {
  modalIsOpen: propTypes.bool.isRequired,
  closeModal: propTypes.func.isRequired,
  handleSave: propTypes.func.isRequired,
  modalError: propTypes.string.isRequired
}