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
  soilTypes: [{
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
  },
  images: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    ordinality: {
      type: Number
    },
    caption: {
      type: String
    },
    awsKey: {
      type: String,
      required: true
    },
    awsKeySmall: {
      type: String
    },
    awsKeyLarge: {
      type: String
    }
  }]
})

plantSchema.virtual('height').get(function () {
  return this.heightMax ? `${this.heightMin} - ${this.heightMax}` : this.heightMin
})

plantSchema.virtual('width').get(function () {
  return this.widthMax ? `${this.widthMin} - ${this.widthMax}` : this.widthMin
})

plantSchema.virtual('planting').get(function () {
  if (this.plantingFrom && this.plantingTo) {
    return `${this.plantingFrom.number} - ${this.plantingTo.number}`
  } else if (this.plantingFrom) {
    return this.plantingFrom
  } else if (this.plantingTo) {
    return this.plantingTo
  } else {
    return null
  }
})

plantSchema.virtual('flowering').get(function () {
  if (this.floweringFrom && this.floweringTo) {
    return `${this.floweringFrom.number} - ${this.floweringTo.number}`
  } else if (this.floweringFrom) {
    return this.floweringFrom
  } else if (this.floweringTo) {
    return this.floweringTo
  } else {
    return null
  }
})

plantSchema.virtual('harvest').get(function () {
  if (this.harvestFrom && this.harvestTo) {
    return `${this.harvestFrom.number} - ${this.harvestTo.number}`
  } else if (this.harvestFrom) {
    return this.harvestFrom
  } else if (this.harvestTo) {
    return this.harvestTo
  } else {
    return null
  }
})

plantSchema.set('toObject', { virtuals: true })
plantSchema.set('toJSON', { virtuals: true })

const Plant = mongoose.model('Plant', plantSchema)

module.exports = Plant