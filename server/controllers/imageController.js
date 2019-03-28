const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const imageRouter = require('express').Router()
const multer = require('multer')
var upload = multer({ dest: 'uploads/' })
const Image = require('../models/image')
const Plant = require('../models/plant')
const { uploadImage, downloadImage } = require('./imageHandler')

imageRouter.get('/:id', wrapAsync(async (req, res, next) => {
  console.log('image file get hit')
  const image = await Image.findById(req.params.id)
  if (!image) {
    let err = new Error('Image not found!')
    err.isBadRequest = true
    throw err
  }
  console.log('found image record', image)
  let result = null
  try {
    result = await downloadImage(image.awsKey)
  } catch (error) {
    console.log(error)
    let err = new Error('Image unavailable!')
    err.isUnauthorizedAttempt = true
    throw err
  }
  console.log(result)
  res.json(result)
}))

imageRouter.get('/details/:id', wrapAsync(async (req, res, next) => {
  console.log('image details hit')
  const image = await Image.findById(req.params.id)
  if (!image) {
    let err = new Error('Image not found!')
    err.isBadRequest = true
    throw err
  }
  console.log(image)
  res.json(image)
}))

imageRouter.post('/upload', upload.single('file'), wrapAsync(async (req, res, next) => {
  checkUser(req)

  const path = req.file.path

  let savedImage = null
  try {
    savedImage = await uploadImage(path)
  } catch (error) {
    console.log(error)
    let err = new Error('Could not save the image in storage!')
    err.isUnauthorizedAttempt = true
    throw err
  }

  let image = new Image({
    name: req.body.name,
    ordinality: req.body.ordinality,
    caption: '',
    awsKey: savedImage.Key,
    plantId: req.body.plantId,
    isThumbnail: false
  })
  image = await image.save()
  console.log('saved image record', image)

  if (req.body.plantId) {
    const imageRef = {
      _id: image._id,
      isThumbnail: image.isThumbnail,
      awsKey: image.awsKey
    }
    let plant = await Plant.findById(req.body.plantId)
    plant = {
      ...plant,
      images: plant.images ? plant.images.concat(imageRef) : [imageRef]
    }
  }


  res.status(201).json(image)
}))

module.exports = imageRouter