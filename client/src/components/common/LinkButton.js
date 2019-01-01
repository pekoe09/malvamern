import React from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const LinkButton = ({ text, to, type }) => {
  return (
    <Link to={to}>
      <Button className={type ? type : 'primary'}>{text}</Button>
    </Link>
  )
}

export default LinkButton