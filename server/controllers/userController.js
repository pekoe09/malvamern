const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { wrapAsync, checkUser, validateMandatoryFields, validateEmailForm } = require('./controllerHelpers')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/register', wrapAsync(async (req, res, next) => {
  const mandatories = ['username', 'email', 'firstNames', 'lastName']
  validateMandatoryFields(req, mandatories, 'User', 'register')
  validateEmailForm(req.body.email)
  const usernameMatches = await User.find({ username: req.body.username })
  if (usernameMatches.length > 0) {
    let err = new Error('Username is already in use')
    err.isBadRequest = true
    throw err
  }

  const body = req.body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  let user = new User({
    username: body.username,
    passwordHash,
    firstNames: body.firstNames,
    lastName: body.lastName,
    email: body.email,
    locations: []
  })

  user = await user.save()
  res.status(201).json(user)
}))

userRouter.post('/login', wrapAsync(async (req, res, next) => {
  const body = req.body
  const user = await User
    .findOne({ username: body.username })
    .select({
      _id: 1,
      username: 1,
      passwordHash: 1,
      lastName: 1,
      firstNames: 1,
      email: 1,
      locations: 1
    })

  const isCorrectPsw = user === null ? false : await bcrypt.compare(body.password, user.passwordHash)
  if (!user || !isCorrectPsw) {
    let err = new Error('Invalid username or password')
    err.isUnauthorizedAttempt = true
    throw err
  }

  const tokenPayload = {
    username: user.username,
    userId: user._id
  }

  const token = jwt.sign(tokenPayload, process.env.SECRET)

  res.send({
    username: user.username,
    lastName: user.lastName,
    firstNames: user.firstNames,
    email: user.email,
    locations: user.locations,
    token
  })
}))

userRouter.get('/self', wrapAsync(async (req, res, next) => {
  checkUser(req)
  const user = await User.findById(req.user._id)
  res.json(user)
}))

userRouter.put('/self', wrapAsync(async (req, res, next) => {
  checkUser(req)
  const mandatories = ['username', 'email', 'firstNames', 'lastName']
  validateMandatoryFields(req, mandatories, 'User', 'update self')
  validateEmailForm(req.body.email)
  const usernameMatches = await User.find({ username: req.body.username })
  if (usernameMatches.length > 1 ||
    (usernameMatches.length === 1 && usernameMatches[0]._id.toString() !== req.user._id.toString())) {
    let err = new Error('Username is already in use')
    err.isBadRequest = true
    throw err
  }

  const body = req.body
  let user = await User.findById(req.user._id)
  user.username = body.username
  user.firstNames = body.firstNames
  user.lastName = body.lastName
  user.email = body.email
  const updatedUser = await User.findByIdAndUpdate(user._id, user, { new: true })
  res.status(201).json(updatedUser)
}))

module.exports = userRouter