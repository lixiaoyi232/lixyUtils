/**
 * 作用：sha256加密
 * 参数：
 *   str：string，必填，要加密的字符串
 * 返回值：string，加密后的字符串
 */


"use strict"
let crypto = require('crypto')


module.exports = function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex')
}

