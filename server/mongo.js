const mongoose = require('mongoose')
const config = require('../config/config')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

console.log('Connecting to database...')
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.connect(config.mongoConnStr, {useNewUrlParser: true})
mongoose.Promise = global.Promise
console.log('...connected!')

close = () => {
  mongoose.connection.close()
  console.log('Database connection closed')
}

module.exports = { close }