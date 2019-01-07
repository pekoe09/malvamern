import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Modal, FormControl, FormGroup, Alert } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import { MalvaForm, MalvaControlLabel } from '../common/MalvaStyledComponents'

class SoilTypeAdd extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      countryId: '',
      touched: {
        name: false,
        country: false
      },
      selectedCountry: null
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleCountryChange = (country) => {
    this.setState({
      selectedCountry: country,
      countryId: country[0]._id
    })
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
    const soilType = {
      name: this.state.name,
      countryId: this.state.countryId
    }
    await this.props.handleSave(soilType)
  }

  handleCloseModal = () => {
    this.props.closeModal()
  }

  handleExit = () => {
    this.setState({
      name: '',
      countryId: '',
      touched: {
        name: false,
        country: false
      },
      selectedCountry: null
    })
  }

  validate = () => {
    return {
      name: !this.state.name,
      country: !this.state.countryId
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
          <Modal.Title>Lisää maatyyppi</Modal.Title>
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
            <FormGroup validationState={this.getValidationState(errors, 'country')}>
              <MalvaControlLabel>Maa</MalvaControlLabel>
              <Typeahead
                options={this.props.countries}
                onChange={(selected) => { this.handleCountryChange(selected) }}
                selected={this.state.selectedCountry}
                labelKey='name'
                ignoreDiacritics={false}
                minLength={1}
                selectHintOnEnter={true}
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

const mapStateToProps = store => ({
  countries: store.countries.items
})

export default connect(
  mapStateToProps
)(SoilTypeAdd)

SoilTypeAdd.propTypes = {
  modalIsOpen: propTypes.bool.isRequired,
  closeModal: propTypes.func.isRequired,
  handleSave: propTypes.func.isRequired,
  modalError: propTypes.string.isRequired
}