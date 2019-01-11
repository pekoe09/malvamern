const mongoose = require('mongoose')
const monthSchema = require('./month')

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  scientificName: {
    type: String,
    required: true
  },
  heightMin: {
    type: Number,
    required: true,
    min: 0
  },
  heightMax: {
    type: Number,
    min: 0
  },
  widthMin: {
    type: Number,
    required: true,
    min: 0
  },
  widthMax: {
    type: Number,
    min: 0
  },
  plantDistance: {
    type: Number,
    min: 0
  },
  plantDepth: {
    type: Number,
    min: 0
  },
  soiltypes: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    country: {
      name: {
        type: String,
        required: true
      },
      abbreviation: {
        type: String,
        required: true
      }
    }
  }],
  plantingFrom: monthSchema,
  plantingTo: monthSchema,
  floweringFrom: monthSchema,
  floweringTo: monthSchema,
  harvestFrom: monthSchema,
  harvestTo: monthSchema,
  flowerColors: [{
    type: String
  }],
  isPoisonous: {
    type: Boolean
  },
  hasSpikes: {
    type: Boolean
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  environmentRequirements: {
    type: String
  },
  careInstructions: {
    type: String
  }
})

plantSchema.virtual('height').get(function () {
  return this.heightMax ? `${this.heightMin} - ${this.heightMax}` : this.heightMin
})

plantSchema.virtual('width').get(function () {
  return this.widthMax ? `${this.widthMin} - ${this.widthMax}` : this.widthMin
})

plantSchema.virtual('planting').get(function () {
  return this.plantingTo ? `${this.plantingFrom.number} - ${this.plantingTo.number}` : this.plantingFrom.number
})

plantSchema.virtual('flowering').get(function () {
  return this.floweringTo ? `${this.floweringFrom.number} - ${this.floweringTo.number}` : this.floweringFrom.number
})

plantSchema.virtual('harvest').get(function () {
  return this.harvestTo ? `${this.harvestFrom.number} - ${this.harvestTo.number}` : this.harvestFrom.number
})

plantSchema.set('toObject', { virtuals: true })
plantSchema.set('toJSON', { virtuals: true })

const Plant = mongoose.model('Plant', plantSchema)

module.exports = Plant