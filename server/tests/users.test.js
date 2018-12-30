const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const { initialUsers, resetUsers, usersInDb, getToken, getBogusToken, getOldUsersToken } = require('./users.testHelper')
const User = require('../models/user')

describe('GET /api/users/self', () => {

  let tokenUser = initialUsers[1]
  let token = null

  beforeAll(async () => {
    await resetUsers()
    token = await getToken(tokenUser.username)
  })

  it('works', async () => {
    await api
      .get('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  })

  it('returns error without token', async () => {
    await api
      .get('/api/users/self')
      .expect(401)
  })

  it('returns error with bogus token', async () => {
    const bogusToken = getBogusToken()
    await api
      .get('/api/users/self')
      .set('Authorization', 'Bearer ' + bogusToken)
      .expect(401)
  })

  it('returns error with token of a removed user', async () => {
    const oldUsersToken = getOldUsersToken()
    await api
      .get('/api/users/self')
      .set('Authorization', 'Bearer ' + oldUsersToken)
      .expect(401)
  })

  it('returns user in json format', async () => {
    await api
      .get('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /application\/json/)
  })

  it('returns the correct user', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const response = await api
      .get('/api/users/self')
      .set('Authorization', 'Bearer ' + token)

    const user = response.body
    expect(user._id.toString()).toEqual(targetUser._id.toString())
    expect(user.username).toEqual(targetUser.username)
    expect(user.lastName).toEqual(targetUser.lastName)
    expect(user.firstNames).toEqual(targetUser.firstNames)
    expect(user.email).toEqual(targetUser.email)
  })
})

describe('PUT /api/users/self', () => {

  let tokenUser = initialUsers[1]
  let token = null

  beforeEach(async () => {
    await resetUsers()
    token = await getToken(tokenUser.username)
  })

  it('updates the calling user', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)
    targetUser.username = 'updatedUsername'
    targetUser.lastName = 'updatedLastname'
    targetUser.firstNames = 'updatedFirstNames'
    targetUser.email = 'updated@email.com'

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(targetUser)
      .expect(201)

    const updatedUser = response.body
    const usersAfter = await usersInDb()
    expect(usersAfter.length).toBe(users.length)
    expect(updatedUser.username).toEqual(targetUser.username)
    expect(updatedUser.email).toEqual(targetUser.email)
    expect(updatedUser.lastName).toEqual(targetUser.lastName)
    expect(updatedUser.firstNames).toEqual(targetUser.firstNames)
  })

  it('returns error without token', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const response = await api
      .put('/api/users/self')
      .send(targetUser)
      .expect(401)
  })

  it('returns error with bogus token', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)
    const bogusToken = getBogusToken()

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + bogusToken)
      .send(targetUser)
      .expect(401)

  })

  it('returns error with token of a removed user', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)
    const oldUsersToken = getOldUsersToken()

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + oldUsersToken)
      .send(targetUser)
      .expect(401)
  })

  it('does not accept user without username', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const editedUser = {
      _id: targetUser._id,
      lastName: 'updatedLastname',
      firstNames: 'updatedFirstNames',
      email: 'updated@email.com',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(400)
  })

  it('does not accept user with empty string as username', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const editedUser = {
      _id: targetUser._id,
      username: '',
      lastName: 'updatedLastname',
      firstNames: 'updatedFirstNames',
      email: 'updated@email.com',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(400)
  })

  it('does not accept username already in use by someone else', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)
    const otherUsers = users.filter(u => u._id.toString() !== targetUser._id.toString())

    const editedUser = {
      _id: targetUser._id,
      username: otherUsers[0].username,
      lastName: 'updatedLastname',
      firstNames: 'updatedFirstNames',
      email: 'updated@email.com',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(400)
  })

  it('updates user that does not change its current username', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const editedUser = {
      _id: targetUser._id,
      username: targetUser.username,
      lastName: 'updatedLastname',
      firstNames: 'updatedFirstNames',
      email: 'updated@email.com',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(201)

    const updatedUser = response.body
    expect(updatedUser.username).toEqual(editedUser.username)
    expect(updatedUser.email).toEqual(editedUser.email)
    expect(updatedUser.lastName).toEqual(editedUser.lastName)
    expect(updatedUser.firstNames).toEqual(editedUser.firstNames)
  })

  it('does not accept user without email', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const editedUser = {
      _id: targetUser._id,
      username: 'updatedUsername',
      lastName: 'updatedLastname',
      firstNames: 'updatedFirstNames',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(400)
  })

  it('does not accept user with empty string as email', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const editedUser = {
      _id: targetUser._id,
      username: 'updatedUsername',
      lastName: 'updatedLastname',
      firstNames: 'updatedFirstNames',
      email: '',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(400)
  })

  it('does not accept user with malformed email', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const editedUser = {
      _id: targetUser._id,
      username: 'updatedUsername',
      lastName: 'updatedLastname',
      firstNames: 'updatedFirstNames',
      email: 'updatedemail.com',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(400)
  })

  it('does not accept user without last name', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const editedUser = {
      _id: targetUser._id,
      username: 'updatedUsername',
      firstNames: 'updatedFirstNames',
      email: 'updated@email.com',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(400)
  })

  it('does not accept user with empty string as last name', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const editedUser = {
      _id: targetUser._id,
      username: 'updatedUsername',
      lastName: '',
      firstNames: 'updatedFirstNames',
      email: 'updated@email.com',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(400)
  })

  it('does not accept user without first name', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const editedUser = {
      _id: targetUser._id,
      username: 'updatedUsername',
      lastName: 'updatedLastname',
      email: 'updated@email.com',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(400)
  })

  it('does not accept user with empty string as first names', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const editedUser = {
      _id: targetUser._id,
      username: 'updatedUsername',
      lastName: 'updatedLastname',
      firstNames: '',
      email: 'updated@email.com',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(400)
  })

})

describe('POST /api/users/register', () => {

  let tokenUser = initialUsers[1]
  let token = null

  beforeEach(async () => {
    await resetUsers()
    token = await getToken(tokenUser.username)
  })

  it('creates a new user', async () => {
    const usersBefore = await usersInDb()
    const user = {
      username: 'newusername',
      password: 'newpassword',
      password2: 'newpassword',
      firstNames: 'newfirstname',
      lastName: 'newLastname',
      email: 'new@mail.com'
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await usersInDb()
    const newUser = response.body
    const newUserInDb = usersAfter.find(u => u.username === newUser.username)
    expect(usersAfter.length).toBe(usersBefore.length + 1)
    expect(newUser.username).toEqual(user.username)
    expect(newUser.firstNames).toEqual(user.firstNames)
    expect(newUser.lastName).toEqual(user.lastName)
    expect(newUser.email).toEqual(user.email)
    expect(newUserInDb.username).toEqual(user.username)
    expect(newUserInDb.firstNames).toEqual(user.firstNames)
    expect(newUserInDb.lastName).toEqual(user.lastName)
    expect(newUserInDb.email).toEqual(user.email)
  })

  it('does not accept user without username', async () => {
    const usersBefore = await usersInDb()
    const user = {
      password: 'newpassword',
      password2: 'newpassword',
      firstNames: 'newfirstname',
      lastName: 'newLastname',
      email: 'new@mail.com'
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersBefore.length).toBe(usersAfter.length)
  })

  it('does not accept user with empty string as username', async () => {
    const usersBefore = await usersInDb()
    const user = {
      username: ' ',
      password: 'newpassword',
      password2: 'newpassword',
      firstNames: 'newfirstname',
      lastName: 'newLastname',
      email: 'new@mail.com'
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersBefore.length).toBe(usersAfter.length)
  })

  it('does not accept username already in use', async () => {
    const usersBefore = await usersInDb()
    const user = {
      username: usersBefore[0].username,
      password: 'newpassword',
      password2: 'newpassword',
      firstNames: 'newfirstname',
      lastName: 'newLastname',
      email: 'new@mail.com'
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersBefore.length).toBe(usersAfter.length)
  })

  it('does not accept user without email', async () => {
    const usersBefore = await usersInDb()
    const user = {
      username: 'newusername',
      password: 'newpassword',
      password2: 'newpassword',
      firstNames: 'newfirstname',
      lastName: 'newLastname'
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersBefore.length).toBe(usersAfter.length)
  })

  it('does not accept user with empty string as email', async () => {
    const usersBefore = await usersInDb()
    const user = {
      username: 'newusername',
      password: 'newpassword',
      password2: 'newpassword',
      firstNames: 'newfirstname',
      lastName: 'newLastname',
      email: ' '
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersBefore.length).toBe(usersAfter.length)
  })

  it('does not accept user with malformed email', async () => {
    const usersBefore = await usersInDb()
    const user = {
      username: 'newusername',
      password: 'newpassword',
      password2: 'newpassword',
      firstNames: 'newfirstname',
      lastName: 'newLastname',
      email: 'newmail¨.com'
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersBefore.length).toBe(usersAfter.length)
  })

  it('does not accept user without last name', async () => {
    const usersBefore = await usersInDb()
    const user = {
      username: 'newusername',
      password: 'newpassword',
      password2: 'newpassword',
      firstNames: 'newfirstname',
      email: 'new@mail.com'
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersBefore.length).toBe(usersAfter.length)
  })

  it('does not accept user with empty string as last name', async () => {
    const usersBefore = await usersInDb()
    const user = {
      username: 'newusername',
      password: 'newpassword',
      password2: 'newpassword',
      firstNames: 'newfirstname',
      lastName: ' ',
      email: 'new@mail.com'
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersBefore.length).toBe(usersAfter.length)
  })

  it('does not accept user without first name', async () => {
    const usersBefore = await usersInDb()
    const user = {
      username: 'newusername',
      password: 'newpassword',
      password2: 'newpassword',
      lastName: 'newLastname',
      email: 'new@mail.com'
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersBefore.length).toBe(usersAfter.length)
  })

  it('does not accept user with empty string as first name', async () => {
    const usersBefore = await usersInDb()
    const user = {
      username: 'newusername',
      password: 'newpassword',
      password2: 'newpassword',
      firstNames: ' ',
      lastName: 'newLastname',
      email: 'new@mail.com'
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersBefore.length).toBe(usersAfter.length)
  })

})

afterAll(async () => {
  await server.close()
})