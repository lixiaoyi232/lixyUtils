/**
 * 名称：权限
 * 构造参数：扁平属性与true的键值对组成的对象，list里没有的无效，值不为true的无效
 * 属性：
 *   name：string，权限树根部名称
 *   value：string，值，有权限树组件的表单用
 *   checked：boolean，是否被勾选
 *   getFlat：function，获取全部扁平属性及值
 *   getJSON：function，获取权限树组件使用的数据对象
 *   getSource：function，获取只包含值为true的扁平属性的对象，用于存数据库
 */


"use strict"

let pObj = {
  mem: true,
  mem_i: true,
  mem_d: true,
  mem_fml: true,
  mem_fml_s: true,
}

module.exports = class Permission {
  constructor (pObj = {}) {
    this.name = '所有权限'
    this.value = 'all'
    this.checked = Object.keys(pObj).length > 0 
    let list = {
      mem: {'name': '前台用户管理', 'checked': false, 'list': {
        i: {'name': '增', 'checked': false},
        d: {'name': '删', 'checked': false},
        u: {'name': '改', 'checked': false},
        s: {'name': '查', 'checked': false},
        fml: {'name': '家庭成员', 'checked': false, 'list': {
          i: {'name': '增', 'checked': false},
          d: {'name': '删', 'checked': false},
          u: {'name': '改', 'checked': false},
          s: {'name': '查', 'checked': false},
        }},
      }},
    }
    let source = {}

    // 获取拍平后的对象，即深度为1，键之间用“_”分隔
    this.getFlat = function () {
      let back = {}
      let one = function (o, k) {
        back[k] = o.checked
        if (o.list != null) for (let i in o.list) one(o.list[i], k + '_' + i)
      }
      if (list != null) for (let i in list) one(list[i], i)
      return back
    }.bind(this)

    // 获取权限树所用的JSON对象（object），list属性由对象变为数组，list的属性值变为数组元素的value属性的值
    this.getJSON = function () {
      let back = {name: this.name, value: this.value, checked: this.checked, list: []}
      let one = function (o, k) {
        let l = {name: o.name, value: k, checked: o.checked}
        if (o.list != null) {
          l.list = []
          for (let i in o.list) l.list.push(one(o.list[i], k + '_' + i))
        }
        return l
      }
      if (list != null) for (let i in list) back.list.push(one(list[i], i))
      return back
    }.bind(this)

    // 获取源对象（拍平且值为true的属性）
    this.getSource = function () {return source}.bind(this)

    // 将list里的checked与传入的pObj同步（部分false改为true）
    let flat = this.getFlat()
    for (let i in flat) {
      if (pObj[i] === true) {
        source[i] = true
        let kArr = i.split('_')
        let l = {list}
        for (let j of kArr) l = l.list[j]
        l.checked = true
      }
    }
  }
}

if (true) {
  let a = new module.exports(pObj)
  let b = {}
  b.getFlat = a.getFlat
  console.log(a)
  console.log(b.getFlat())
}
