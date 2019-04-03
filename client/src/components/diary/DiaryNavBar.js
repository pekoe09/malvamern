import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { MalvaButton } from '../common/MalvaStyledComponents'

const DiaryNavBar = () => {
  return (
    <div>
      <Row style={{ marginBottom: 5 }}>

        <MalvaButton
          name='addEntry'
          btntype='primary'

          style={{ float: 'right' }}
        >
          Lisää päiväkirjamerkintä
        </MalvaButton>

      </Row>

    </div>
  )
}

export default DiaryNavBar