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
  const savedImage = await uploadImage(path)

  res.status(201).json({ result: savedImage })
}))

module.exports = imageRouter