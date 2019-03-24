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
  console.log('before aws call')
  console.log(config.awsAccessKey)
  console.log(config.awsSecretAccessKey)
  console.log(params.Bucket)
  return s3.upload(params).promise()
}

const uploadImage = async (path) => {
  console.log('in handler!')
  console.log(fs.readFile)
  const buffer = fs.readFileSync(path)
  console.log('buffer', buffer)
  const type = fileType(buffer)
  console.log('file type', type)
  const timestamp = Date.now().toString()
  const name = `${timestamp}-lg`
  const result = await uploadFile(buffer, name, type)
  return result
}

module.exports = {
  uploadImage
}