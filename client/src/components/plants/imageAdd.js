import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, FormControl, Checkbox, Alert } from 'react-bootstrap'
import { MalvaForm, MalvaControlLabel, MalvaFormGroup, MalvaButton } from '../common/MalvaStyledComponents'

class ImageAdd extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      ordinality: 0,
      file: '',
      touched: {
        name: false,
        ordinality: false
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
    const image = {
      name: this.state.name,
      ordinality: this.state.ordinality,

    }
    await this.props.handleSave(image)
  }

  handleCloseModal = () => {
    this.props.closeModal()
  }

  handleExit = () => {
    this.setState({
      name: '',
      ordinality: 0,
      file: '',
      touched: {
        name: false,
        ordinality: false
      }
    })
  }

  validate = () => {
    return {
      name: !this.state.name,
      ordinality: this.state.ordinality < 0
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
          <Modal.Title>Lisää kuva</Modal.Title>
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
            <MalvaFormGroup validationState={this.getValidationState(errors, 'ordinality')}>
              <MalvaControlLabel>Järjestysnumero</MalvaControlLabel>
              <FormControl
                type='number'
                name='ordinality'
                value={this.state.ordinality}
                onChange={this.handleChange}
                onBlur={this.handleBlur('ordinality')}
              />
            </MalvaFormGroup>
            <MalvaFormGroup validationState={this.getValidationState(errors, 'file')}>
              <MalvaControlLabel>Nimi</MalvaControlLabel>
              <FormControl
                type='file'
                name='file'
                value={this.state.file}
                onChange={this.handleChange}
                onBlur={this.handleBlur('ordinality')}
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
  imageUploading: store.images.uploading,
  imageUploadError: store.images.error
})

export default connect(
  mapStateToProps
)(ImageAdd)

ImageAdd.propTypes = {
  modalIsOpen: propTypes.bool.isRequired,
  closeModal: propTypes.func.isRequired,
  handleSave: propTypes.func.isRequired,
  modalError: propTypes.string.isRequired
}