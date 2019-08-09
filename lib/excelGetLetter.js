/**
 * 作用：在excel表中，知道第几列，获取列标
 * 参数：
 *   num：number，必填，第几列
 * 返回值：string | null，每个字符都是大写字母，参数不正确时返回null
 */


"use strict"


module.exports = function excelGetLetter (num) {
  let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (!/^\d+$/.test(num)) return null
  num = parseInt(num) 
  let str = letters[(num - 1) % 26]
  num = Math.floor((num - 1) / 26)
  while (num > 0) {
    str = letters[(num - 1) % 26] + str
    num = Math.floor((num - 1) / 26)
  }
  return str
}

