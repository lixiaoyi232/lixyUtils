"use strict"
const path = require('path')
const lus = require('./index')

let toTest = {
  downloadFile: async () => {await lus.downloadFile({url: 'https://avatars3.githubusercontent.com/u/31205592'}, path.join(__dirname, `cube.jpg`)); console.log('lus.downloadFile 完成，根目录会出现一张图片（cube.jpg）')},
  excelGetLetter: () => console.log('lus.excelGetLetter: ', lus.excelGetLetter(666)),
  getAgeByIdCard: () => console.log('lus.getAgeByIdCard: ', lus. getAgeByIdCard('11011019870606123X')),
  getBirthdayByIdCard: () => console.log('lus.getBirthdayByIdCard: ', lus. getBirthdayByIdCard('11011019870606123X')),
  sha256: () => console.log('lus.sha256: ', lus. sha256('wodemima')),
  sha256Password: () => console.log('lus.sha256Password: ', lus. sha256Password({account: 13245678910, password: 'wodemima', cTime: new Date()})),
  createExcel: () => console.log('lus.createExcel: ', lus. createExcel([
    {
      headers: [
        {
          label: '姓名',
          callback: (d) => ({v: d.name}),
        },
        {
          label: '年龄',
          callback: (d) => ({v: d.name}),
        },
      ],
      datas: [
        {name: '张三', age: 18},
        {name: '李四', age: 20},
      ],
      sheetName: 'Sheet1'
    }
  ])),
}

let testConfig = {
  downloadFile: false, 
  excelGetLetter: false,
  getAgeByIdCard: false,
  getBirthdayByIdCard: false,
  sha256: false,
  sha256Password: false,
  createExcel: false,
}

; (async () => {for (let i in testConfig) if (testConfig[i]) await toTest[i]()})()








