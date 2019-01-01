const http = require('http')
const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const cors = require('cors')
const path = require('path')
const config = require('../config/config')
const mongo = require('./mongo')

const { tokenExtractor } = require('./utils/tokenExtractor')
const { userExtractor } = require('./utils/userExtractor')

const countryRouter = require('./controllers/countryController')
const growthZoneRouter = require('./controllers/growthZoneController')
const lightTypeRouter = require('./controllers/lightTypeController')
const soilTypeRouter = require('./controllers/soilTypeController')
const userRouter = require('./controllers/userController')

app.use(cors())
app.use(bodyparser.json())
app.use(tokenExtractor)
app.use(userExtractor)

app.use('/api/countries', countryRouter)
app.use('/api/growthzones', growthZoneRouter)
app.use('/api/lighttypes', lightTypeRouter)
app.use('/api/soiltypes', soilTypeRouter)
app.use('/api/users', userRouter)

app.use(express.static(path.resolve(__dirname, '../client/build')))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})

app.use((err, req, res, next) => {
  console.log(err.message)
  if (err.isBadRequest) {
    res.status(400).json({ error: err.message })
  } else if (err.isUnauthorizedAttempt) {
    res.status(401).json({ error: err.message })
  } else if (err.isForbidden) {
    res.status(403).json({ error: err.message })
  } else {
    res.status(500).json({ error: 'Something has gone wrong' })
  }
})

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  console.log('Shutting down server')
  mongo.close()
})

module.exports = {
  app,
  server
}