import React from 'react'

const MalvaViewHeader = ({ text }) => {
  return <h2 style={{ fontFamily: 'sans-serif' }}>{text}</h2>
}

const MalvaPlantHeader = ({ text }) => {
  return (
    <p
      style={{
        fontFamily: 'sans-serif',
        color: 'darkgreen',
        fontWeight: 700,
        fontSize: '1.8em'
      }}
    >
      {text}
    </p>
  )
}

const MalvaPlantSubHeader = ({ text }) => {
  return (
    <p
      style={{
        fontFamily: 'sans-serif',
        color: 'darkgreen',
        fontWeight: 700,
        fontSize: '1.4em',
        fontStyle: 'italic'
      }}
    >
      {text}
    </p>
  )
}

const MalvaPlantSectionHeader = ({ text }) => {
  return (
    <p
      style={{
        fontFamily: 'sans-serif',
        color: 'black',
        fontWeight: 700,
        fontSize: '1.2em'
      }}
    >
      {text}
    </p>
  )
}

const MalvaPlantFieldHeader = ({ text }) => {
  return (
    <p
      style={{
        fontFamily: 'sans-serif',
        color: 'black',
        fontWeight: 700
      }}
    >
      {text}
    </p>
  )
}

export {
  MalvaViewHeader,
  MalvaPlantHeader,
  MalvaPlantSubHeader,
  MalvaPlantSectionHeader,
  MalvaPlantFieldHeader
}