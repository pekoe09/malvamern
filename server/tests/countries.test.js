const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const { expect } = require('chai')
const { initialCountries, resetCountries, countriesInDb, nonExistingId } = require('./countries.testHelper')
const { initialUsers, getToken, getBogusToken, getOldUsersToken } = require('./users.testHelper')

describe('GET /api/countries', () => {

  it('works', async () => {
    await api
      .get('/api/countries')
      .expect(200)
  })

  it('returns countries in json format', async () => {
    await api
      .get('/api/countries')
      .expect('Content-Type', /application\/json/)
  })
})

describe('POST /api/countries', () => {

  let token = null

  beforeEach('Get user token', async () => {
    token = await getToken(initialUsers[0].username)
    await resetCountries()
  })

  it('creates a new country', async () => {
    const countriesBefore = await countriesInDb()
    const country = {
      name: 'newcountry',
      abbreviation: 'newc'
    }

    const response = await api
      .post('/api/countries')
      .set('Authorization', 'Bearer ' + token)
      .send(country)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const countriesAfter = await countriesInDb()
    const newCountry = response.body
    const newCountryInDb = countriesAfter.find(c => c.name === newCountry.name)
    expect(countriesAfter.length).to.equal(countriesBefore.length + 1)
    expect(newCountry.name).to.equal(country.name)
    expect(newCountry.abbreviation).to.equal(country.abbreviation)
    expect(newCountryInDb.name).to.equal(country.name)
    expect(newCountryInDb.abbreviation).to.equal(country.abbreviation)
  })

  it('returns error without token', async () => {
    const countriesBefore = await countriesInDb()
    const country = {
      name: 'newcountry',
      abbreviation: 'newc'
    }

    const response = await api
      .post('/api/countries')
      .send(country)
      .expect(401)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })

  it('returns error with bogus token', async () => {
    const countriesBefore = await countriesInDb()
    const bogusToken = await getBogusToken()
    const country = {
      name: 'newcountry',
      abbreviation: 'newc'
    }

    const response = await api
      .post('/api/countries')
      .set('Authorization', 'Bearer ' + bogusToken)
      .send(country)
      .expect(401)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })

  it('returns error with token of a removed user', async () => {
    const countriesBefore = await countriesInDb()
    const oldtoken = await getOldUsersToken()
    const country = {
      name: 'newcountry',
      abbreviation: 'newc'
    }

    const response = await api
      .post('/api/countries')
      .set('Authorization', 'Bearer ' + oldtoken)
      .send(country)
      .expect(401)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })

  it('does not accept country without a name', async () => {
    const countriesBefore = await countriesInDb()
    const country = {
      abbreviation: 'newc'
    }

    const response = await api
      .post('/api/countries')
      .set('Authorization', 'Bearer ' + token)
      .send(country)
      .expect(400)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })

  it('does not accept country with white space string as a name', async () => {
    const countriesBefore = await countriesInDb()
    const country = {
      name: ' ',
      abbreviation: 'newc'
    }

    const response = await api
      .post('/api/countries')
      .set('Authorization', 'Bearer ' + token)
      .send(country)
      .expect(400)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })

  it('does not accept country with name already in use', async () => {
    const countriesBefore = await countriesInDb()
    const country = {
      name: initialCountries[1].name,
      abbreviation: 'newc'
    }

    const response = await api
      .post('/api/countries')
      .set('Authorization', 'Bearer ' + token)
      .send(country)
      .expect(400)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })

  it('does not accept country without an abbreviation', async () => {
    const countriesBefore = await countriesInDb()
    const country = {
      name: 'newcountry'
    }

    const response = await api
      .post('/api/countries')
      .set('Authorization', 'Bearer ' + token)
      .send(country)
      .expect(400)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })

  it('does not accept country with white space string as an abbreviation', async () => {
    const countriesBefore = await countriesInDb()
    const country = {
      name: 'newcountry',
      abbreviation: ' '
    }

    const response = await api
      .post('/api/countries')
      .set('Authorization', 'Bearer ' + token)
      .send(country)
      .expect(400)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })

  it('does not accept country with abbreviation already in use', async () => {
    const countriesBefore = await countriesInDb()
    const country = {
      name: 'newCountry',
      abbreviation: initialCountries[1].abbreviation
    }

    const response = await api
      .post('/api/countries')
      .set('Authorization', 'Bearer ' + token)
      .send(country)
      .expect(400)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })
})

describe('PUT /api/countries/:id', async () => {
  let token = null

  beforeEach('Get user token', async () => {
    token = await getToken(initialUsers[0].username)
    await resetCountries()
  })

  it('updates the correct country', async () => {
    const countriesBefore = await countriesInDb()
    const targetCountry = countriesBefore.find(c => c.name === initialCountries[1].name)
    targetCountry.name = 'newname'
    targetCountry.abbreviation = 'newabbreviation'

    const response = await api
      .put('/api/countries/' + targetCountry._id)
      .set('Authorization', 'Bearer ' + token)
      .send(targetCountry)
      .expect(201)

    const updatedCountry = response.body
    const countriesAfter = await countriesInDb()
    expect(countriesAfter.length).to.equal(countriesBefore.length)
    expect(updatedCountry.name).to.equal(targetCountry.name)
    expect(updatedCountry.abbreviation).to.equal(targetCountry.abbreviation)
  })

  it('returns error without token', async () => {
    const countriesBefore = await countriesInDb()
    const targetCountry = countriesBefore.find(c => c.name === initialCountries[1].name)

    const response = await api
      .put('/api/countries/' + targetCountry._id)
      .send(targetCountry)
      .expect(401)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })

  it('returns error with bogus token', async () => {
    const countriesBefore = await countriesInDb()
    const targetCountry = countriesBefore.find(c => c.name === initialCountries[1].name)
    const bogusToken = await getBogusToken()

    const response = await api
      .put('/api/countries/' + targetCountry._id)
      .set('Authorization', 'Bearer ' + bogusToken)
      .send(targetCountry)
      .expect(401)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })

  it('returns error with token of a removed user', async () => {
    const countriesBefore = await countriesInDb()
    const targetCountry = countriesBefore.find(c => c.name === initialCountries[1].name)
    const oldToken = await getOldUsersToken()

    const response = await api
      .put('/api/countries/' + targetCountry._id)
      .set('Authorization', 'Bearer ' + oldToken)
      .send(targetCountry)
      .expect(401)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })

  it('does not accept a country without a name', async () => {
    const countriesBefore = await countriesInDb()
    const targetCountry = countriesBefore.find(c => c.name === initialCountries[1].name)
    const editedCountry = {
      _id: targetCountry._id,
      abbreviation: 'newabbreviation'
    }

    const response = await api
      .put('/api/countries/' + targetCountry._id)
      .set('Authorization', 'Bearer ' + token)
      .send(editedCountry)
      .expect(400)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })

  it('does not accept a country with white space name', async () => {
    const countriesBefore = await countriesInDb()
    const targetCountry = countriesBefore.find(c => c.name === initialCountries[1].name)
    const editedCountry = {
      _id: targetCountry._id,
      name: ' ',
      abbreviation: 'newabbreviation'
    }

    const response = await api
      .put('/api/countries/' + targetCountry._id)
      .set('Authorization', 'Bearer ' + token)
      .send(editedCountry)
      .expect(400)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })

  it('does not accept a country with name used by another country', async () => {
    const countriesBefore = await countriesInDb()
    const targetCountry = countriesBefore.find(c => c.name === initialCountries[1].name)
    const editedCountry = {
      _id: targetCountry._id,
      name: initialCountries[2].name,
      abbreviation: 'newabbreviation'
    }

    const response = await api
      .put('/api/countries/' + targetCountry._id)
      .set('Authorization', 'Bearer ' + token)
      .send(editedCountry)
      .expect(400)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })

  it('does not accept a country without an abbreviation', async () => {
    const countriesBefore = await countriesInDb()
    const targetCountry = countriesBefore.find(c => c.name === initialCountries[1].name)
    const editedCountry = {
      _id: targetCountry._id,
      name: 'newname'
    }

    const response = await api
      .put('/api/countries/' + targetCountry._id)
      .set('Authorization', 'Bearer ' + token)
      .send(editedCountry)
      .expect(400)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })

  it('does not accept a country with white space abbreviation', async () => {
    const countriesBefore = await countriesInDb()
    const targetCountry = countriesBefore.find(c => c.name === initialCountries[1].name)
    const editedCountry = {
      _id: targetCountry._id,
      name: 'newname',
      abbreviation: ' '
    }

    const response = await api
      .put('/api/countries/' + targetCountry._id)
      .set('Authorization', 'Bearer ' + token)
      .send(editedCountry)
      .expect(400)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })

  it('does not accept a country with abbreviation used by another country', async () => {
    const countriesBefore = await countriesInDb()
    const targetCountry = countriesBefore.find(c => c.name === initialCountries[1].name)
    const editedCountry = {
      _id: targetCountry._id,
      name: 'newname',
      abbreviation: initialCountries[2].abbreviation
    }

    const response = await api
      .put('/api/countries/' + targetCountry._id)
      .set('Authorization', 'Bearer ' + token)
      .send(editedCountry)
      .expect(400)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })

  it('updates with own name or abbreviation without causing an error', async () => {
    const countriesBefore = await countriesInDb()
    const targetCountry = countriesBefore.find(c => c.name === initialCountries[1].name)

    const response = await api
      .put('/api/countries/' + targetCountry._id)
      .set('Authorization', 'Bearer ' + token)
      .send(targetCountry)
      .expect(201)

    const updatedCountry = response.body
    const countriesAfter = await countriesInDb()
    expect(countriesAfter).to.deep.equal(countriesBefore)
  })

  it('does not update a non-existing country', async () => {
    const countriesBefore = await countriesInDb()
    const targetCountry = countriesBefore.find(c => c.name === initialCountries[1].name)
    const nonId = await nonExistingId()
    const editedCountry = {
      _id: targetCountry._id,
      name: 'newname',
      abbreviation: initialCountries[2].abbreviation
    }

    const response = await api
      .put('/api/countries/' + nonId)
      .set('Authorization', 'Bearer ' + token)
      .send(editedCountry)
      .expect(400)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })
})

describe('DELETE /api/countries:id', async () => {
  let token = null

  beforeEach('Get user token', async () => {
    token = await getToken(initialUsers[0].username)
    await resetCountries()
  })

  it('deletes the right country', async () => {
    const countriesBefore = await countriesInDb()
    const targetCountry = countriesBefore.find(c => c.name === initialCountries[1].name)

    const response = await api
      .delete('/api/countries/' + targetCountry._id)
      .set('Authorization', 'Bearer ' + token)
      .send(targetCountry)
      .expect(204)

    const countriesAfter = await countriesInDb()
    const idsAfter = countriesAfter.map(c => c._id.toString())
    expect(countriesAfter.length).to.equal(countriesBefore.length - 1)
    expect(idsAfter).not.to.contain(targetCountry._id.toString())
  })

  it('returns error without token', async () => {
    const countriesBefore = await countriesInDb()
    const targetCountry = countriesBefore.find(c => c.name === initialCountries[1].name)

    const response = await api
      .delete('/api/countries/' + targetCountry._id)
      .send(targetCountry)
      .expect(401)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })

  it('returns error with bogus token', async () => {
    const countriesBefore = await countriesInDb()
    const targetCountry = countriesBefore.find(c => c.name === initialCountries[1].name)
    const bogusToken = await getBogusToken()

    const response = await api
      .delete('/api/countries/' + targetCountry._id)
      .set('Authorization', 'Bearer ' + bogusToken)
      .send(targetCountry)
      .expect(401)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })

  it('returns error with token of a removed user', async () => {
    const countriesBefore = await countriesInDb()
    const targetCountry = countriesBefore.find(c => c.name === initialCountries[1].name)
    const oldToken = await getOldUsersToken()

    const response = await api
      .delete('/api/countries/' + targetCountry._id)
      .set('Authorization', 'Bearer ' + oldToken)
      .send(targetCountry)
      .expect(401)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })

  it('returns error with non-existing id', async () => {
    const countriesBefore = await countriesInDb()
    const targetCountry = countriesBefore.find(c => c.name === initialCountries[1].name)
    const nonId = await nonExistingId()

    const response = await api
      .delete('/api/countries/' + nonId)
      .set('Authorization', 'Bearer ' + token)
      .send(targetCountry)
      .expect(400)

    const countriesAfter = await countriesInDb()
    expect(countriesBefore).to.deep.equal(countriesAfter)
  })
})

after('Close server', async () => {
  await server.close()
})