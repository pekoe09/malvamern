const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const imageRouter = require('express').Router()
const multer = require('multer')
var upload = multer({ dest: 'uploads/' })
const Image = require('../models/image')
const { uploadImage, downloadImage } = require('./imageHandler')

imageRouter.get('/:id'), wrapAsync(async (req, res, next) => {
  const image = await Image.findById(req.params.id)
  if (!image) {
    let err = new Error('Image not found!')
    err.isBadRequest = true
    throw err
  }

  const imgStream = null
  try {
    imgStream = downloadImage(image.awsKey)
  } catch (error) {
    let err = new Error('Image unavailable!')
    err.isUnauthorizedAttempt = true
    throw err
  }

  imgStream.pipe(res)
})

imageRouter.get('/details/:id'), wrapAsync(async (req, res, next) => {

})

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

  console.log('saved image file', savedImage)

  let image = new Image({
    name: req.body.name,
    ordinality: req.body.ordinality,
    caption: '',
    awsKey: savedImage.Key,
    isThumbnail: false
  })
  image = await image.save()
  console.log('saved image record', image)

  res.status(201).json({ result: savedImage })
}))

module.exports = imageRouter