import React from 'react'
import ViewHeader from '../common/ViewHeader'
import DiaryNavBar from './DiaryNavBar'
import DiarySideBar from './DiarySideBar'
import DatePage from './DatePage'
import { Col, Row } from 'react-bootstrap'

const mainColStyle = {
  padding: 0
}

const dates = [
  '2018-12-06',
  '2018-12-31',
  '2019-03-01',
  '2019-03-10',
  '2019-03-05',
  '2019-06-30'
]

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

  render() {
    return (
      <div>
        <ViewHeader text='Päiväkirja' />
        <DiaryNavBar />
        <Row>
          <Col sm={10} style={mainColStyle}>
            <DatePage
              entries={[]}
              date={Date.now()}
            />
          </Col>
          <Col sm={2} style={mainColStyle}>
            <DiarySideBar
              dates={dates}
              handleDateClick={this.handleDateClick}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

export default Diary