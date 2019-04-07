const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const diaryRouter = require('express').Router()
const DiaryEntry = require('../models/diaryEntry')

diaryRouter.get('/', wrapAsync(async (req, res, next) => {
  checkUser(req)
  const entries = await DiaryEntry
    .find({ user: req.user._id })
    .sort('date')
  res.json(entries)
}))

diaryRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['date'], 'diaryEntry', 'create')
  console.log('entry to be saved', req.body)
  console.log(req.user)

  let diaryEntry = new DiaryEntry({
    user: req.user._id,
    date: req.body.date,
    title: req.body.title,
    body: req.body.body
  })
  diaryEntry = await diaryEntry.save()
  res.status(201).json(diaryEntry)
}))

module.exports = diaryRouter