import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getImage } from '../../actions/imageActions'

class ImageItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imageSrc: ''
    }
  }

  componentDidMount = async () => {
    let id = this.props.imageDetails._id
    let image = this.props.images.find(i => i._id === id)
    if (!image || !image.small) {
      await this.props.getImage(id, 'small')
      image = this.props.images.find(i => i._id === id)
    }
    this.setState({ imageSrc: (image && image.small) ? image.small : '' })
  }

  render() {
    return (
      <div>
        <img src={this.state.imageSrc} />
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