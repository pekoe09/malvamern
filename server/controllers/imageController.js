const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const imageRouter = require('express').Router()
const multer = require('multer')
var upload = multer({ dest: 'uploads/' })
const Image = require('../models/image')
const Plant = require('../models/plant')
const { uploadImage, downloadImage, deleteImage } = require('./imageHandler')

imageRouter.get('/:id', wrapAsync(async (req, res, next) => {
  const image = await Image.findById(req.params.id)
  if (!image) {
    let err = new Error('Image not found!')
    err.isBadRequest = true
    throw err
  }
  const requestedSize = req.query.size
  let awsKeyName = 'awsKey'
  if (requestedSize === 'large') {
    awsKeyName = 'awsKeyLarge'
  } else if (requestedSize === 'small') {
    awsKeyName = 'awsKeySmall'
  }
  let result = null
  try {
    result = await downloadImage(image[awsKeyName])
  } catch (error) {
    console.log(error)
    let err = new Error('Image unavailable!')
    err.isUnauthorizedAttempt = true
    throw err
  }
  res.json(result)
}))

imageRouter.delete('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  const image = await Image.findById(req.params.id)
  if (!image) {
    let err = new Error('Image not found!')
    err.isBadRequest = true
    throw err
  }

  try {
    await deleteImage([image.awsKey, image.awsKeyLarge, image.awsKeySmall])
  } catch (error) {
    console.log(error)
    let err = new Error('Image deletion failed!')
    err.isUnauthorizedAttempt = true
    throw err
  }

  if (image.plantId) {
    let plant = await Plant.findById(image.plantId)
    console.log('found plant', plant)
    if (plant) {
      plant.images = plant.images.filter(i => !i._id.equals(image._id))
      plant = await Plant.findByIdAndUpdate(plant._id, plant, { new: true })
    }
  }

  await Image.findByIdAndRemove(image._id)
  res.status(201).json(image)
}))

imageRouter.get('/details/:id', wrapAsync(async (req, res, next) => {
  const image = await Image.findById(req.params.id)
  if (!image) {
    let err = new Error('Image not found!')
    err.isBadRequest = true
    throw err
  }
  res.json(image)
}))

imageRouter.put('/details/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  let image = await Image.findById(req.params.id)
  if (!image) {
    let err = new Error('Image not found!')
    err.isBadRequest = true
    throw err
  }

  image.name = req.body.name
  image.ordinality = req.body.ordinality
  image = await Image.findByIdAndUpdate(image._id, image, { new: true })

  if (image.plantId) {
    let plant = await Plant.findById(image.plantId)
    plant.images = plant.images.map(i => {
      if (i._id.equals(image._id)) {
        return {
          _id: image.id,
          name: image.name,
          ordinality: image.ordinality,
          caption: i.caption,
          awsKey: i.awsKey,
          awsKeySmall: i.awsKeySmall,
          awsKeyLarge: i.awsKeyLarge
        }
      } else {
        return i
      }
    })
    plant = await Plant.findByIdAndUpdate(plant._id, plant, { new: true })
  }

  res.status(201).json(image)
}))

imageRouter.post('/upload', upload.single('file'), wrapAsync(async (req, res, next) => {
  checkUser(req)

  const path = req.file.path

  let savedImage = null
  try {
    savedImage = await uploadImage(path, req.body.name)
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
    awsKey: savedImage.original.result.Key,
    awsKeySmall: savedImage.small.result.Key,
    awsKeyLarge: savedImage.large.result.Key,
    plantId: req.body.plantId
  })
  image = await image.save()

  if (image.plantId) {
    const imageRef = {
      ...image._doc
    }
    delete imageRef.plantId
    delete imageRef.__v
    let plant = await Plant.findById(image.plantId)
    plant.images = plant.images ? plant.images.push(imageRef) : [imageRef]
    plant = await Plant.findByIdAndUpdate(image.plantId, plant)
  }

  res.status(201).json(image)
}))

module.exports = imageRouter