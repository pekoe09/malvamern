import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

class PlantsList extends React.Component {

  render() {
    return (
      <div>Kasvilista tähän</div>
    )
  }
}

export default withRouter(connect(
  null
)(PlantsList))