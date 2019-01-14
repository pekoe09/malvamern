import React from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'react-bootstrap'
import { MalvaVerticalLinkButton, MalvaButton } from '../common/MalvaStyledComponents'

const plantListItemStyle = {
  display: 'grid',
  marginBottom: 8,
  padding: 5,
  borderStyle: 'solid',
  borderColor: 'lightGreen',
  borderRadius: 8,
  borderWidth: 2
}

const plantListItemHeaderStyle = {
  fontSize: '1.6em',
  fontFamily: 'serif',
  fontWeight: 700,
  color: 'darkgreen'
}

const plantScientificNameStyle = {
  fontSize: '0.8em',
  fontStyle: 'italic'
}

const plantListItemStatsStyle = {
  fontFamily: 'sans-serif',
  color: 'darkGreen'
}

const plantListItemBodyStyle = {
  fontFamily: 'sans-serif'
}

const PlantListItem = ({ plant, handleDelete }) => {
  return (
    <div style={plantListItemStyle}>
      <Row style={{ height: '100%' }}>
        <Col sm={2} style={{ display: 'grid', height: '100%' }}>
          <div style={{ background: 'lightgrey' }}>Image placeholder</div>
        </Col>
        <Col sm={10} style={{ padding: 0 }}>
          <div>
            <Col sm={10} style={{ padding: 0 }}>
              <p style={plantListItemHeaderStyle}>{plant.name} (<span style={plantScientificNameStyle}>{plant.scientificName}</span>)</p>
            </Col>
            <Col sm={2} style={{ display: 'inline-grid' }}>
              <MalvaButton
                onClick={handleDelete}
                btntype='danger'
              >
                Poista
              </MalvaButton>
            </Col>
          </div>
          <div style={plantListItemStatsStyle}>
            <Col sm={12} style={{ padding: 0 }}>
              <p>Korkeus: {plant.height} cm Leveys: {plant.width} cm</p>
            </Col>
          </div>
          <div style={plantListItemBodyStyle}>
            <Col sm={10} style={{ padding: 0 }}>
              <p>{plant.shortDescription}</p>
            </Col>
            <Col sm={2} style={{ display: 'inline-grid' }}>
              <MalvaVerticalLinkButton
                text='Lisää omiin'
                to='/plants/planting'
                style={{ display: 'inline-grid important!' }}
              />
              <MalvaVerticalLinkButton
                text='Toivelistalle'
                to='/plants/wishlist'
              />
              <MalvaVerticalLinkButton
                text='Lisätietoja'
                to={`/plants/details/${plant._id}`}
              />
            </Col>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default PlantListItem

PlantListItem.propTypes = {
  plant: PropTypes.shape({
    name: PropTypes.string.isRequired,
    scientificName: PropTypes.string.isRequired
  }),
  handleDelete: PropTypes.func.isRequired
}