const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Plant = require('../models/plant')

const initialPlants = [
  {
    name: 'plant1',
    scientificName: 'plant Scientific 1',
    heightMin: 10,
    heightMax: 100,
    widthMin: 15,
    widthMax: 150,
    plantDistance: 12,
    plantDepth: 13,
    soilTypes: [],
    plantingFrom: { number: 1 },
    plantingTo: { number: 3 },
    floweringFrom: { number: 2 },
    floweringTo: { number: 4 },
    harvestFrom: { number: 3 },
    harvestTo: { number: 5 },
    flowerColors: ['color1', 'color2'],
    isPoisonous: false,
    hasSpikes: true,
    description: 'Description 1',
    shortDescription: 'Short description 1',
    environmentRequirements: 'Env reqs 1',
    careInstructions: 'Care inst 1'
  },
  {
    name: 'plant2',
    scientificName: 'plant Scientific 2',
    heightMin: 20,
    widthMin: 25,
    plantDistance: 22,
    plantDepth: 23,
    soilTypes: [],
    plantingFrom: { number: 2 },
    floweringFrom: { number: 4 },
    harvestFrom: { number: 6 },
    description: 'Description 2',
    shortDescription: 'Short description 2',
    environmentRequirements: 'Env reqs 2',
    careInstructions: 'Care inst 2'
  },
  {
    name: 'plant3',
    scientificName: 'plant Scientific 3',
    heightMin: 30,
    heightMax: 300,
    widthMin: 35,
    widthMax: 350,
    plantDistance: 32,
    plantDepth: 33,
    soilTypes: [],
    plantingFrom: { number: 3 },
    floweringFrom: { number: 4 },
    harvestFrom: { number: 5 },
    flowerColors: ['color3', 'color4'],
    isPoisonous: true,
    hasSpikes: false,
    description: 'Description 3',
    shortDescription: 'Short description 3',
    environmentRequirements: 'Env reqs 3',
    careInstructions: 'Care inst 3'
  },
]

const plantsInDb = async () => {
  return await Plant
    .find({})
}

const nonExistingPlantId = async () => {
  let plant = new Plant({
    name: 'testplant',
    scientificName: 'testplant',
    heightMin: 20,
    widthMin: 25,
    plantDistance: 22,
    plantDepth: 23,
    soilTypes: [],
    plantingFrom: { number: 2 },
    floweringFrom: { number: 4 },
    harvestFrom: { number: 6 },
    description: 'Description 2',
    shortDescription: 'Short description 2',
    environmentRequirements: 'Env reqs 2',
    careInstructions: 'Care inst 2'
  })
  plant = await plant.save()
  const id = plant._id
  await Plant.findByIdAndDelete(id)
  return id
}

const resetPlants = async () => {
  await Plant.remove({})
  const plantObjects = initialPlants.map(p => new Plant(p))
  const promiseArray = plantObjects.map(o => o.save())
  await Promise.all(promiseArray)
}

module.exports = {
  initialPlants,
  plantsInDb,
  nonExistingPlantId,
  resetPlants
}