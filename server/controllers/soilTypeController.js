const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const soilTypeRouter = require('express').Router()
const Country = require('../models/country')
const SoilType = require('../models/soilType')

soilTypeRouter.get('/', wrapAsync(async (req, res, next) => {
  let soilTypes = []
  if (req.body.country) {
    soilTypes = await SoilType
      .find({ 'country.name': req.body.country })
      .sort('name')
  } else {
    soilTypes = await SoilType
      .find({})
      .sort('name')
  }
  res.json(soilTypes)
}))

soilTypeRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['name', 'countryId'], 'soil type', 'create')

  let country = await Country.findById(req.body.countryId)
  if (!country) {
    let err = new Error('Country does not exist')
    err.isBadRequest = true
    throw err
  }
  let match = await SoilType.findOne({ name: req.body.name, 'country.name': country.name })
  if (match) {
    let err = new Error('Soil type with the same name for the given contry exists already')
    err.isBadRequest = true
    throw err
  }

  let soilType = new SoilType({
    name: req.body.name,
    country: {
      name: country.name,
      abbreviation: country.abbreviation
    }
  })
  soilType = await soilType.save()
  res.status(201).json(soilType)
}))

soilTypeRouter.put('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  console.log('Received', req.body)
  validateMandatoryFields(req, ['name', 'countryId'], 'soil type', 'update')

  let soilType = await SoilType.findById(req.params.id)
  if (!soilType) {
    let err = new Error('Soil type to be updated does not exist')
    err.isBadRequest = true
    throw err
  }
  let country = await Country.findById(req.body.countryId)
  console.log('Country', country)
  if (!country) {
    let err = new Error('Country does not exist')
    err.isBadRequest = true
    throw err
  }
  let match = await SoilType.findOne({ name: req.body.name, 'country.name': country.name })
  console.log('Match', match)
  if (match && match._id.equals(soilType._id)) {
    let err = new Error('Another soil type for the same country with the same name exists already')
    err.isBadRequest = true
    throw err
  }

  console.log('Soil type before', soilType)
  soilType.name = req.body.name
  soilType.country = {
    name: country.name,
    abbreviation: country.abbreviation
  }
  console.log('Soil type after', soilType)
  soilType = await SoilType.findByIdAndUpdate(soilType._id, soilType, { new: true })
  console.log('Returning', soilType)
  res.status(201).json(soilType)
}))

soilTypeRouter.delete('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)

  let soilType = await SoilType.findById(req.params.id)
  if (!soilType) {
    let err = new Error('Soil type to be removed does not exist')
    err.isBadRequest = true
    throw err
  }

  await SoilType.findByIdAndRemove(soilType._id)
  res.status(204).end()
}))

module.exports = soilTypeRouter