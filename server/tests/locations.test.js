const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const { expect } = require('chai')
const { initialUsers, resetUsers, usersInDb, getToken, getBogusToken, getOldUsersToken } = require('./users.testHelper')
const User = require('../models/user')

describe('POST /api/locations', () => {

  let tokenUser = initialUsers[1]
  let token = null

  beforeEach('Get user token', async () => {
    await resetUsers()
    token = await getToken(tokenUser.username)
  })

  it('creates a new location', async () => {
    const usersBefore = await usersInDb()
    const userBefore = usersBefore.find(u => u.username === tokenUser.username)
    const location = {
      name: 'newlocation',
      city: 'newcity',
      country: 'newcountry',
      soilTypes: [],
      isActive: true
    }

    const response = await api
      .post('/api/locations')
      .set('Authorization', 'Bearer ' + token)
      .send(location)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await usersInDb()
    const userAfter = usersAfter.find(u => u.username === tokenUser.username)
    const newLocation = response.body
    const newLocationInDb = userAfter.locations.find(l => l.name === location.name)
    expect(userAfter.locations.length).to.equal(userBefore.locations.length + 1)
    expect(newLocationInDb).to.not.be.null
    expect(newLocation.name).to.equal(location.name)
    expect(newLocation.city).to.equal(location.city)
    expect(newLocation.country).to.equal(location.country)
    expect(newLocation.soilTypes.length).to.equal(location.soilTypes.length)
    expect(newLocation.isActive).to.equal(location.isActive)
    expect(newLocationInDb.name).to.equal(location.name)
    expect(newLocationInDb.city).to.equal(location.city)
    expect(newLocationInDb.country).to.equal(location.country)
    expect(newLocationInDb.soilTypes.length).to.equal(location.soilTypes.length)
    expect(newLocationInDb.isActive).to.equal(location.isActive)
  })

  it('returns error without token', async () => {
    const usersBefore = await usersInDb()
    const userBefore = usersBefore.find(u => u.username === tokenUser.username)
    const location = {
      name: 'newlocation',
      isActive: true
    }

    const response = await api
      .post('/api/locations')
      .send(location)
      .expect(401)

    const usersAfter = await usersInDb()
    const userAfter = usersAfter.find(u => u.username === tokenUser.username)
    expect(userBefore.locations.length).to.equal(userAfter.locations.length)
  })

  it('returns error with bogus token', async () => {
    const usersBefore = await usersInDb()
    const userBefore = usersBefore.find(u => u.username === tokenUser.username)
    const bogusToken = await getBogusToken()
    const location = {
      name: 'newlocation',
      isActive: true
    }

    const response = await api
      .post('/api/locations')
      .set('Authorizatin', 'Bearer ' + bogusToken)
      .send(location)
      .expect(401)

    const usersAfter = await usersInDb()
    const userAfter = usersAfter.find(u => u.username === tokenUser.username)
    expect(userBefore.locations.length).to.equal(userAfter.locations.length)
  })

  it('returns error with the token of a removed user', async () => {
    const usersBefore = await usersInDb()
    const userBefore = usersBefore.find(u => u.username === tokenUser.username)
    const oldToken = await getOldUsersToken()
    const location = {
      name: 'newlocation',
      isActive: true
    }

    const response = await api
      .post('/api/locations')
      .set('Authorizatin', 'Bearer ' + oldToken)
      .send(location)
      .expect(401)

    const usersAfter = await usersInDb()
    const userAfter = usersAfter.find(u => u.username === tokenUser.username)
    expect(userBefore.locations.length).to.equal(userAfter.locations.length)
  })

  it('does not accept location without a name', async () => {
    const usersBefore = await usersInDb()
    const userBefore = usersBefore.find(u => u.username === tokenUser.username)
    const location = {
      isActive: true
    }

    const response = await api
      .post('/api/locations')
      .set('Authorization', 'Bearer ' + token)
      .send(location)
      .expect(400)

    const usersAfter = await usersInDb()
    const userAfter = usersAfter.find(u => u.username === tokenUser.username)
    expect(userBefore.locations.length).to.equal(userAfter.locations.length)
  })

  it('does not accept location with white space as a name', async () => {
    const usersBefore = await usersInDb()
    const userBefore = usersBefore.find(u => u.username === tokenUser.username)
    const location = {
      name: ' ',
      isActive: true
    }

    const response = await api
      .post('/api/locations')
      .set('Authorization', 'Bearer ' + token)
      .send(location)
      .expect(400)

    const usersAfter = await usersInDb()
    const userAfter = usersAfter.find(u => u.username === tokenUser.username)
    expect(userBefore.locations.length).to.equal(userAfter.locations.length)
  })

  it('does not accept location with an existing name for the same user', async () => {
    const usersBefore = await usersInDb()
    const userBefore = usersBefore.find(u => u.username === tokenUser.username)
    const location = {
      name: userBefore.locations[0].name,
      isActive: true
    }

    const response = await api
      .post('/api/locations')
      .set('Authorization', 'Bearer ' + token)
      .send(location)
      .expect(400)

    const usersAfter = await usersInDb()
    const userAfter = usersAfter.find(u => u.username === tokenUser.username)
    expect(userBefore.locations.length).to.equal(userAfter.locations.length)
  })

  it('accepts location with an existing name for different user', async () => {
    const usersBefore = await usersInDb()
    const userBefore = usersBefore.find(u => u.username === tokenUser.username)
    const location = {
      name: usersBefore[2].locations[0].name,
      isActive: true
    }

    const response = await api
      .post('/api/locations')
      .set('Authorization', 'Bearer ' + token)
      .send(location)
      .expect(201)

    const usersAfter = await usersInDb()
    const userAfter = usersAfter.find(u => u.username === tokenUser.username)
    expect(userAfter.locations.length).to.equal(userBefore.locations.length + 1)
  })

  it('does not accept location without an isActive flag', async () => {
    const usersBefore = await usersInDb()
    const userBefore = usersBefore.find(u => u.username === tokenUser.username)
    const location = {
      name: 'newlocation'
    }

    const response = await api
      .post('/api/locations')
      .set('Authorization', 'Bearer ' + token)
      .send(location)
      .expect(400)

    const usersAfter = await usersInDb()
    const userAfter = usersAfter.find(u => u.username === tokenUser.username)
    expect(userBefore.locations.length).to.equal(userAfter.locations.length)
  })
})

after('Close server', async () => {
  await server.close()
})