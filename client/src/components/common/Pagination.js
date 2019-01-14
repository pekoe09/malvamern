import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

class Pagination extends React.Component {

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
    await this.props.onPageChange(this.state.currentPage)
  }

  handleMoveLeft = async (event) => {
    event.preventDefault()
    this.setState({
      currentPage: Math.max(1, this.state.currentPage - this.props.pageNeighbours - 1)
    })
    await this.props.onPageChange(this.state.currentPage)
  }

  handleMoveRight = async (event) => {
    event.preventDefault()
    this.setState({
      currentPage: Math.min(this.totalPages, this.state.currentPage + this.props.pageNeighbours + 1)
    })
    await this.props.onPageChange(this.state.currentPage)
  }

  render() {
    if (this.totalPages === 1) {
      return null
    }

    const pages = this.getPageNumbers()
    return (
      <nav>
        <ul>
          {pages.map((page, index) => {
            if (page === 'LEFT_ARROW') {
              return (
                <li
                  key={index}
                >
                  <a href='#' onClick={this.handleMoveLeft}>
                    <span>&laquo</span>
                  </a>
                </li>
              )
            }
            if (page === 'RIGHT_ARROW') {
              return (
                <li
                  key={index}
                >
                  <a href='#' onClick={this.handleMoveRight}>
                    <span>&raquo</span>
                  </a>
                </li>
              )
            }
            return (
              <li
                key={index}
                className={this.state.currentPage === page ? 'active-page' : ''}
              >
                <a href='#' onClick={this.handleClick(page)}>
                  {page}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }
}

export default Pagination

Pagination.propTypes = {
  totalRecords: PropTypes.number.isRequired,
  pageLimit: PropTypes.number.isRequired,
  pageNeighbours: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
}