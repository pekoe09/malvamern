const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Country = require('../models/country')

const initialCountries = [
  {
    name: 'country1',
    abbreviation: 'c1'
  },
  {
    name: 'country2',
    abbreviation: 'c2'
  },
  {
    name: 'country3',
    abbreviation: 'c3'
  }
]

const countriesInDb = async () => {
  return await Country
    .find({})
}

const nonExistingCountryId = async () => {
  let country = new Country({
    name: 'countryn',
    abbreviation: 'cn'
  })
  country = await country.save()
  const id = country._id
  await Country.findByIdAndRemove(id)
  return id
}

const resetCountries = async () => {
  await Country.remove({})
  const countryObjects = initialCountries.map(c => new Country(c))
  const promiseArray = countryObjects.map(o => o.save())
  await Promise.all(promiseArray)
}

module.exports = {
  initialCountries,
  countriesInDb,
  nonExistingCountryId,
  resetCountries
} 