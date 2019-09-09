"use strict"
const path = require('path')
const lus = require('./index')

// 同时执行多个异步操作
async function asyncFun_1(p) {}
let arr_1 = []
let list_1 = []
for (let i of arr_1) list_1.push(asyncFun_1(i))
while (list_1.length > 0) await Promise.all(list_1.splice(0, 10))

// 批量创建含有指定内容的文件
let dirs = await fs.readdir(path.join(__dirname, './llz'))
dirs = dirs.filter(item => !isNaN(item)).map(item => parseInt(item))
dirs = dirs.sort((x, y) => x - y)
for (let i in dirs) {
  let imgs = await fs.readdir(path.join(__dirname, `./llz/${dirs[i]}`))
  imgs = imgs.filter(item => item.endsWith('.jpg'))
  await fs.createFileSync(`./llz/${dirs[i]}/index.html`)
  let str = `<!DOCTYPE html><html lang="zh-cn"><head><title>${dirs[i]}</title></head><body style="display: flex; align-items: center; flex-flow: column;">`
  if (i !== '0') str += `<button style="width: 80vw; height: 200px; font-size: 50px;" onclick="window.location.href='${path.join(__dirname, './llz/' + dirs[i - 1] + '/index.html')}'">上一话</button>`
  for (let j of imgs) str += `<img src="./${j}" style="width: 80vw; border: solid 1px black;">`
  // console.log('i: ', i)    
  if (i !== dirs.length - 1 + '') str += `<button style="width: 80vw; height: 200px; font-size: 50px;" onclick="window.location.href='${path.join(__dirname, './llz/' + dirs[parseInt(i) + 1] + '/index.html')}'">下一话</button>`  
  str += '</body></html>' 
  await fs.outputFileSync(`./llz/${dirs[i]}/index.html`, str)
}




