import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getImage } from '../../actions/imageActions'

class ImageItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      image: ''
    }
  }

  componentDidMount = async () => {
    let id = this.props.imageDetails._id
    let image = this.props.images.find(i => i._id === id)
    if (!image) {
      await this.props.getImage(id)
      image = this.props.images.find(i => i._id === id)
    }
    this.setState({ image: image })
  }

  render() {
    return (
      <div>
        <img src={this.state.image.src} />
      </div>
    )
  }
}

const mapStateToProps = store => ({
  images: store.images.items
})

export default connect(
  mapStateToProps,
  {
    getImage
  }
)(ImageItem)

ImageItem.propTypes = {
  imageDetails: PropTypes.object
}