import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, FormControl, Alert } from 'react-bootstrap'
import { MalvaForm, MalvaControlLabel, MalvaFormGroup, MalvaButton } from '../common/MalvaStyledComponents'

class ImageAdd extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: '',
      name: '',
      ordinality: 0,
      image: null,
      isEditing: false,
      touched: {
        name: false,
        ordinality: false
      }
    }
  }

  setEditingImage = async () => {
    console.log('Imagedetails prop', this.props.editingImage)
    if (this.props.editingImage) {
      this.setState({
        isEditing: true,
        _id: this.props.editingImage._id,
        name: this.props.editingImage.name,
        ordinality: this.props.editingImage.ordinality
      })
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleFileChange = (event) => {
    console.log(event.target.files)
    this.setState({
      image: event.target.files[0],
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
    console.log(this.state.image)
    const image = {
      _id: this.state._id,
      name: this.state.name,
      ordinality: this.state.ordinality,
      file: this.state.image
    }
    await this.props.handleSave(image)
  }

  handleCloseModal = () => {
    this.props.closeModal()
  }

  handleExit = () => {
    this.setState({
      _id: '',
      name: '',
      ordinality: 0,
      image: null,
      isEditing: false,
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

  addFileInput = (errors) => {
    return (
      <MalvaFormGroup validationState={this.getValidationState(errors, 'image')}>
        <MalvaControlLabel>Tiedosto</MalvaControlLabel>
        <FormControl
          type='file'
          name='image'
          onChange={this.handleFileChange}
        />
      </MalvaFormGroup>
    )
  }

  addDeleteBtn = () => {
    return (
      <MalvaButton
        name='deletebtn'
        onClick={() => this.props.handleDelete(
          {
            _id: this.state._id,
            name: this.props.editingImage.name
          }
        )}
        btntype='danger'
      >
        Poista
      </MalvaButton>
    )
  }

  render() {
    const errors = this.validate()
    const isEnabled = !Object.keys(errors).some(x => errors[x])

    return (
      <Modal
        show={this.props.modalIsOpen}
        onEnter={this.setEditingImage}
        onHide={this.handleCloseModal}
        onExit={this.handleExit}
      >
        <Modal.Header closeButton>
          {this.state.isEditing && <Modal.Title>Muokkaa kuvan tietoja</Modal.Title>}
          {!this.state.isEditing && <Modal.Title>Lisää kuva</Modal.Title>}
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
            {!this.state.isEditing && this.addFileInput(errors)}
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
          {this.state.isEditing && this.addDeleteBtn()}
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
  editingImage: propTypes.object,
  closeModal: propTypes.func.isRequired,
  handleSave: propTypes.func.isRequired,
  handleDelete: propTypes.func.isRequired,
  modalError: propTypes.string.isRequired
}