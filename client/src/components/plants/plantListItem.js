import React from 'react'
import PropTypes from 'prop-types'

const plantListItemStyle = {
  marginBottom: 5,
  padding: 5,
  borderStyle: 'solid',
  borderColor: 'lightGreen'
}

const PlantListItem = ({ plant }) => {
  return (
    <div style={plantListItemStyle}>
      <h3>{plant.name}</h3>
      <h4>{plant.scientificName}</h4>
    </div>
  )
}

export default PlantListItem

PlantListItem.propTypes = {
  plant: PropTypes.shape({
    name: PropTypes.string.isRequired,
    scientificName: PropTypes.string.isRequired
  })
}