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
    console.log('images len', this.props.images.length)
    console.log('searching for ', this.props.imageDetails._id)
    if (!image) {
      await this.props.getImage(id)
      image = this.props.images.find(i => i._id === id)
      console.log('images len (again) ', this.props.images.length)
      console.log(this.props.images[0])
      console.log('image', image)
    }
    this.setState({ image: image })
    console.log('current image: ', this.state.image)
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