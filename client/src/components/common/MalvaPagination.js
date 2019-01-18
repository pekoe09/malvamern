import React from 'react'
import PropTypes from 'prop-types'
import { Pagination } from 'react-bootstrap'
import _ from 'lodash'

class MalvaPagination extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
    }
    this.totalPages = Math.ceil(this.props.totalRecords / this.props.pageLimit)
  }

  getPageNumbers = () => {
    if (this.totalPages > (this.props.pageNeighbours * 2) + 3) {
      const startPage = Math.max(2, this.state.currentPage - this.props.pageNeighbours)
      const endPage = Math.min(this.totalPages - 1, this.state.currentPage + this.props.pageNeighbours)
      let pages = _.range(startPage, endPage + 1)
      if (startPage > 2) {
        pages = ['LEFT_ARROW', ...pages]
      }
      if (endPage < this.totalPages - 1) {
        pages = [...pages, 'RIGHT_ARROW']
      }
      return [1, ...pages, this.totalPages]
    } else {
      return _.range(1, this.totalPages + 1)
    }
  }

  handleClick = (page) => async (event) => {
    event.preventDefault()
    this.setState({ currentPage: page })
    await this.props.onPageChange(page)
  }

  handleMoveLeft = async (event) => {
    event.preventDefault()
    const currentPage = Math.max(1, this.state.currentPage - this.props.pageNeighbours - 1)
    this.setState({ currentPage })
    await this.props.onPageChange(currentPage)
  }

  handleMoveRight = async (event) => {
    event.preventDefault()
    const currentPage = Math.min(this.totalPages, this.state.currentPage + this.props.pageNeighbours + 1)
    this.setState({ currentPage })
    await this.props.onPageChange(currentPage)
  }

  mapPages = (pages, changePage, moveLeft, moveRight) => {
    return pages.map((page, index) => {
      switch (page) {
        case 'LEFT_ARROW':
          return (
            <Pagination.Ellipsis
              onClick={moveLeft}
              key={index}
            />
          )
        case 'RIGHT_ARROW':
          return (
            <Pagination.Ellipsis
              onClick={moveRight}
              key={index}
            />
          )
        default:
          return (
            <Pagination.Item
              onClick={changePage(page)}
              active={this.state.currentPage === page.toString()}
              key={index}
            >
              {page}
            </Pagination.Item>
          )
      }
    })
  }

  render() {
    if (this.totalPages === 1) {
      return null
    }

    const pages = this.getPageNumbers()
    return (
      <Pagination style={{ marginLeft: '40%' }}>
        {this.mapPages(pages, this.handleClick, this.handleMoveLeft, this.handleMoveRight)}
      </Pagination>
    )
  }
}

export default MalvaPagination

MalvaPagination.propTypes = {
  totalRecords: PropTypes.number.isRequired,
  pageLimit: PropTypes.number.isRequired,
  pageNeighbours: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
}