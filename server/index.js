const http = require('http')
const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const cors = require('cors')
const path = require('path')
const config = require('../config/config')

app.use(cors())
app.use(bodyparser.json())

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})

app.use((err, req, res, next) => {
  console.log(err.message)  
})

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  console.log('Shutting down server')
})

module.exports = {
  app,
  server
}