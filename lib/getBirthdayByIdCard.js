/**
 * 作用：通过身份证号获取生日
 * 参数：
 *   idCard：string，必填，身份证号
 *   format：string，选填，格式，默认'YYYY-MM-DD'
 * 返回值：string，生日
 */


"use strict"

const moment = require("moment")

module.exports = function getBirthdayByIdCard(idCard, format = 'YYYY-MM-DD') {
  if (!/^[0-9]{17}[0-9X]$/.test(idCard)) return null
  idCard = idCard.toString()
  let year = parseInt(idCard.slice(6, 10))
  let month = parseInt(idCard.slice(10, 12)) - 1
  let day = parseInt(idCard.slice(12, 14))
  let birthday = new Date(year, month, day)
  return moment(birthday, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format(format)
}

