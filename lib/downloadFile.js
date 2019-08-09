/**
 * 作用：通过url将网上的文件保存到指定目录
 * 参数：
 *   options：        object， 必填，同模块request中get函数所需要的options
 *   pathAndFileName：string， 必填，要保存的路径+文件名
 *   ensureDir：      boolean，可选，是否需要确保要保存的路径的存在，默认true
 * 返回值：undifined
 */


"use strict"
const fs = require('fs-extra')
const path = require('path')
const request = require('request')  


module.exports = async function downloadFile (options, pathAndFileName, ensureDir=true) {
  if (ensureDir) await fs.ensureDir(path.dirname(pathAndFileName))
  await new Promise((resolve, reject) => {
    request.get(options)
    .pipe(fs.createWriteStream(pathAndFileName))
    .on('error', (e) => {
      resolve('')
    })
    .on('finish', () => {
      resolve('ok')
    })
  })
}