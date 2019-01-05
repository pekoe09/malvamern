import React from 'react'
import propTypes from 'prop-types'
import { Button, Modal } from 'react-bootstrap'

const ConfirmDelete = ({ headerText, bodyText, modalIsOpen, closeModal, isDangerous }) => {
  const handleCloseModal = (isConfirmed, closeModal) => {
    closeModal(isConfirmed)
  }

  return (
    <Modal
      show={modalIsOpen}
    >
      <Modal.Header>
        {headerText}
      </Modal.Header>
      <Modal.Body>
        {bodyText}
      </Modal.Body>
      <Modal.Footer>
        <Button
          bsStyle='default'
          onClick={() => handleCloseModal(false, closeModal)}
        >
          Peruuta
        </Button>
        {isDangerous &&
          <Button
            bsStyle='danger'
            onClick={() => handleCloseModal(true, closeModal)}
          >
            Poista
          </Button>
        }
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmDelete

ConfirmDelete.propTypes = {
  headerText: propTypes.string,
  bodyText: propTypes.string,
  modalIsOpen: propTypes.bool.isRequired,
  closeModal: propTypes.func.isRequired,
  isDangerous: propTypes.bool.isRequired
}