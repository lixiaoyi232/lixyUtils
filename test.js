"use strict"
const path = require('path')
const lus = require('./index')

let toTest = {
  downloadFile: async () => {await lus.downloadFile({url: 'https://avatars3.githubusercontent.com/u/31205592'}, path.join(__dirname, `cube.jpg`)); console.log('lus.downloadFile 完成，根目录会出现一张图片（cube.jpg）')},
  excelGetLetter: () => console.log('lus.excelGetLetter: ', lus.excelGetLetter(666)),
  getAgeByIdCard: () => console.log('lus.getAgeByIdCard: ', lus. getAgeByIdCard('11011019870606123X')),
  getBirthdayByIdCard: () => console.log('lus.getBirthdayByIdCard: ', lus. getBirthdayByIdCard('11011019870606123X')),
}

let testConfig = {
  downloadFile: false, 
  excelGetLetter: false,
  getAgeByIdCard: false,
  getBirthdayByIdCard: false,
}

; (async () => {for (let i in testConfig) if (testConfig[i]) await toTest[i]()})()








