const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const SoilType = require('../models/soilType')

const initialSoilTypes = [
  {
    name: 'soiltype1',
    country: {
      name: 'country1',
      abbreviation: 'c1'
    }
  },
  {
    name: 'soiltype2',
    country: {
      name: 'country1',
      abbreviation: 'c1'
    }
  },
  {
    name: 'soiltype3',
    country: {
      name: 'country1',
      abbreviation: 'c1'
    }
  }
]

const soilTypesInDb = async () => {
  return await SoilType
    .find({})
}

const nonExistingSoilTypeId = async () => {
  let soilType = new SoilType({
    name: 'soiltypen',
    country: {
      name: 'country2',
      abbreviation: 'c2'
    }
  })
  soilType = await soilType.save()
  const id = soilType._id
  await SoilType.findByIdAndRemove(id)
  return id
}

const resetSoilTypes = async () => {
  await SoilType.remove({})
  const soilTypeObjects = initialSoilTypes.map(s => new SoilType(s))
  const promiseArray = soilTypeObjects.map(o => o.save())
  await Promise.all(promiseArray)
}

module.exports = {
  initialSoilTypes,
  soilTypesInDb,
  nonExistingSoilTypeId,
  resetSoilTypes
}