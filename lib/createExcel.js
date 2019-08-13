/**
 * 作用：sha256加密
 * 参数：
 *   str：string，必填，要加密的字符串
 * 返回值：string，加密后的字符串
 */
// let cfg = [
//   {
//     headers: [
//       {
//         label: 'ID',
//         callback: (d: any) => ({v: d.id})
//       },
//       {
//         label: '提交时间',
//         callback: (d: any) => ({v: date(d.publishTime, 'YYYY-MM-DD HH:mm:ss')})
//       },
//     ],
//     datas: ctx.body.data,
//     sheetName: 'Sheet1'
//   }
// ]
// // 通过浏览器下载
// ctx.set('Content-Type', 'application/vnd.openxmlformats')
// ctx.set('Content-Disposition', 'attachment; filename=' + uuid22() + '.xlsx')
// ctx.body = createExcel(cfg)

"use strict"
let XLSX = require('xlsx')

module.exports = function createExcel(cfg) {
  let wb = {SheetNames: [], Sheets: {}}
  for (let i of cfg) {
    wb.SheetNames.push(i.sheetName)
    let cell = {}
    for (let j in i.headers) {
      cell[XLSX.utils.encode_col(parseInt(j)) + 1] = {v: i.headers[j].label}
      for (let k in i.datas) {
        cell[XLSX.utils.encode_col(parseInt(j)) + (parseInt(k) + 2)] = i.headers[j].callback(i.datas[k])
      }
    }
    cell['!ref'] = `A1:${XLSX.utils.encode_col(i.headers.length - 1)}${i.datas.length + 1}`
    wb.Sheets[i.sheetName] = cell
  }
  return XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'buffer'})
}

