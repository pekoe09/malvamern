import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ViewHeader from '../common/ViewHeader'
import EmptyListNote from '../common/EmptyListNote'
import { MalvaLinkButton } from '../common/MalvaStyledComponents'
import PlantListItem from './plantListItem'
import MalvaPagination from '../common/MalvaPagination'
import { getAllPlants, getPlantCount, getPlantsByPage, deletePlant } from '../../actions/plantActions'
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
    await this.props.getPlantsByPage(1, 2, null)
    await this.props.getPlantCount()
  }

  mapPlantsToItems = () => {
    return this.props.plants.map(p =>
      <PlantListItem
        plant={p}
        key={p._id}
        handleDelete={() => this.handleDelete(p._id)}
      />
    )
  }

  handleDelete = (_id) => {
    console.log('Deleting ', _id)
  }

  handlePageChange = async (page) => {
    console.log('changing to page ', page)
    await this.props.getPlantsByPage(page, 2, null)
  }

  render() {
    return (
      <div>
        <div style={{ marginBottom: 10 }}>
          <ViewHeader text='Kasvilista' />
          <MalvaLinkButton
            text='Lisää kasvi'
            to='/plants/add'
            btnType='primary'
          />
        </div>
        {this.props.plants.length === 0 &&
          <EmptyListNote text='Kasveja ei löydy' />
        }
        {this.props.plants.length > 0 &&
          <h4>{`Löytyi ${this.props.count} kasvia`}</h4>
        }
        {this.mapPlantsToItems()}
        <MalvaPagination
          totalRecords={this.props.count}
          pageLimit={2}
          pageNeighbours={2}
          onPageChange={this.handlePageChange}
        />
      </div>
    )
  }
}

const mapStateToProps = store => ({
  plants: store.plants.items,
  count: store.plants.count
})

export default withRouter(connect(
  mapStateToProps,
  {
    getPlantCount,
    getAllPlants,
    getPlantsByPage,
    deletePlant,
    addUIMessage
  }
)(PlantList))