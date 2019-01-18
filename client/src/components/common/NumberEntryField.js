import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, HelpBlock } from 'react-bootstrap'
import { MalvaControlLabel, MalvaFormGroup } from '../common/MalvaStyledComponents'

const NumberEntryField = ({
  name, text, value, min, max, validate, errors, handleChange, handleBlur
}) => {
  return (
    <MalvaFormGroup validationState={validate(errors, name)}>
      <MalvaControlLabel>{text}</MalvaControlLabel>
      <FormControl
        type='number'
        name={name}
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <HelpBlock>{errors[name]}</HelpBlock>
    </MalvaFormGroup>
  )
}

export default NumberEntryField

NumberEntryField.propTypes = {
  errors: PropTypes.object.isRequired,
  validate: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired
}