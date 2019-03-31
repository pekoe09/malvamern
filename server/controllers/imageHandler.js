const AWS = require('aws-sdk')
const fs = require('fs')
const fileType = require('file-type')
const bluebird = require('bluebird')
const sharp = require('sharp')
const config = require('../../config/config')

AWS.config.update({
  accessKeyId: config.awsAccessKey,
  secretAccessKey: config.awsSecretAccessKey
})

AWS.config.setPromisesDependency(bluebird)

const s3 = new AWS.S3()

const uploadFile = (buffer, version, timestamp, name) => {
  const nameStart = `${name.replace(/\s/g, '')}-${timestamp}-${version}`

  const params = {
    Body: buffer,
    Bucket: config.s3Bucket,
    ContentType: 'image-jpeg',
    Key: `${nameStart}.jpg`
  }
  return s3.upload(params).promise()
}

const resize = (buffer, height) => {
  return sharp(buffer)
    .resize({
      height,
      withoutEnlargement: true
    })
    .jpeg()
    .toBuffer()
}

const uploadImage = async (path, name) => {
  console.log('uploading path', path)
  const buffer = fs.readFileSync(path)
  const type = fileType(buffer)
  const timestamp = Date.now().toString()
  const versions = {
    original: {
      version: 'or',
      height: null,
      result: null
    },
    large: {
      version: 'lg',
      height: 500,
      result: null
    },
    small: {
      version: 'sm',
      height: 100,
      result: null
    }
  }
  for (var key in versions) {
    let resizedBuffer = await resize(buffer, versions[key].height)
    versions[key].result = await uploadFile(resizedBuffer, key, timestamp, name)
  }
  return versions
}

const downloadImage = async (key) => {
  const params = {
    Bucket: config.s3Bucket,
    Key: key
  }
  const result = await s3.getObject(params).promise()
  return result
}

const deleteImage = async (keyArray) => {
  console.log('key array', keyArray)
  const params = {
    Bucket: config.s3Bucket
  }
  if (keyArray && keyArray.length > 0) {
    keyArray.forEach(async (key) => {
      console.log('aws deleting', key)
      params.Key = key
      let result = await s3.deleteObject(params).promise()
      console.log('aws deletion result', result)
    })
  }
  return null
}

module.exports = {
  uploadImage,
  downloadImage,
  deleteImage
}