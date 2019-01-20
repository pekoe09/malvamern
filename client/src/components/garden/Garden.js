import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Tab, Row, Col, Nav, NavItem } from 'react-bootstrap'
import { MalvaButton } from '../common/MalvaStyledComponents'
import ViewHeader from '../common/ViewHeader'
import EmptyListNote from '../common/EmptyListNote'
import LocationAdd from './locationAdd'
import { addLocation, updateLocation, deleteLocation } from '../../actions/locationActions'
import { addUIMessage } from '../../actions/uiMessageActions'

class Garden extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedTab: '',
      openLocationCreationModal: false,
      modalError: ''
    }
  }

  componentDidMount = () => {
    if (this.props.locations && this.props.locations.length > 0) {
      this.setState({ selectedTab: this.props.locations[0].name })
    }
  }

  mapLocationTabs = () => {
    return this.props.locations.map(l =>
      <NavItem
        style={{ lineHeight: '10px', marginRight: 5 }}
        key={l._id}
        eventKey={l.name}
        onClick={() => this.handleTabSelect(l.name)}
        className={this.state.selectedTab === l.name ? 'malva-selected' : ''}
      >
        {l.name}
      </NavItem>
    )
  }

  mapLocationPanes = () => {
    return this.props.locations.map(l =>
      <Tab.Pane
        style={{
          padding: 5,
          marginTop: 10,
          marginBottom: 10,
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: 'lightgrey',
          borderRadius: 4
        }}
        key={l._id}
        eventKey={l.name}
        className={this.state.selectedTab === l.name ? 'active' : ''}
      >
        <h3>{l.name}</h3>
        {
          !l.isActive &&
          <h4>(ei aktiivinen)</h4>
        }
        <div>
          <span>{this.getSoilTypeString(l)}</span>
        </div>
      </Tab.Pane>
    )
  }

  getSoilTypeString = (location) => {
    if (!location.soilTypes || location.soilTypes.length === 0) {
      return 'Maaperätyyppejä ei valittuna'
    } else {
      let soilTypeStr = ''
      soilTypeStr = location.soilTypes.map(s => `Maaperätyypit: ${soilTypeStr} ${s.name}`)
      return soilTypeStr
    }
  }

  toggleLocationCreationOpen = () => {
    this.setState({
      openLocationCreationModal: !this.state.openLocationCreationModal,
      modalError: ''
    })
  }

  handleTabSelect = (name) => {
    this.setState({ selectedTab: name })
  }

  handleSaveLocation = async (location) => {
    console.log('saving', location)
    await this.props.addLocation(location)
    if (!this.props.error) {
      this.setState({
        openLocationCreationModal: false
      })
      this.props.addUIMessage(
        `Istutuspaikka ${location.name} luotu!`,
        'success',
        10
      )
    } else {
      this.setState({
        modalError: `Istutuspaikan ${location.name} luonti epäonnistui!`
      })
    }
  }

  render() {
    return (
      <div>
        <ViewHeader
          text='Oma puutarha'
        />
        <MalvaButton
          btntype='primary'
          onClick={this.toggleLocationCreationOpen}
        >
          Lisää istutuspaikka
        </MalvaButton>
        {
          this.props.locations &&
          this.props.locations.length > 0 &&
          <Tab.Container id='locationTabs'>
            <div>
              <Row style={{ marginTop: 10, paddingLeft: 15 }}>
                <Nav bsStyle='pills'>
                  {this.mapLocationTabs()}
                </Nav>
              </Row>
              <Tab.Content animation={false}>
                {this.mapLocationPanes()}
              </Tab.Content>
            </div>
          </Tab.Container>
        }
        {
          (!this.props.locations ||
            this.props.locations.length === 0) &&
          <EmptyListNote text='Et ole vielä perustanut istutuspaikkoja' />
        }

        <LocationAdd
          modalIsOpen={this.state.openLocationCreationModal}
          closeModal={this.toggleLocationCreationOpen}
          handleSave={this.handleSaveLocation}
          modalError={this.state.modalError}
        />
      </div>
    )
  }
}

const mapStateToProps = store => ({
  locations: store.users.currentUser.locations,
  error: store.users.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    addLocation,
    updateLocation,
    deleteLocation,
    addUIMessage
  }
)(Garden))
