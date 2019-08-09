/**
 * 作用：通过身份证号获取年龄（不包含15的位身份证号）
 * 参数：
 *   idCard：     string，必填，身份证号
 *   pointInTime：date，  选填，时间点，截止到该时间点，默认执行函数的时间
 * 返回值：number | null，年龄，参数错误时返回null
 */


"use strict"

module.exports = function getAgeByIdCard(idCard, pointInTime = new Date()) {
  if (!/^[0-9]{17}[0-9X]$/.test(idCard)) return null
  idCard = idCard.toString()
  let year = parseInt(idCard.slice(6, 10))
  let month = parseInt(idCard.slice(10, 12)) - 1
  let day = parseInt(idCard.slice(12, 14))
  let birthday = new Date(year, month, day)
  return pointInTime.getFullYear() - birthday.getFullYear() - (pointInTime.getMonth() < birthday.getMonth() || (pointInTime.getMonth() === birthday.getMonth() && pointInTime.getDate() < birthday.getDate()) ? 1 : 0)
}

