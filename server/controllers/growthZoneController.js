const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const growthZoneRouter = require('express').Router()
const Country = require('../models/country')
const GrowthZone = require('../models/growthZone')

growthZoneRouter.get('/', wrapAsync(async (req, res, next) => {
  let growthZones = []
  if (req.body.country) {
    growthZones = await GrowthZone
      .find({ 'country.name': req.body.country })
      .sort('ordinality')
  } else {
    growthZones = await GrowthZone
      .find({})
      .sort('ordinality')
  }
  res.json(growthZones)
}))

growthZoneRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['name', 'countryId', 'ordinality'])

  let country = await Country.findById(req.body.countryId)
  if (!country) {
    let err = new Error('Country does not exist')
    err.isBadRequest = true
    throw err
  }
  let match = await GrowthZone.findOne({ name: req.body.name, 'country.name': country.name })
  if (match) {
    let err = new Error('Growth zone with the same name for the given contry exists already')
    err.isBadRequest = true
    throw err
  }

  let growthZone = new GrowthZone({
    name: req.body.name,
    country: {
      name: country.name,
      abbreviation: country.abbreviation
    },
    ordinality: req.body.ordinality
  })
  growthZone = await growthZone.save()
  res.status(201).json(growthZone)
}))

growthZoneRouter.put('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['name', 'countryId', 'ordinality'])

  let growthZone = await GrowthZone.findById(req.params.id)
  if (!growthZone) {
    let err = new Error('Growth zone to be updated does not exist')
    err.isBadRequest = true
    throw err
  }
  let country = await Country.findById(req.body.countryId)
  if (!country) {
    let err = new Error('Country does not exist')
    err.isBadRequest = true
    throw err
  }
  let match = await GrowthZone.findOne({ name: req.body.name, 'country.name': country.name })
  if (match && match_id !== soilType._id) {
    let err = new Error('Another growth zone for the same country with the same name exists already')
    err.isBadRequest = true
    throw err
  }

  growthZone.name = req.body.name
  growthZone.country = {
    name: country.name,
    abbreviation: country.abbreviation
  }
  growthZone.ordinality = req.body.ordinality
  growthZone = await GrowthZone.findByIdAndUpdate(growthZone._id, growthZone)
  res.status(201).json(growthZone)
}))

growthZoneRouter.delete('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)

  let growthZone = await GrowthZone.findById(req.params.id)
  if (!growthZone) {
    let err = new Error('Growth zone to be removed does not exist')
    err.isBadRequest = true
    throw err
  }

  await GrowthZone.findByIdAndRemove(growthZone._id)
  res.status(204).end()
}))

module.exports = growthZoneRouter