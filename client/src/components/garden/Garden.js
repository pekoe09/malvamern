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
      openLocationCreationModal: false,
      modalError: ''
    }
  }

  mapLocationTabs = () => {
    return this.props.locations.map(l =>
      <NavItem
        key={l._id}
        eventKey={l.name}
      >
        {l.name}
      </NavItem>
    )
  }

  mapLocationPanes = () => {
    return this.props.locations.map(l =>
      <Tab.Pane
        key={l._id}
        eventKey={l.name}
      >
        <h3>l.name</h3>
      </Tab.Pane>
    )
  }

  toggleLocationCreationOpen = () => {
    this.setState({
      openLocationCreationModal: !this.state.openLocationCreationModal,
      modalError: ''
    })
  }

  handleSaveLocation = async (location) => {
    console.log('saving', location)
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
          <Tab.Container>
            <Row>
              <Nav bsStyle='pills'>
                {this.mapLocationTabs()}
              </Nav>
            </Row>
            <Tab.Content>
              {this.mapLocationPanes()}
            </Tab.Content>
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
