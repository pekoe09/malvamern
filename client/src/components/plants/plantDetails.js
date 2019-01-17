import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'
import { MalvaLinkButton, MalvaButton } from '../common/MalvaStyledComponents'
import {
  MalvaPlantHeader,
  MalvaPlantSubHeader,
  MalvaPlantSectionHeader
} from '../common/MalvaElements'
import { getPlant, deletePlant, getPlantCount } from '../../actions/plantActions'
import { addUIMessage } from '../../actions/uiMessageActions'

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
      await this.props.getPlant(id)
      plant = this.props.plantCache.find(p => p._id === id)
    }
    this.setState({ plant })
  }

  getColorString = () => {
    let colors = ''
    this.state.plant.flowerColors.map(c => colors = `${colors} ${c}`)
    return colors
  }

  handleEdit = () => {
    this.props.history.push(`/plants/edit/${this.state.plant._id}`)
  }

  handleDelete = async () => {
    await this.props.deletePlant(this.state.plant._id)
    if (!this.props.error) {
      this.props.addUIMessage(
        `Kasvi ${this.state.plant.name} poistettu!`,
        'success',
        10
      )
      await this.props.getPlantCount()
      this.props.history.push('/plants')
    } else {
      this.props.addUIMessage(
        `Kasvia ${this.state.plant.name} ei pystytty poistamaan!`,
        'danger',
        10
      )
    }
  }

  render() {
    if (this.state.plant) {
      const plant = this.state.plant
      return (
        <div style={{ marginTop: 20 }}>
          <MalvaPlantHeader text={plant.name} />
          <MalvaPlantSubHeader text={plant.scientificName} />

          <Row style={{ paddingLeft: 15, marginBottom: 10 }}>
            <MalvaLinkButton
              text='Takaisin'
              to='/plants'
              btnType='default'
            />
            <MalvaButton
              name='editbtn'
              btntype='primary'
              onClick={this.handleEdit}
            >
              Muuta
            </MalvaButton>
            <MalvaButton
              name='editbtn'
              btntype='danger'
              onClick={this.handleDelete}
            >
              Poista
            </MalvaButton>
          </Row>

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
  plantCache: store.plants.cache,
  error: store.plants.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    getPlant,
    deletePlant,
    getPlantCount,
    addUIMessage
  }
)(PlantDetails))