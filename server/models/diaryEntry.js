const mongoose = require('mongoose')

const diaryEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  title: {
    type: String
  },
  body: {
    type: String
  }
})

const DiaryEntry = mongoose.model('DiaryEntry', diaryEntrySchema)

module.exports = DiaryEntry