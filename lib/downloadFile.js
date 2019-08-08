"use strict"
let fs = require('fs-extra')
let path = require('path')
let request = require('request')


module.exports = async function downloadFile (opts, pathAndFileName) {
  await fs.ensureDir(path.dirname(pathAndFileName))
  await new Promise((resolve, reject) => {
    request.get(opts)
    .pipe(fs.createWriteStream(pathAndFileName))
    .on('error', (e) => {
      resolve('')
    })
    .on('finish', () => {
      resolve('ok')
    })
  })
}