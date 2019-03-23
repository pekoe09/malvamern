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
    ACL: 'public-read',
    Body: buffer,
    Bucket: config.s3Bucket,
    ContentType: type.mime,
    Key: `${name}.${type.ext}`
  }
  return s3.upload(params).promise()
}

const uploadImage = async (path) => {
  const buffer = await fs.readFile(path)
  const type = fileType(buffer)
  const timestamp = Date.now().toString()
  const name = `${timestamp}-lg`
  const result = await uploadFile(buffer, name, type)
  return result
}

module.exports = {
  uploadImage
}