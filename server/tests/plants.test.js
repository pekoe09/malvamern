const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const { expect } = require('chai')
const { initialPlants, resetPlants, plantsInDb, nonExistingPlantId } = require('./plants.testHelper.js')
const { initialUsers, resetUsers, getToken, getBogusToken, getOldUsersToken } = require('./users.testHelper')

describe('GET /api/plants', async () => {

  it('works', async () => {
    await api
      .get('/api/plants')
      .expect(200)
  })

  it('returns plants in json format', async () => {
    await api
      .get('/api/plants')
      .expect('Content-Type', /application\/json/)
  })
})

describe('POST /api/plants', async () => {

  let token = null
  const plant = {
    name: 'plantn',
    scientificName: 'plant Scientific n',
    heightMin: 20,
    heightMax: 21,
    widthMin: 25,
    widthMax: 26,
    plantDistance: 22,
    plantDepth: 23,
    soilTypes: [],
    plantingFrom: 2,
    plantingTo: 3,
    floweringFrom: 4,
    floweringTo: 5,
    harvestFrom: 6,
    harvestTo: 7,
    flowerColors: ['white', 'black'],
    isPoisonous: true,
    hasSpikes: true,
    description: 'Description n',
    shortDescription: 'Short description n',
    environmentRequirements: 'Env reqs n',
    careInstructions: 'Care inst n'
  }

  beforeEach('Get user token', async () => {
    await resetUsers()
    token = await getToken(initialUsers[0].username)
    await resetPlants()
  })

  afterEach('Reset plants', async () => {
    await resetPlants()
  })

  it('creates a new plant', async () => {
    const plantsBefore = await plantsInDb()

    const response = await api
      .post('/api/plants')
      .set('Authorization', 'Bearer ' + token)
      .send(plant)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const plantsAfter = await plantsInDb()
    const newPlant = response.body
    const newPlantInDb = plantsAfter.find(p => p.name === plant.name)
    expect(plantsAfter.length).to.equal(plantsBefore.length + 1)
    expect(newPlant.name).to.equal(plant.name)
    expect(newPlant.scientificName).to.equal(plant.scientificName)
    expect(newPlant.heightMin).to.equal(plant.heightMin)
    expect(newPlant.heightMax).to.equal(plant.heightMax)
    expect(newPlant.widthMin).to.equal(plant.widthMin)
    expect(newPlant.widthMax).to.equal(plant.widthMax)
    expect(newPlant.plantDistance).to.equal(plant.plantDistance)
    expect(newPlant.plantDepth).to.equal(plant.plantDepth)
    expect(newPlant.plantingFrom.number).to.equal(plant.plantingFrom)
    expect(newPlant.plantingTo.number).to.equal(plant.plantingTo)
    expect(newPlant.floweringFrom.number).to.equal(plant.floweringFrom)
    expect(newPlant.floweringTo.number).to.equal(plant.floweringTo)
    expect(newPlant.harvestFrom.number).to.equal(plant.harvestFrom)
    expect(newPlant.harvestTo.number).to.equal(plant.harvestTo)
    expect(newPlant.flowerColors).to.deep.equal(plant.flowerColors)
    expect(newPlant.isPoisonous).to.equal(plant.isPoisonous)
    expect(newPlant.hasSpikes).to.equal(plant.hasSpikes)
    expect(newPlant.description).to.equal(plant.description)
    expect(newPlant.shortDescription).to.equal(plant.shortDescription)
    expect(newPlant.environmentRequirements).to.equal(plant.environmentRequirements)
    expect(newPlant.careInstructions).to.equal(plant.careInstructions)
  })

  it('returns error without token', async () => {
    const plantsBefore = await plantsInDb()

    const response = await api
      .post('/api/plants')
      .send(plant)
      .expect(401)

    const plantsAfter = await plantsInDb()
    expect(plantsBefore.length).to.equal(plantsAfter.length)
  })

  it('returns error with bogus token', async () => {
    const plantsBefore = await plantsInDb()
    const bogusToken = await getBogusToken()

    const response = await api
      .post('/api/plants')
      .set('Authorization', 'Bearer ' + bogusToken)
      .send(plant)
      .expect(401)

    const plantsAfter = await plantsInDb()
    expect(plantsAfter.length).to.equal(plantsBefore.length)
  })

  it('returns error with token of a removed user', async () => {
    const plantsBefore = await plantsInDb()
    const oldToken = await getOldUsersToken()

    const response = await api
      .post('/api/plants')
      .set('Authorization', 'Bearer ' + oldToken)
      .send(plant)
      .expect(401)

    const plantsAfter = await plantsInDb()
    expect(plantsAfter.length).to.equal(plantsBefore.length)
  })

  it('does not accept plant without a name', async () => {
    const plantsBefore = await plantsInDb()
    const editedPlant = { ...plant }
    delete editedPlant.name

    await api
      .post('/api/plants')
      .set('Authorization', 'Bearer ' + token)
      .send(editedPlant)
      .expect(400)

    const plantsAfter = await plantsInDb()
    expect(plantsBefore.length).to.equal(plantsAfter.length)
  })

  it('does not accept plant with white space as a name', async () => {
    const plantsBefore = await plantsInDb()
    const editedPlant = { ...plant }
    editedPlant.name = ' '

    await api
      .post('/api/plants')
      .set('Authorization', 'Bearer ' + token)
      .send(editedPlant)
      .expect(400)

    const plantsAfter = await plantsInDb()
    expect(plantsBefore.length).to.equal(plantsAfter.length)
  })

  it('does not accept plant with a name used by another plant', async () => {
    const plantsBefore = await plantsInDb()
    const editedPlant = { ...plant }
    editedPlant.name = initialPlants[1].name

    await api
      .post('/api/plants')
      .set('Authorization', 'Bearer ' + token)
      .send(editedPlant)
      .expect(400)

    const plantsAfter = await plantsInDb()
    expect(plantsBefore.length).to.equal(plantsAfter.length)
  })

  it('does not accept plant without a scientific name', async () => {
    const plantsBefore = await plantsInDb()
    const editedPlant = { ...plant }
    delete editedPlant.scientificName

    await api
      .post('/api/plants')
      .set('Authorization', 'Bearer ' + token)
      .send(editedPlant)
      .expect(400)

    const plantsAfter = await plantsInDb()
    expect(plantsBefore.length).to.equal(plantsAfter.length)
  })

  it('does not accept plant with white space as a scientific name', async () => {
    const plantsBefore = await plantsInDb()
    const editedPlant = { ...plant }
    editedPlant.scientificName = ' '

    await api
      .post('/api/plants')
      .set('Authorization', 'Bearer ' + token)
      .send(editedPlant)
      .expect(400)

    const plantsAfter = await plantsInDb()
    expect(plantsBefore.length).to.equal(plantsAfter.length)
  })

  it('does not accept plant without a min height', async () => {
    const plantsBefore = await plantsInDb()
    const editedPlant = { ...plant }
    delete editedPlant.heightMin

    await api
      .post('/api/plants')
      .set('Authorization', 'Bearer ' + token)
      .send(editedPlant)
      .expect(400)

    const plantsAfter = await plantsInDb()
    expect(plantsBefore.length).to.equal(plantsAfter.length)
  })

  it('does not accept plant with a negative min height', async () => {
    const plantsBefore = await plantsInDb()
    const editedPlant = { ...plant }
    editedPlant.heightMin = -1

    await api
      .post('/api/plants')
      .set('Authorization', 'Bearer ' + token)
      .send(editedPlant)
      .expect(400)

    const plantsAfter = await plantsInDb()
    expect(plantsBefore.length).to.equal(plantsAfter.length)
  })

  it('does not accept plant with a negative max height', async () => {
    const plantsBefore = await plantsInDb()
    const editedPlant = { ...plant }
    editedPlant.heightMax = -1

    await api
      .post('/api/plants')
      .set('Authorization', 'Bearer ' + token)
      .send(editedPlant)
      .expect(400)

    const plantsAfter = await plantsInDb()
    expect(plantsBefore.length).to.equal(plantsAfter.length)
  })

  it('does not accept plant without a min width', async () => {
    const plantsBefore = await plantsInDb()
    const editedPlant = { ...plant }
    delete editedPlant.widthMin

    await api
      .post('/api/plants')
      .set('Authorization', 'Bearer ' + token)
      .send(editedPlant)
      .expect(400)

    const plantsAfter = await plantsInDb()
    expect(plantsBefore.length).to.equal(plantsAfter.length)
  })

  it('does not accept plant with a negative min width', async () => {
    const plantsBefore = await plantsInDb()
    const editedPlant = { ...plant }
    editedPlant.widthMin = -1

    await api
      .post('/api/plants')
      .set('Authorization', 'Bearer ' + token)
      .send(editedPlant)
      .expect(400)

    const plantsAfter = await plantsInDb()
    expect(plantsBefore.length).to.equal(plantsAfter.length)
  })

  it('does not accept plant with a negative max width', async () => {
    const plantsBefore = await plantsInDb()
    const editedPlant = { ...plant }
    editedPlant.widthMax = -1

    await api
      .post('/api/plants')
      .set('Authorization', 'Bearer ' + token)
      .send(editedPlant)
      .expect(400)

    const plantsAfter = await plantsInDb()
    expect(plantsBefore.length).to.equal(plantsAfter.length)
  })

  it('does not accept plant with a negative planting distance', async () => {
    const plantsBefore = await plantsInDb()
    const editedPlant = { ...plant }
    editedPlant.plantDistance = -1

    await api
      .post('/api/plants')
      .set('Authorization', 'Bearer ' + token)
      .send(editedPlant)
      .expect(400)

    const plantsAfter = await plantsInDb()
    expect(plantsBefore.length).to.equal(plantsAfter.length)
  })

  it('does not accept plant with a negative planting depth', async () => {
    const plantsBefore = await plantsInDb()
    const editedPlant = { ...plant }
    editedPlant.plantDepth = -1

    await api
      .post('/api/plants')
      .set('Authorization', 'Bearer ' + token)
      .send(editedPlant)
      .expect(400)

    const plantsAfter = await plantsInDb()
    expect(plantsBefore.length).to.equal(plantsAfter.length)
  })

  it('does not accept plant without a description', async () => {
    const plantsBefore = await plantsInDb()
    const editedPlant = { ...plant }
    delete editedPlant.description

    await api
      .post('/api/plants')
      .set('Authorization', 'Bearer ' + token)
      .send(editedPlant)
      .expect(400)

    const plantsAfter = await plantsInDb()
    expect(plantsBefore.length).to.equal(plantsAfter.length)
  })

  it('does not accept plant with white space as a description', async () => {
    const plantsBefore = await plantsInDb()
    const editedPlant = { ...plant }
    editedPlant.description = ' '

    await api
      .post('/api/plants')
      .set('Authorization', 'Bearer ' + token)
      .send(editedPlant)
      .expect(400)

    const plantsAfter = await plantsInDb()
    expect(plantsBefore.length).to.equal(plantsAfter.length)
  })

  it('does not accept plant without a short description', async () => {
    const plantsBefore = await plantsInDb()
    const editedPlant = { ...plant }
    delete editedPlant.shortDescription

    await api
      .post('/api/plants')
      .set('Authorization', 'Bearer ' + token)
      .send(editedPlant)
      .expect(400)

    const plantsAfter = await plantsInDb()
    expect(plantsBefore.length).to.equal(plantsAfter.length)
  })

  it('does not accept plant with white space as a short description', async () => {
    const plantsBefore = await plantsInDb()
    const editedPlant = { ...plant }
    editedPlant.shortDescription = ' '

    await api
      .post('/api/plants')
      .set('Authorization', 'Bearer ' + token)
      .send(editedPlant)
      .expect(400)

    const plantsAfter = await plantsInDb()
    expect(plantsBefore.length).to.equal(plantsAfter.length)
  })

})

after('Close server', async () => {
  await server.close()
})