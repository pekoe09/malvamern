import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ViewHeader from '../common/ViewHeader'
import EmptyListNote from '../common/EmptyListNote'
import { MalvaLinkButton } from '../common/MalvaStyledComponents'
import PlantListItem from './plantListItem'
import { getAllPlants, deletePlant } from '../../actions/plantActions'
import { addUIMessage } from '../../actions/uiMessageActions'

class PlantList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      rowToDelete: '',
      deletionTargetId: '',
      deletionTargetName: ''
    }
  }

  componentDidMount = async () => {
    await this.props.getAllPlants()
  }

  mapPlantsToItems = () => {
    return this.props.plants.map(p =>
      <PlantListItem
        plant={p}
      />)
  }

  render() {
    return (
      <div>
        <ViewHeader text='Kasvilista' />
        <MalvaLinkButton
          text='Lisää kasvi'
          to='/plants/add'
          btnType='primary'
        />
        {this.props.plants.length === 0 &&
          <EmptyListNote text='Kasveja ei löydy' />
        }
        {this.mapPlantsToItems()}
      </div>
    )
  }
}

const mapStateToProps = store => ({
  plants: store.plants.items
})

export default withRouter(connect(
  mapStateToProps,
  {
    getAllPlants,
    deletePlant,
    addUIMessage
  }
)(PlantList))