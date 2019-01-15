import React from 'react'
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import MalvaLayout from '../uiStructure/MalvaLayout'

import CountryList from '../countries/countryList'
import FrontPage from '../frontpage/FrontPage'
import PlantAdd from '../plants/plantAdd'
import PlantDetails from '../plants/plantDetails'
import PlantList from '../plants/plantList'
import Registration from '../users/Registration'
import SoilTypeList from '../soilTypes/soilTypeList'

class App extends React.Component {
  render() {
    return (
      <MalvaLayout>
        <Route exact path='/' render={() => <FrontPage />} />
        <Route exact path='/countries' render={() => <CountryList />} />
        <Route exact path='/plants' render={() => <PlantList />} />
        <Route exact path='/plants/add' render={() => <PlantAdd />} />
        <Route exact path='/plants/details/:id' render={(props) => <PlantDetails {...props} />} />
        <Route exact path='/register' render={() => <Registration />} />
        <Route exact path='/soiltypes' render={() => <SoilTypeList />} />
      </MalvaLayout>
    )
  }
}

export default withRouter(connect(
  null
)(App))