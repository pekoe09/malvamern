if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let port = process.env.PORT
let mongoConnStr = process.env.MONGO_CONN_STR

if(process.env.NODE_ENV === 'test') {
  port = process.env.TEST_PORT
  mongoConnStr = process.env.TEST_MONGO_CONN_STR
}

module.exports = {
  port,
  mongoConnStr
}