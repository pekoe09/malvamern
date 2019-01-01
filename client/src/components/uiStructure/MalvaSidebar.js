import React from 'react'
import styled from 'styled-components'
import MalvaSidebarNav from './MalvaSidebarNav'

const StyledSidebar = styled.div`
  height: 100vh;
  position: sticky;
  z-index: 1;
  top: 0;
  left: 0;
  overflow-x: 'hidden';
  transition: 0.5s;
  background: blue;
  color: white;
`

const MalvaSidebar = () => {
  return (
    <StyledSidebar>
      <MalvaSidebarNav
        text='Kasvit'
        linkTo='/plants'
      />
      <MalvaSidebarNav
        text='Kasvit'
        linkTo='/plants'
      />
      <MalvaSidebarNav
        text='Kasvit'
        linkTo='/plants'
      />
    </StyledSidebar>
  )
}

export default MalvaSidebar