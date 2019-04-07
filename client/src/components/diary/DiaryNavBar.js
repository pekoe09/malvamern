import React from 'react'
import { Row } from 'react-bootstrap'
import { MalvaLinkButton } from '../common/MalvaStyledComponents'

const DiaryNavBar = () => {
  return (
    <div>
      <Row style={{ marginBottom: 5 }}>

        <MalvaLinkButton
          name='addEntry'
          btntype='primary'
          style={{ float: 'right' }}
          to='/diary/addentry'
          text='Lisää päiväkirjamerkintä'
        />

      </Row>

    </div>
  )
}

export default DiaryNavBar