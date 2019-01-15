import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ViewHeader from '../common/ViewHeader'
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
    console.log('Id: ' + id)
    let plant = this.props.plantCache.find(p => p._id === id)
    if (!plant) {
      plant = await this.props.getPlant(id)
    }
    this.setState({ plant })
  }

  render() {
    return (
      <div>{this.state.plant ? this.state.plant.name : ''}</div>
    )
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