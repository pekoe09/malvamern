import React from 'react'
import MalvaNavbar from './MalvaNavbar'
import UIMessages from './UIMessages'

const MalvaLayout = (props) => {
  return (
    <div
      style={{ display: 'flex', height: 'fit-content', fontFamily: 'Open sans', paddingTop: 50 }}
    >
      <div id='main'>
        <MalvaNavbar />
        <UIMessages />
        {props.children}
      </div>
    </div>
  )
}

export default MalvaLayout