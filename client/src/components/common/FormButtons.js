import React from 'react'
import PropTypes from 'prop-types'
import { Row } from 'react-bootstrap'
import { MalvaButton, MalvaLinkButton } from './MalvaStyledComponents'

const FormButtons = ({
  handleSubmit,
  submitIsEnabled,
  cancelUrl,
  cancelBtnText,
  handleClear,
  handleDelete
}) => {
  return (
    <Row style={{ paddingLeft: 15 }}>
      <MalvaButton
        name='savebtn'
        disabled={!submitIsEnabled}
        btntype='primary'
        onClick={handleSubmit}
      >
        Tallenna
      </MalvaButton>
      <MalvaLinkButton
        name='cancelbtn'
        text={cancelBtnText}
        to={cancelUrl}
        btnType='default'
      />
      {
        handleClear &&
        <MalvaButton
          name='clearbtn'
          btntype='default'
          onClick={handleClear}
        >
          Tyhjennä
        </MalvaButton>
      }
      {
        handleDelete &&
        <MalvaButton
          name='deletebtn'
          btntype='danger'
          onClick={handleDelete}
        >
          Poista
        </MalvaButton>
      }
    </Row>
  )
}

export default FormButtons

FormButtons.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitIsEnabled: PropTypes.bool.isRequired,
  cancelUrl: PropTypes.string.isRequired,
  cancelBtnText: PropTypes.string,
  handleClear: PropTypes.func,
  handleDelete: PropTypes.func
}