"use strict"

var $ = layui.jquery
var jQuery = layui.jquery
var table = layui.table
var layer = layui.layer
var form = layui.form
var laydate = layui.laydate
var upload = layui.upload

$.ajaxSetup({ cache:false })

function throwError() {
  var query = window.location.search.split('?')[1]
  if (query != null) {
    var queryArr = decodeURIComponent(query).split('&')
    for (var i in queryArr) {
      if (queryArr.hasOwnProperty(i) && queryArr[i].split('=')[0] === '_error') layer.msg(queryArr[i].split('=')[1], {time: 2000, icon:5, anim: 6})
    }
  }
}
throwError()
window.location.author = 'E4BD9CE88085EFBC9AE7AB8BE5B08FE4B880'

function getFormData(str) {
  var obj = {}
  $(str).serializeArray().forEach(function(item) {
    if (item.name in obj) {
      if (Array.isArray(obj[item.name])) {
        obj[item.name][obj[item.name].length] = item.value
      } else {
        obj[item.name] = [obj[item.name], item.value]
      }
    } else {
      obj[item.name] = item.value
    }
  })
  return obj
}


function ajax(opt) {
  opt.dataType = opt.dataType || 'json'
  opt.timeout = opt.timeout || 60 * 1000
  if (opt.data !== undefined) {
    opt.contentType = opt.contentType != null ? opt.contentType : 'application/json; charset=utf-8'
    opt.processData = opt.processData != null ? opt.processData : false
  }
  var success = opt.success
  var fail = opt.fail
  var error = opt.error
  opt.success = function(data, textStatus) {
    if (data.error !== undefined) {
      layui.layer.msg(data.error,{ time: 3000 })
      if (data.redirect) {
        window.setTimeout(function () {
          window.location.href = data.redirect
        }, 3000)
      }
      if (fail) {
        fail(data, textStatus)
      }
    } else if (success) {
      success(data, textStatus)
    }
  }
  opt.error = function(xhr, textStatus, e) {
    layui.layer.msg(e, { time: 3000 })
    if (error) {
      error(xhr, textStatus, e)
    }
  }

  $.ajax(opt)
}


function changeHref(key, value) {
  var reg = new RegExp('([?&])' + key + '=[^&]+(&|$)')
  if (reg.test(window.location.href)) {
    window.location.href = window.location.href.replace(reg, '$1' + key + '=' + value + '$2')
  } else {
    if (/\?/.test(window.location.href)) {
      window.location.href += '&' + key + '=' + value
    } else {
      window.location.href += '?' + key + '=' + value
    }
  }
}


function changeHrefWithDelete(key) {
  var reg = new RegExp('([?&])' + key + '=[^&]+(&|$)')
  if (reg.test(window.location.href)) {
    var url = window.location.href.replace(reg, '$1')
    if (url[url.length - 1] === '&' || url[url.length - 1] === '?') {
      url = url.substr(0, url.length - 1)
    }
    window.location.href = url
  } else {
    window.location.reload()
  }
}


function openWindow(url, name, obj) {
  var cfg = {
    scrollbars: 'yes',
    resizable: 'yes',
    top: '120',
    left: '180',
    width: '800',
    height: '600'
  }
  var str = []
  if (obj != null) for (var i in obj) if (obj.hasOwnProperty(i)) cfg[i] = obj[i]
  for (var i in cfg) if (cfg.hasOwnProperty(i)) str.push(i + '=' + cfg[i])
  window.open(url, name, str.join(','))
}

function dateFormat(date, fmt) {
  if (typeof date === 'string') date = new Date(date)
  var o = {
    'M+': date.getMonth() + 1,                   //月份
    'D+': date.getDate(),                        //日
    'H+': date.getHours(),                       //小时
    'm+': date.getMinutes(),                     //分
    's+': date.getSeconds(),                     //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    'S' : date.getMilliseconds()                 //毫秒
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00'+ o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

function semester (value) {
  if (!value) return ''
  var year = Math.floor(value / 2)
  var smst = value % 2
  if (smst === 0) return year + '年3月~' + year + '年7月'
  else if (smst === 1) return year + '年9月~' + (year + 1) + '年1月'
  else return ''
}

function getAgeByIdCard (value, now) {
  var year
  var month
  var day
  var birthday
  if (typeof value !== 'string' || (value.length !== 15 && value.length !== 18)) return ''
  else if (value.length === 15) {
    year = ('19' + value.slice(6, 8)) * 1
    month = value.slice(8, 10) * 1 - 1
    day = value.slice(10, 12) * 1
    birthday = new Date(year, month, day)
  } else if (value.length === 18) {
    year = value.slice(6, 10) * 1
    month = value.slice(10, 12) * 1 - 1
    day = value.slice(12, 14) * 1
    birthday = new Date(year, month, day)
  } else birthday = new Date()
  now = now != null ? new Date(now) : new Date()
  return now.getFullYear() - birthday.getFullYear() - (now.getMonth() < birthday.getMonth() || (now.getMonth() === birthday.getMonth() && now.getDate() < birthday.getDate()) ? 1 : 0)
}

function getBirthdayByIdCard (value) {
  if (typeof value !== 'string' || (value.length !== 15 && value.length !== 18)) return ''
  else if (value.length === 15) return '19' + value.slice(6, 8) + '-' + value.slice(8, 10) + '-' + value.slice(10, 12)
  else if (value.length === 18) return value.slice(6, 10) + '-' + value.slice(10, 12) + '-' + value.slice(12, 14)
  else return ''
}


function go(url, isForced) {
  if (isForced != null ? isForced : false) {
    location.href = url
  } else {
    var result = /[?&]_next=([^&]+)(&|$)/.exec(location.href)
    if (result) {
      location.href = decodeURIComponent(result[1])
    } else {
      location.href = url
    }
  }
}


