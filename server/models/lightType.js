const mongoose = require('mongoose')

const lightTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
})

const LightType = mongoose.model('LightType', lightTypeSchema)

module.exports = LightType