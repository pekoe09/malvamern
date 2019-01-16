import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'
import ViewHeader from '../common/ViewHeader'
import {
  MalvaPlantHeader,
  MalvaPlantSubHeader,
  MalvaPlantSectionHeader,
  MalvaPlantFieldHeader
} from '../common/MalvaElements'
import { getPlant } from '../../actions/plantActions'

class PlantDetails extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      plant: null
    }
  }

  componentDidMount = async () => {
    const id = this.props.match.params.id
    let plant = this.props.plantCache.find(p => p._id === id)
    if (!plant) {
      console.log('querying plant')
      plant = await this.props.getPlant(id)
      console.log('got plant', plant)
    }
    this.setState({ plant })
  }

  getColorString = () => {
    let colors = ''
    this.state.plant.flowerColors.map(c => colors = `${colors} ${c}`)
    console.log('Colors: ', colors)
    return colors
  }

  render() {
    if (this.state.plant) {
      const plant = this.state.plant
      return (
        <div style={{ marginTop: 20 }}>
          <div>
            <MalvaPlantHeader text={plant.name} />
            <MalvaPlantSubHeader text={plant.scientificName} />
          </div>
          <Row>
            <Col sm={2}>
              <span>Korkeus: {plant.height} cm</span>
            </Col>
            {
              plant.width &&
              <Col sm={2}>
                <span>Leveys: {plant.width} cm</span>
              </Col>
            }

          </Row>
          <Row>
            {
              plant.flowering &&
              <Col sm={2}>
                <span>Kukintoaika: {plant.flowering}</span>
              </Col>
            }
            {
              plant.flowerColors &&
              <Col sm={4}>
                <span>Kukinto: {this.getColorString()}</span>
              </Col>
            }
          </Row>
          <Row>
            {
              plant.isPoisonous &&
              <span>Myrkyllinen </span>
            }
            {
              plant.hasSpikes &&
              <span>Piikikäs </span>
            }
          </Row>
          <div
            style={{
              height: 400,
              width: '50%',
              background: 'lightgrey',
              marginTop: 10,
              marginBottom: 10
            }}
          >
            <p>Image group</p>
          </div>
          <MalvaPlantSectionHeader text='Kuvaus' />
          <p>{plant.description}</p>
          <MalvaPlantSectionHeader text='Kasvuympäristö' />
          <p>{plant.environmentRequirements}</p>
          <MalvaPlantSectionHeader text='Hoito' />
          <Row>
            {
              plant.planting &&
              <Col sm={2}>
                <span>Istutusaika: {plant.planting}</span>
              </Col>
            }
            {
              plant.plantDistance &&
              <Col sm={2}>
                <span>Istutusetäisyys: {plant.plantDistance} cm</span>
              </Col>
            }
            {
              plant.plantDepth &&
              <Col sm={2}>
                <span>Istutussyvyys: {plant.plantDepth} cm</span>
              </Col>
            }
          </Row>
          <Row style={{ marginBottom: 10 }}>
            {
              plant.harvest &&
              <Col sm={2}>
                <span>Satokausi: {plant.harvest}</span>
              </Col>
            }
          </Row>
          <p>{plant.careInstructions}</p>
        </div>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = store => ({
  plantCache: store.plants.cache
})

export default withRouter(connect(
  mapStateToProps,
  {
    getPlant
  }
)(PlantDetails))