/**
 * 作用：对密码进行加密
 * 参数：
 *   user：object，必填，用户对象，必须要有account、password、cTime三个属性
 * 返回值：string，加密后的密码
 */


"use strict"
let sha256 = require('./sha256')

let config = {
  passwordSalt: '2019salt',
}

module.exports = function sha256Password(user) {
  return sha256(user.account + user.password + user.cTime.getTime() + config.passwordSalt)
}

