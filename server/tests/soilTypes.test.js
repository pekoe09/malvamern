const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const { expect } = require('chai')
const { initialSoilTypes, resetSoilTypes, soilTypesInDb, nonExistingSoilTypeId } = require('./soilTypes.testHelper')
const { initialUsers, resetUsers, getToken, getBogusToken, getOldUsersToken } = require('./users.testHelper')
const { countriesInDb, nonExistingCountryId } = require('./countries.testHelper')

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
    token = await getToken(initialUsers[0].username)
    await resetSoilTypes()
  })

  afterEach('Reset soil types', async () => {
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

  it('returns error without token', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const countries = await countriesInDb()
    const country = countries[0]
    const soilType = {
      name: 'newsoiltype',
      countryId: country._id
    }

    const response = await api
      .post('/api/soiltypes')
      .send(soilType)
      .expect(401)

    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesBefore).to.deep.equal(soilTypesAfter)
  })

  it('returns error with bogus token', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const bogusToken = await getBogusToken()
    const countries = await countriesInDb()
    const country = countries[0]
    const soilType = {
      name: 'newsoiltype',
      countryId: country._id
    }

    const response = await api
      .post('/api/soiltypes')
      .set('Authorization', 'Bearer ' + bogusToken)
      .send(soilType)
      .expect(401)

    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesBefore).to.deep.equal(soilTypesAfter)
  })

  it('returns error with token of a removed user', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const oldToken = await getOldUsersToken()
    const countries = await countriesInDb()
    const country = countries[0]
    const soilType = {
      name: 'newsoiltype',
      countryId: country._id
    }

    const response = await api
      .post('/api/soiltypes')
      .set('Authorization', 'Bearer ' + oldToken)
      .send(soilType)
      .expect(401)

    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesBefore).to.deep.equal(soilTypesAfter)
  })

  it('does not accept soil type without a name', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const countries = await countriesInDb()
    const country = countries[0]
    const soilType = {
      countryId: country._id
    }

    const response = await api
      .post('/api/soiltypes')
      .send(soilType)
      .expect(401)

    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesBefore).to.deep.equal(soilTypesAfter)
  })

  it('does not accept soil type with white space string as a name', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const countries = await countriesInDb()
    const country = countries[0]
    const soilType = {
      name: ' ',
      countryId: country._id
    }

    const response = await api
      .post('/api/soiltypes')
      .send(soilType)
      .expect(401)

    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesBefore).to.deep.equal(soilTypesAfter)
  })

  it('does not accept soil type with name already in use', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const countries = await countriesInDb()
    const country = countries[0]
    const soilType = {
      name: soilTypesBefore[1].name,
      countryId: country._id
    }

    const response = await api
      .post('/api/soiltypes')
      .send(soilType)
      .expect(401)

    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesBefore).to.deep.equal(soilTypesAfter)
  })

  it('does not accept soil type without a country', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const soilType = {
      name: 'newsoiltype'
    }

    const response = await api
      .post('/api/soiltypes')
      .send(soilType)
      .expect(401)

    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesBefore).to.deep.equal(soilTypesAfter)
  })
})

describe('PUT /api/soiltypes/:id', async () => {
  let token = null

  beforeEach('Get user token', async () => {
    await resetUsers()
    token = await getToken(initialUsers[0].username)
    await resetSoilTypes()
  })

  it('updates the correct soil type', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const countries = await countriesInDb()
    const targetSoilType = soilTypesBefore.find(s => s.name === initialSoilTypes[1].name)
    const editedSoiltype = {
      _id: targetSoilType._id,
      name: 'newname',
      countryId: countries[0]._id
    }

    const response = await api
      .put('/api/soiltypes/' + targetSoilType._id)
      .set('Authorization', 'Bearer ' + token)
      .send(editedSoiltype)
      .expect(201)

    const updatedSoilType = response.body
    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesAfter.length).to.equal(soilTypesBefore.length)
    expect(updatedSoilType.name).to.equal(editedSoiltype.name)
    expect(updatedSoilType.country.name).to.equal(countries[0].name)
    expect(updatedSoilType.country.abbreviation).to.equal(countries[0].abbreviation)
  })

  it('returns error without token', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const targetSoilType = soilTypesBefore.find(s => s.name === initialSoilTypes[1].name)

    const response = await api
      .put('/api/soiltypes/' + targetSoilType._id)
      .send(targetSoilType)
      .expect(401)

    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesBefore).to.deep.equal(soilTypesAfter)
  })

  it('returns error with bogus token', async () => {
    const bogusToken = await getBogusToken()
    const soilTypesBefore = await soilTypesInDb()
    const targetSoilType = soilTypesBefore.find(s => s.name === initialSoilTypes[1].name)

    const response = await api
      .put('/api/soiltypes/' + targetSoilType._id)
      .set('Authorization', 'Bearer ' + bogusToken)
      .send(targetSoilType)
      .expect(401)

    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesBefore).to.deep.equal(soilTypesAfter)
  })

  it('returns error with token of a removed user', async () => {
    const oldToken = await getOldUsersToken()
    const soilTypesBefore = await soilTypesInDb()
    const targetSoilType = soilTypesBefore.find(s => s.name === initialSoilTypes[1].name)

    const response = await api
      .put('/api/soiltypes/' + targetSoilType._id)
      .set('Authorization', 'Bearer ' + oldToken)
      .send(targetSoilType)
      .expect(401)

    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesBefore).to.deep.equal(soilTypesAfter)
  })

  it('does not accept a soil type without a name', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const countries = await countriesInDb()
    const targetSoilType = soilTypesBefore.find(s => s.name === initialSoilTypes[1].name)
    const editedSoilType = {
      _id: targetSoilType._id,
      countryId: countries[0]._id
    }

    const response = await api
      .put('/api/soiltypes/' + targetSoilType._id)
      .set('Authorization', 'Bearer ' + token)
      .send(editedSoilType)
      .expect(400)

    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesBefore).to.deep.equal(soilTypesAfter)
  })

  it('does not accept a soil type with white space name', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const countries = await countriesInDb()
    const targetSoilType = soilTypesBefore.find(s => s.name === initialSoilTypes[1].name)
    const editedSoilType = {
      _id: targetSoilType._id,
      name: ' ',
      countryId: countries[0]._id
    }

    const response = await api
      .put('/api/soiltypes/' + targetSoilType._id)
      .set('Authorization', 'Bearer ' + token)
      .send(editedSoilType)
      .expect(400)

    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesBefore).to.deep.equal(soilTypesAfter)
  })

  it('does not accept a soil type with name used by another soil type', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const countries = await countriesInDb()
    const targetSoilType = soilTypesBefore.find(s => s.name === initialSoilTypes[1].name)
    const editedSoilType = {
      _id: targetSoilType._id,
      name: initialSoilTypes[0].name,
      countryId: countries[0]._id
    }

    const response = await api
      .put('/api/soiltypes/' + targetSoilType._id)
      .set('Authorization', 'Bearer ' + token)
      .send(editedSoilType)
      .expect(400)

    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesBefore).to.deep.equal(soilTypesAfter)
  })

  it('does not accept a soil type without a country id', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const targetSoilType = soilTypesBefore.find(s => s.name === initialSoilTypes[1].name)
    const editedSoilType = {
      _id: targetSoilType._id,
      name: 'editedSoiltype'
    }

    const response = await api
      .put('/api/soiltypes/' + targetSoilType._id)
      .set('Authorization', 'Bearer ' + token)
      .send(editedSoilType)
      .expect(400)

    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesBefore).to.deep.equal(soilTypesAfter)
  })

  it('does not accept a soil type with a nonexisting country id', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const nonId = await nonExistingCountryId
    const targetSoilType = soilTypesBefore.find(s => s.name === initialSoilTypes[1].name)
    const editedSoilType = {
      _id: targetSoilType._id,
      name: 'editedSoiltype',
      countryId: nonExistingCountryId
    }

    const response = await api
      .put('/api/soiltypes/' + targetSoilType._id)
      .set('Authorization', 'Bearer ' + token)
      .send(editedSoilType)
      .expect(400)

    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesBefore).to.deep.equal(soilTypesAfter)
  })

  it('updates with own name without causing an error', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const countries = await countriesInDb()
    const targetSoilType = soilTypesBefore.find(s => s.name === initialSoilTypes[1].name)
    const editedSoilType = {
      _id: targetSoilType._id,
      name: targetSoilType.name,
      countryId: countries[1]._id
    }

    const response = await api
      .put('/api/soiltypes/' + targetSoilType._id)
      .set('Authorization', 'Bearer ' + token)
      .send(editedSoilType)
      .expect(201)

    const updatedSoilType = response.body
    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesAfter.length).to.equal(soilTypesBefore.length)
    expect(updatedSoilType.name).to.equal(targetSoilType.name)
    expect(updatedSoilType.country.name).to.equal(countries[1].name)
  })

  it('does not update a non-existing soil type', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const countries = await countriesInDb()
    const nonId = await nonExistingSoilTypeId()
    const targetSoilType = soilTypesBefore.find(s => s.name === initialSoilTypes[1].name)
    const editedSoilType = {
      _id: targetSoilType._id,
      name: 'editedSoiltype',
      countryId: countries[2]._id
    }

    const response = await api
      .put('/api/soiltypes/' + nonId)
      .set('Authorization', 'Bearer ' + token)
      .send(editedSoilType)
      .expect(400)

    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesBefore).to.deep.equal(soilTypesAfter)
  })
})

describe('DELETE /api/soiltypes:id', async () => {
  let token = null

  beforeEach('Get user token', async () => {
    await resetUsers()
    token = await getToken(initialUsers[0].username)
    await resetSoilTypes()
  })
    
  afterEach('Reset soil types', async () => {
    await resetSoilTypes()
  })

  it('deletes the right soil type', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const targetSoilType = soilTypesBefore.find(s => s.name === initialSoilTypes[1].name)

    const response = await api
      .delete('/api/soiltypes/' + targetSoilType._id)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)

    const soilTypesAfter = await soilTypesInDb()
    const idsAfter = soilTypesAfter.map(s => s._id.toString())
    expect(soilTypesAfter.length).to.equal(soilTypesBefore.length - 1)
    expect(idsAfter).not.to.contain(targetSoilType._id.toString())
  })

  it('returns error without token', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const targetSoilType = soilTypesBefore.find(s => s.name === initialSoilTypes[1].name)

    const response = await api
      .delete('/api/soiltypes/' + targetSoilType._id)
      .expect(401)

    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesAfter).to.deep.equal(soilTypesBefore)
  })

  it('returns error with bogus token', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const bogusToken = await getBogusToken()
    const targetSoilType = soilTypesBefore.find(s => s.name === initialSoilTypes[1].name)

    const response = await api
      .delete('/api/soiltypes/' + targetSoilType._id)
      .set('Authorization', 'Bearer ' + bogusToken)
      .expect(401)

    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesAfter).to.deep.equal(soilTypesBefore)
  })

  it('returns error with token of a removed user', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const oldToken = await getOldUsersToken()
    const targetSoilType = soilTypesBefore.find(s => s.name === initialSoilTypes[1].name)

    const response = await api
      .delete('/api/soiltypes/' + targetSoilType._id)
      .set('Authorization', 'Bearer ' + oldToken)
      .expect(401)

    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesAfter).to.deep.equal(soilTypesBefore)
  })

  it('returns error with non-existing id', async () => {
    const soilTypesBefore = await soilTypesInDb()
    const targetSoilType = soilTypesBefore.find(s => s.name === initialSoilTypes[1].name)
    const nonId = await nonExistingSoilTypeId()

    const response = await api
      .delete('/api/soiltypes/' + nonId)
      .set('Authorization', 'Bearer ' + token)
      .expect(400)

    const soilTypesAfter = await soilTypesInDb()
    expect(soilTypesAfter).to.deep.equal(soilTypesBefore)
  })
})

after('Close server', async () => {
  await server.close()
})