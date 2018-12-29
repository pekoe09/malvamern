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
    email: body.email
  })

  user = await user.save()
  res.status(201).json(user)  
}))

module.exports = userRouter