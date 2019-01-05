const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const countryRouter = require('express').Router()
const Country = require('../models/country')
const SoilType = require('../models/soilType')
const GrowthZone = require('../models/growthZone')

countryRouter.get('/', wrapAsync(async (req, res, next) => {
  const countries = await Country
    .find({})
    .sort('name')
  res.json(countries)
}))

countryRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['name', 'abbreviation'], 'country', 'create')

  let matchByName = await Country.findOne({ name: req.body.name })
  let matchByAbbreviation = await Country.findOne({ abbreviation: req.body.abbreviation })
  if (matchByName) {
    let err = new Error('Another country with the same name exists already')
    err.isBadRequest = true
    throw err
  }
  if (matchByAbbreviation) {
    let err = new Error('Another country with the same abbreviation exists already')
    err.isBadRequest = true
    throw err
  }

  let country = new Country({
    name: req.body.name,
    abbreviation: req.body.abbreviation
  })
  country = await country.save()
  res.status(201).json(country)
}))

countryRouter.put('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['name', 'abbreviation'], 'country', 'update')

  let country = await Country.findById(req.params.id)
  if (!country) {
    let err = new Error('Country to be updated does not exist')
    err.isBadRequest = true
    throw err
  }
  let matchByName = await Country.findOne({ name: req.body.name })
  let matchByAbbreviation = await Country.findOne({ abbreviation: req.body.abbreviation })
  if (matchByName && !matchByName._id.equals(country._id)) {
    let err = new Error('Another country with the same name exists already')
    err.isBadRequest = true
    throw err
  }
  if (matchByAbbreviation && !matchByAbbreviation._id.equals(country._id)) {
    let err = new Error('Another country with the same abbreviation exists already')
    err.isBadRequest = true
    throw err
  }

  country.name = req.body.name
  country.abbreviation = req.body.abbreviation
  country = await Country.findByIdAndUpdate(country._id, country, { new: true })
  res.status(201).json(country)
}))

countryRouter.delete('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)

  let country = await Country.findById(req.params.id)
  if (!country) {
    let err = new Error('Country to be removed does not exist')
    err.isBadRequest = true
    throw err
  }
  let foundSoilTypes = await SoilType.find({ 'country.name': country.name })
  let foundGrowthZones = await GrowthZone.find({ 'country.name': country.name })
  if (foundSoilTypes.length > 0 || foundGrowthZones.length > 0) {
    let err = new Error('Country has referring soil types and/or growth zones and cannot be removed')
    err.isBadRequest = true
    throw err
  }
  await Country.findByIdAndRemove(country._id)
  res.status(204).end()
}))

module.exports = countryRouter