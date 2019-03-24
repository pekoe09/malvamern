const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const imageRouter = require('express').Router()
const multer = require('multer')
var upload = multer({ dest: 'uploads/' })
const { uploadImage } = require('./imageHandler')

imageRouter.post('/upload', upload.single('file'), wrapAsync(async (req, res, next) => {
  checkUser(req)

  console.log(req.body)
  console.log(req.file)
  const path = req.file.path
  console.log(path)
  console.log(uploadImage)
  let savedImage = null
  try {
    savedImage = await uploadImage(path)
  } catch (error) {
    console.log(error)
    let err = new Error('Could not save the image in storage!')
    err.isUnauthorizedAttempt = true
    throw err
  }
  res.status(201).json({ result: savedImage })
}))

module.exports = imageRouter