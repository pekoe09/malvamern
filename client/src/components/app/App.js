import React from 'react'
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import MalvaLayout from '../uiStructure/MalvaLayout'

import CountryList from '../countries/countryList'
import FrontPage from '../frontpage/FrontPage'
import PlantsList from '../plants/PlantsList'
import Registration from '../users/Registration'

class App extends React.Component {
  render() {
    return (
      <MalvaLayout>
        <Route exact path='/' render={() => <FrontPage />} />
        <Route exact path='/countries' render={() => <CountryList />} />
        <Route exact path='/plants' render={() => <PlantsList />} />
        <Route exact path='/register' render={() => <Registration />} />
        <p>Nothing to see here, disperse!</p>
      </MalvaLayout>
    )
  }
}

export default withRouter(connect(
  null
)(App))