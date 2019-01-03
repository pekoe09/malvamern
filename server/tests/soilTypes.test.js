const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const { expect } = require('chai')
const { initialSoilTypes, resetSoilTypes, soilTypesInDb, nonExistingId } = require('./soilTypes.testHelper')
const { initialUsers, resetUsers, getToken, getBogusToken, getOldUsersToken } = require('./users.testHelper')
const { countriesInDb, resetCountries } = require('./countries.testHelper')

describe('GET /api/soiltypes', async () => {

  it('works', async () => {
    await api
      .get('/api/soiltypes')
      .expect(200)
  })

  it('returns soil types in json format', async () => {
    await api
      .get('/api/soiltypes')
      .expect('Content-Type', /application\/json/)
  })
})

describe('POST /api/soiltypes', async () => {

  let token = null

  beforeEach('Get user token', async () => {
    await resetUsers()
    await resetCountries()
    token = await getToken(initialUsers[0].username)
    await resetSoilTypes()
  })

  it('creates a new soil type', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const countries = await countriesInDb()
    const country = countries[0]
    const soilType = {
      name: 'newsoiltype',
      countryId: country._id
    }
    const response = await api
      .post('/api/soiltypes')
      .set('Authorization', 'Bearer ' + token)
      .send(soilType)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const soilTypesAfter = await soilTypesInDb()
    const newSoilType = response.body
    const newSoilTypeInDb = soilTypesAfter.find(s => s.name === soilType.name)
    expect(soilTypesAfter.length).to.equal(soilTypesBefore.length + 1)
    expect(newSoilType.name).to.equal(soilType.name)
    expect(newSoilType.country.name).to.equal(country.name)
    expect(newSoilType.country.abbreviation).to.equal(country.abbreviation)
    expect(newSoilTypeInDb.name).to.equal(soilType.name)
    expect(newSoilTypeInDb.country.name).to.equal(country.name)
    expect(newSoilTypeInDb.country.abbreviation).to.equal(country.abbreviation)
  })
})

after('Close server', async () => {
  await server.close()
})