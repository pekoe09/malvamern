import React from 'react'
import { connect } from 'react-redux'
import ViewHeader from '../common/ViewHeader'
import DiaryNavBar from './DiaryNavBar'
import DiarySideBar from './DiarySideBar'
import DatePage from './DatePage'
import { Col, Row } from 'react-bootstrap'

const mainColStyle = {
  padding: 0
}

class Diary extends React.Component {
  constructor() {
    super()
    this.state = {
      date: new Date()
    }
  }

  handleDateClick = (date) => {
    this.setState({ date })
  }

  getDates = () => {
    return this.props.entries.map(e => e.date)
  }

  render() {
    return (
      <div>
        <ViewHeader text='Päiväkirja' />
        <DiaryNavBar />
        <Row>
          <Col sm={10} style={mainColStyle}>
            <DatePage
              entries={this.props.entries}
              date={this.state.date}
            />
          </Col>
          <Col sm={2} style={mainColStyle}>
            <DiarySideBar
              dates={this.getDates()}
              handleDateClick={this.handleDateClick}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = store => ({
  entries: store.entries.items
})

export default connect(
  mapStateToProps
)(Diary)