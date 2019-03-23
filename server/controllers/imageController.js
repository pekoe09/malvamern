const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const imageRouter = require('express').Router()
const { uploadImage } = require('./imageHandler')

imageRouter.post('/upload', wrapAsync(async (req, res, next) => {
  checkUser(req)

  const files = req.files
  const path = files.file[0].path
  const savedImage = await uploadImage(path)

  res.status(201).json({ result: savedImage })
}))

module.exports = imageRouter