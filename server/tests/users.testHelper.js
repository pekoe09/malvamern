const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')

const initialUsers = [
  {
    username: 'testuser1',
    firstNames: 'Test1',
    lastName: 'User1',
    password: 'test1',
    passwordHash: '$2a$10$UdYL7yoi/Fgify8nxuPuTecoT/DKB0XZJwYHTxK0vLrZOgoajFVbq',
    email: 'test1@test.com',
    locations: []
  },
  {
    username: 'testuser2',
    firstNames: 'Test2',
    lastName: 'User2',
    password: 'test2',
    passwordHash: '$2a$10$8jJZY1inPKBS28JnNp3ix.f5wBKqPB711ag1P7ktJvaygBTtIVgUO',
    email: 'test3@test.com',
    locations: [
      {
        name: 'testlocation1',
        city: 'Alajärvi',
        country: 'Finland',
        soilTypes: [],
        isActive: true
      }
    ]
  },
  {
    username: 'testuser3',
    firstNames: 'Test3',
    lastName: 'User3',
    password: 'test3',
    passwordHash: '$2a$10$jhhWHC4rpH7rl//F8aYRVuZD8w200ePLE54q39GQ7Yzc9jtbCKnaq',
    email: 'test3@test.com',
    locations: [
      {
        name: 'testlocation2',
        city: 'Seinäjoki',
        country: 'Finland',
        soilTypes: [],
        isActive: true
      },
      {
        name: 'testlocation3',
        city: 'Tampere',
        country: 'Finland',
        soilTypes: [],
        isActive: false
      },
      {
        name: 'testlocation3',
        city: 'Kuortane',
        country: 'Finland',
        soilTypes: [],
        isActive: true
      },
    ]
  }
]

const usersInDb = async () => {
  return await User
    .find({})
    .select({
      _id: 1,
      username: 1,
      lastName: 1,
      firstNames: 1,
      email: 1,
      locations: 1
    })
}

const nonExistingId = async () => {
  let user = new User({
    username: 'username',
    passwordHash: '$2y$10$PUusFleLGs1bnROiXLG9zum9I/01tcSEJWkWRDYwSUVBWRS4hLjIC',
    lastName: 'userln',
    firstNames: 'userfns',
    email: 'usern@mail.com'
  })
  user = await user.save()
  const id = user._id
  await User.findByIdAndRemove(id)
  return id
}

const resetUsers = async () => {
  await User.remove({})
  const userObjects = initialUsers.map(u => new User(u))
  const promiseArray = userObjects.map(o => o.save())
  await Promise.all(promiseArray)
}

const getToken = async (username) => {
  const password = initialUsers.find(u => u.username === username).password
  const response = await api
    .post('/api/users/login')
    .send({
      username,
      password
    })
  return response.body.token
}

const getBogusToken = async () => {
  const response = await api
    .post('/api/users/login')
    .send({
      username: initialUsers[0].username,
      password: initialUsers[0].password
    })
  const token = response.body.token
  let tokenStart = token.substring(0, token.length - 1)
  let lastChar = token.charAt(token.length - 1) === 'a' ? 'b' : 'a'
  return tokenStart + lastChar
}

const getOldUsersToken = async () => {
  let user = new User({
    username: 'userold',
    passwordHash: initialUsers[2].passwordHash,
    lastName: 'userln',
    firstNames: 'userfns',
    email: 'usern@mail.com'
  })
  user = await user.save()
  const response = await api
    .post('/api/users/login')
    .send({
      username: user.username,
      password: initialUsers[2].password
    })
  const oldToken = response.body.token
  await User.findByIdAndRemove(user._id)
  return oldToken
}

module.exports = {
  initialUsers,
  usersInDb,
  nonExistingId,
  resetUsers,
  getToken,
  getBogusToken,
  getOldUsersToken
}