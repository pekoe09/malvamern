import React from 'react'
import styled, { css } from 'styled-components'
import ReactTable from 'react-table'
import { Form, FormGroup, ControlLabel, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const MalvaReactTable = styled(ReactTable)`
    margin: 10px;
  `

const MalvaForm = styled(Form)`
    font-family: 'sans serif';
    margin-top: 5px;
  `

const MalvaControlLabel = styled(ControlLabel)`
    font-weight: 500;
  `

const MalvaFormGroup = styled(FormGroup)`
    margin-bottom: 5px;
  `

const MalvaLink = styled(Link)`
    color: white;
    text-decoration: none;
    display: inline;
    width: 100%;
    height: 100%;

    &:hover, &:focus, &:visited, &:link, &:active {
      text-decoration: none;
      color: white;
    }   
  `

const MalvaVerticalLink = styled(Link)`
  color: white;
  text-decoration: none;
  display: inline-grid;
  width: 100%;
  height: 100%;

  &:hover, &:focus, &:visited, &:link, &:active {
    text-decoration: none;
    color: white;
  }   
`

const MalvaButton = styled(Button)`
    color: white;
    background-color: darkgreen;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    margin-right: 5px;

    ${props => props.btntype === 'default' && css`
      background-color: lightgrey;
      color: black;  
    `}

    ${props => props.btntype === 'danger' && css`
      background: white;
      color: indianred;
      border-style: solid;
      border-color: indianred;
      border-width: 1.5px;
        
      &:hover, &:focus {
        background: pink;
        color: indianred;
        border-color: indianred;
        outline: none;
      }
      &:active:focus {
        background: pink;
        color: indianred;
        border-color: indianred;
        outline: none;
      }
    `}
  
    ${props => props.btntype === 'rowdanger' && css`
      background: white;
      color: indianred;
      border-style: solid;
      border-color: indianred;
      border-width: 1.5px;
      font-size: 0.8em;
      font-weight: 700;
        
      &:hover, &:focus {
        background: white;
        color: indianred;
        border-color: indianred;
        outline: none;
      }
      &:active:focus {
        background: pink;
        color: indianred;
        border-color: indianred;
        outline: none;
      }
    `}

    ${props => props.btntype === 'warning' && css`
      background: darkorange;
      color: black;
      border-style: solid;
      border-color: darkorange;
      border-width: 1.5px;
        
      &:hover, &:focus {
        background: orange;
        color: black;
        border-color: orange;
        outline: none;
      }
      &:active:focus {
        background: orange;
        color: black;
        border-color: orange;
        outline: none;
      }
    `}
  `

const MalvaLinkButton = ({ text, to, btnType }) => {
  return (
    <MalvaLink to={to}>
      <MalvaButton btntype={btnType}>{text}</MalvaButton>
    </MalvaLink>
  )
}

const MalvaVerticalLinkButton = ({ text, to, btnType }) => {
  return (
    <MalvaVerticalLink to={to}>
      <MalvaButton btntype={btnType}>{text}</MalvaButton>
    </MalvaVerticalLink>
  )
}

export {
  MalvaReactTable,
  MalvaForm,
  MalvaControlLabel,
  MalvaFormGroup,
  MalvaLink,
  MalvaButton,
  MalvaLinkButton,
  MalvaVerticalLinkButton
}