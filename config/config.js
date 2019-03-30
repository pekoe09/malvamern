if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let port = process.env.PORT
let mongoConnStr = process.env.MONGO_CONN_STR
let awsAccessKey = process.env.AWS_ACCESS_KEY
let awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
let s3Bucket = process.env.S3_BUCKET
let firstUsername = process.env.FIRST_ADMIN_NAME
let firstPassword = process.env.FIRST_ADMIN_PSW

if(process.env.NODE_ENV === 'test') {
  port = process.env.TEST_PORT
  mongoConnStr = process.env.TEST_MONGO_CONN_STR
  s3Bucket = process.env.S3_TEST_BUCKET
}

module.exports = {
  port,
  mongoConnStr,
  awsAccessKey,
  awsSecretAccessKey,
  s3Bucket,
  firstUsername,
  firstPassword
}