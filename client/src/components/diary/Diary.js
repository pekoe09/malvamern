import React from 'react'
import ViewHeader from '../common/ViewHeader'
import DiaryNavBar from './DiaryNavBar'
import DiarySideBar from './DiarySideBar'
import DatePage from './DatePage'
import { Col, Row } from 'react-bootstrap'

const mainColStyle = {
  padding: 0
}

const Diary = () => {
  return (
    <div>
      <ViewHeader text='Päiväkirja' />
      <DiaryNavBar />
      <Row>
        <Col sm={10} style={mainColStyle}>
          <DatePage />
        </Col>
        <Col sm={2} style={mainColStyle}>
          <DiarySideBar />
        </Col>
      </Row>
    </div>
  )
}

export default Diary