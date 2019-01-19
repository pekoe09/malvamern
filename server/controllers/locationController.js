const { wrapAsync, checkUser, validateMandatoryFields, validateEmailForm } = require('./controllerHelpers')
const locationRouter = require('express').Router()
const User = require('../models/user')

locationRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)
  const mandatories = ['name', 'isActive']
  validateMandatoryFields(req, mandatories, 'Location', 'create')
  const user = await User.findById(req.user._id)
  const match = user.locations.find(l => l.name === req.body.name)
  if (match) {
    let err = new Error('There already exists a location with the same name')
    err.isBadRequest = true
    throw err
  }

  const location = {
    name: req.body.name,
    city: req.body.city,
    country: req.body.country,
    soilTypes: req.body.soilTypes,
    isActive: req.body.isActive
  }
  user.locations = user.locations.concat(location)
  user = await User.findByIdAndUpdate(user._id, user)
  location = user.locations.find(l => l.name === location.name)
  res.status(201).json(location)
}))

locationRouter.put('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  const mandatories = ['name', 'isActive']
  validateMandatoryFields(req, mandatories, 'Location', 'create')
  const user = await User.findById(req.user._id)
  const location = user.locations.find(l => l._id.toString === req.params.id)
  if (!location) {
    let err = new Error('Location to be updated does not exist')
    err.isBadRequest = true
    throw err
  }

  location = {
    ...location,
    name: req.body.name,
    city: req.body.city,
    country: req.body.country,
    soilTypes: req.body.soilTypes,
    isActive: req.body.isActive
  }
  user.locations = user.locations.map(l =>
    l._id.equals(location._id) ? location : l)
  user = await User.findByIdAndUpdate(user._id, user)
  location = user.locations.find(l => l.name === location.name)
  res.status(201).json(location)
}))

locationRouter.delete('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  const user = await User.findById(req.user._id)
  const location = user.locations.find(l => l._id.toString === req.params.id)
  if (!location) {
    let err = new Error('Location to be updated does not exist')
    err.isBadRequest = true
    throw err
  }
  user.locations = user.locations.map(l => !l._id.equals(location._id))
  user = await User.findByIdAndUpdate(user._id, user)
  res.status(204).end()
}))

module.exports = locationRouter