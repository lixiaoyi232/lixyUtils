/**
 * 作用：在指定目录创建文件
 * 参数：
 *   pathAndFileName：string， 必填，要保存的路径+文件名
 * 返回值：undifined
 */


"use strict"
const fs = require('fs-extra') 
const path = require('path')


module.exports = async function createFile (pathAndFileName) {
  await fs.createFileSync(path.join(__dirname, pathAndFileName))
}
