import React from 'react'
import MalvaNavbar from './MalvaNavbar'
import MalvaSidebar from './MalvaSidebar'
import UIMessages from './UIMessages'

const MalvaLayout = (props) => {
  return (
    <div
      style={{ display: 'flex', height: 'fit-content', fontFamily: 'Open sans' }}
    >
      <MalvaSidebar />
      <div id='main'>
        <MalvaNavbar />
        <UIMessages />
        {props.children}
      </div>
    </div>
  )
}

export default MalvaLayout