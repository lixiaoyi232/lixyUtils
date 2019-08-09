"use strict"


window.info = 'E4BD9CE88085EFBC9AE7AB8BE5B08FE4B880'

// 需要事先引入jQuary
function ajax(opt) {
  opt.dataType = opt.dataType || 'json'
  opt.timeout = opt.timeout || 60 * 1000
  if (opt.data !== undefined) {
    opt.contentType = opt.contentType != null ? opt.contentType : 'application/json; charset=utf-8'
    opt.processData = opt.processData != null ? opt.processData : false
  }
  var success = opt.success || function (data, textStatus) {}
  var fail = opt.fail || function (data, textStatus) {}
  var error = opt.error || function (xhr, textStatus, e) {}
  opt.success = function(data, textStatus) {
    if (data.error !== undefined) {
      if (data.redirect) {
        window.setTimeout(function () {
          window.location.href = data.redirect
        }, 3000)
      }
      fail(data, textStatus)
    }
    success(data, textStatus)
  }
  opt.error = function(xhr, textStatus, e) {
    error(xhr, textStatus, e)
  }
  $.ajax(opt)
}


function openWindow(url, name, obj) {
  var cfg = {
    scrollbars: 'yes',
    resizable: 'yes',
    top: '120',
    left: '180',
    width: '1000',
    height: '750'
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
    'S+' : date.getMilliseconds()                 //毫秒
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (((k === 'S+' ? '0' : '') + '00'+ o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

function getAgeByIdCard (idCard, pointInTime = new Date()) {
  if (!/^[0-9]{17}[0-9X]$/.test(idCard)) return null
  idCard = idCard.toString()
  var year = parseInt(idCard.slice(6, 10))
  var month = parseInt(idCard.slice(10, 12)) - 1
  var day = parseInt(idCard.slice(12, 14))
  var birthday = new Date(year, month, day)
  return pointInTime.getFullYear() - birthday.getFullYear() - (pointInTime.getMonth() < birthday.getMonth() || (pointInTime.getMonth() === birthday.getMonth() && pointInTime.getDate() < birthday.getDate()) ? 1 : 0)
}

function getBirthdayByIdCard(idCard, format = 'YYYY-MM-DD') {
  if (!/^[0-9]{17}[0-9X]$/.test(idCard)) return null
  idCard = idCard.toString()
  let year = parseInt(idCard.slice(6, 10))
  let month = parseInt(idCard.slice(10, 12)) - 1
  let day = parseInt(idCard.slice(12, 14))
  let birthday = new Date(year, month, day)
  return dateFormat(birthday, format)
}

// location.href中如果有“_next”参数，则跳转到“_next”参数后的网址，否则跳转到传入的“url”网址
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


