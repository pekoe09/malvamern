import React from 'react'
import styled, { css } from 'styled-components'
import ReactTable from 'react-table'
import { Form, ControlLabel } from 'react-bootstrap'

const MalvaReactTable = styled(ReactTable)`
  margin: 10px;
`

const MalvaForm = styled(Form)`
    font-family: 'sans serif'
  `

const MalvaControlLabel = styled(ControlLabel)`
    font-weight: 500
  `

export {
  MalvaReactTable,
  MalvaForm,
  MalvaControlLabel
}