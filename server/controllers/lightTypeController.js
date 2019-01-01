const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const lightTypeRouter = require('express').Router()
const LightType = require('../models/lightType')

lightTypeRouter.get('/', wrapAsync(async (req, res, next) => {
  const lightTypes = await LightType
    .find({})
    .sort('name')
  res.json(lightTypes)
}))

lightTypeRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['name'])

  let match = await LightType.find({ name: req.body.name })
  if (match) {
    let err = new Error('Light type with the same name exists already')
    err.isBadRequest = true
    throw err
  }

  let lightType = new LightType({
    name: req.body.name
  })
  lightType = await lightType.save()
  res.status(201).json(lightType)
}))

lightTypeRouter.put('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['name'])

  let lightType = await LightType.findById(req.params.id)
  if (!lightType) {
    let err = new Error('Light type to be updated does not exist')
    err.isBadRequest = true
    throw err
  }
  let match = await LightType.find({ name: req.body.name })
  if (match && match._id !== lightType._id) {
    let err = new Error('Light type with the same name exists already')
    err.isBadRequest = true
    throw err
  }

  lightType.name = req.body.name
  lightType = await LightType.findByIdAndUpdate(lightType._id, lightType)
  res.status(201).json(lightType)
}))

lightTypeRouter.delete('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)

  let lightType = await LightType.findById(req.params.id)
  if (!lightType) {
    let err = new Error('Light type to be removed does not exist')
    err.isBadRequest = true
    throw err
  }

  await LightType.findByIdAndRemove(lightType._id)
  res.status(204).end()
}))

module.exports = lightTypeRouter