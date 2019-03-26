const AWS = require('aws-sdk')
const fs = require('fs')
const fileType = require('file-type')
const bluebird = require('bluebird')
const config = require('../../config/config')

AWS.config.update({
  accessKeyId: config.awsAccessKey,
  secretAccessKey: config.awsSecretAccessKey
})

AWS.config.setPromisesDependency(bluebird)

const s3 = new AWS.S3()

const uploadFile = (buffer, name, type) => {
  const params = {
    Body: buffer,
    Bucket: config.s3Bucket,
    ContentType: type.mime,
    Key: `${name}.${type.ext}`
  }
  return s3.upload(params).promise()
}

// const downloadFile = (key) => {
//   const params = {
//     Bucket: config.s3Bucket,
//     Key: key
//   }
//   return s3.getObject(params).promise()
// }

const uploadImage = async (path) => {
  const buffer = fs.readFileSync(path)
  const type = fileType(buffer)
  const timestamp = Date.now().toString()
  const name = `${timestamp}-lg`
  const result = await uploadFile(buffer, name, type)
  return result
}

const downloadImage = async (key) => {
  const params = {
    Bucket: config.s3Bucket,
    Key: key
  }
  var imgStream = s3.getObject(params).createReadStream()
  return imgStream
}

module.exports = {
  uploadImage,
  downloadImage
}