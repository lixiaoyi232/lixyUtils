/**
 * 作用：修改指定目录的文件的内容
 * 参数：
 *   pathAndFileName：string， 必填，要修改文件的路径+文件名
 *   content：        string， 必填，文件的内容
 * 返回值：undifined
 */


"use strict"
const fs = require('fs-extra') 
const path = require('path')


module.exports = async function changeFile (pathAndFileName, content) {
  await fs.outputFileSync(path.join(__dirname, pathAndFileName), content)
}