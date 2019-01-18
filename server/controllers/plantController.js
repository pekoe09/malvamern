const {
  wrapAsync,
  checkUser,
  validateMandatoryFields,
  validateNonNegativeFields,
  validateMonthNumbers
} = require('./controllerHelpers')
const plantRouter = require('express').Router()
const Plant = require('../models/plant')
const Country = require('../models/country')
const SoilType = require('../models/soilType')

plantRouter.get('/', wrapAsync(async (req, res, next) => {
  let plants = []
  if (req.query.page) {
    const page = !isNaN(Number.parseInt(req.query.page)) ? Number.parseInt(req.query.page) : 1
    const limit = req.query.limit && !isNaN(Number.parseInt(req.query.limit)) ? Number.parseInt(req.query.limit) : 50
    console.log('Getting plants: ' + page + ' / ' + limit)
    plants = await Plant
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort('name')
  } else {
    plants = await Plant
      .find({})
      .sort('name')
  }
  res.json(plants)
}))

plantRouter.get('/count', wrapAsync(async (req, res, next) => {
  const count = await Plant.countDocuments({})
  res.json(count)
}))

plantRouter.get('/details/:id', wrapAsync(async (req, res, next) => {
  const plant = await Plant.findById(req.params.id)
  res.json(plant)
}))

plantRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)
  const mandatories = ['name', 'scientificName', 'heightMin', 'widthMin',
    'description', 'shortDescription']
  validateMandatoryFields(req, mandatories, 'plant', 'create')
  const nonNegatives = ['heightMin', 'heightMax', 'widthMin', 'widthMax', 'plantDistance', 'plantDepth']
  validateNonNegativeFields(req, nonNegatives, 'plant', 'create')
  const monthData = ['plantingFrom', 'plantingTo', 'floweringFrom', 'floweringTo',
    'harvestFrom', 'harvestTo']
  validateMonthNumbers(req, monthData, 'plant', 'create')

  let match = await Plant.findOne({ name: req.body.name })
  if (match) {
    let err = new Error('Plant with the same name exists already')
    err.isBadRequest = true
    throw err
  }

  let plant = new Plant({
    name: req.body.name,
    scientificName: req.body.scientificName,
    heightMin: req.body.heightMin,
    heightMax: req.body.heightMax,
    widthMin: req.body.widthMin,
    widthMax: req.body.widthMax,
    plantDistance: req.body.plantDistance,
    plantDepth: req.body.plantDepth,
    soilTypes: req.body.soilTypes,
    plantingFrom: req.body.plantingFrom ? { number: req.body.plantingFrom } : null,
    plantingTo: req.body.plantingTo ? { number: req.body.plantingTo } : null,
    floweringFrom: req.body.floweringFrom ? { number: req.body.floweringFrom } : null,
    floweringTo: req.body.floweringTo ? { number: req.body.floweringTo } : null,
    harvestFrom: req.body.harvestFrom ? { number: req.body.harvestFrom } : null,
    harvestTo: req.body.harvestTo ? { number: req.body.harvestTo } : null,
    flowerColors: req.body.flowerColors,
    isPoisonous: req.body.isPoisonous,
    hasSpikes: req.body.hasSpikes,
    description: req.body.description,
    shortDescription: req.body.shortDescription,
    environmentRequirements: req.body.environmentRequirements,
    careInstructions: req.body.careInstructions
  })
  console.log('saving', plant)
  plant = await plant.save()
  res.status(201).json(plant)
}))

plantRouter.put('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  const mandatories = ['name', 'scientificName', 'heightMin', 'widthMin',
    'description', 'shortDescription']
  validateMandatoryFields(req, mandatories, 'plant', 'create')
  const nonNegatives = ['heightMin', 'heightMax', 'widthMin', 'widthMax', 'plantDistance', 'plantDepth']
  validateNonNegativeFields(req, nonNegatives, 'plant', 'create')
  const monthData = ['plantingFrom', 'plantingTo', 'floweringFrom', 'floweringTo',
    'harvestFrom', 'harvestTo']
  validateMonthNumbers(req, monthData, 'plant', 'create')

  let plant = await Plant.findById(req.params.id)
  if (!plant) {
    let err = new Error('Plant to be updated does not exist')
    err.isBadRequest = true
    throw err
  }

  let match = await Plant.findOne({ name: req.body.name })
  if (match && !match._id.equals(plant._id)) {
    let err = new Error('Another plant with the same name exists already')
    err.isBadRequest = true
    throw err
  }

  plant.name = req.body.name
  plant.scientificName = req.body.scientificName
  plant.heightMin = req.body.heightMin
  plant.heightMax = req.body.heightMax
  plant.widthMin = req.body.widthMin
  plant.widthMax = req.body.widthMax
  plant.plantDistance = req.body.plantDistance
  plant.plantDepth = req.body.plantDepth
  plant.soilTypes = req.body.soilTypes
  plant.plantingFrom = req.body.plantingFrom ? { number: req.body.plantingFrom } : null
  plant.plantingTo = req.body.plantingTo ? { number: req.body.plantingTo } : null
  plant.floweringFrom = req.body.floweringFrom ? { number: req.body.floweringFrom } : null
  plant.floweringTo = req.body.floweringTo ? { number: req.body.floweringTo } : null
  plant.harvestFrom = req.body.harvestFrom ? { number: req.body.harvestFrom } : null
  plant.harvestTo = req.body.harvestTo ? { number: req.body.harvestTo } : null
  plant.flowerColors = req.body.flowerColors
  plant.isPoisonous = req.body.isPoisonous
  plant.hasSpikes = req.body.hasSpikes
  plant.description = req.body.description
  plant.shortDescription = req.body.shortDescription
  plant.environmentRequirements = req.body.environmentRequirements
  plant.careInstructions = req.body.careInstructions

  plant = await Plant.findByIdAndUpdate(plant._id, plant, { new: true })
  res.status(201).json(plant)
}))

plantRouter.delete('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)

  let plant = await Plant.findById(req.params.id)
  if (!plant) {
    let err = new Error('Plant to be removed does not exist')
    err.isBadRequest = true
    throw err
  }

  await Plant.findByIdAndRemove(plant._id)
  res.status(204).end()
}))

module.exports = plantRouter