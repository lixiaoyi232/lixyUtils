"use strict"

var $ = layui.jquery
var jQuery = layui.jquery
var table = layui.table
var layer = layui.layer
var form = layui.form
var laydate = layui.laydate
var authtree = layui.authtree

$.ajaxSetup({ cache:false })

// query字符串（不包含“?”） 转对象
function queryToObj(query) {
  query = query.split('+-+').join(' - ')
  var queryArr = decodeURIComponent(query).split('&')
  var queryObj = {}
  for (var i in queryArr) {
    if (queryArr.hasOwnProperty(i)) {
      var arr = queryArr[i].split('=');
      queryObj[arr[0]] = arr[1]
    }
  }
  return queryObj
}
window.location.author = 'E4BD9CE88085EFBC9AE7AB8BE5B08FE4B880'

// 设置 query（？参数）
function setQuery(url, obj) {
  var path = url.split('?')[0]
  var query = url.split('?')[1]
  var queryObj = {}
  if (query != null) queryObj = queryToObj(query)
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (obj[i] !== 'null') {
        if (i.slice(0, 4) === '_min' || i.slice(0, 4) === '_max') {
          var str = obj['_min' + i.slice(4)] + '*' + obj['_max' + i.slice(4)]
          if (str !== '*') queryObj[i.slice(4)] = str
          else delete queryObj[i.slice(4)]
        } else if (obj[i] !== '') {
          queryObj[i] = obj[i]
        } else delete queryObj[i]
      }
      else delete queryObj[i]
    }
  }
  if (!!window.ActiveXObject || "ActiveXObject" in window) query = $.param(queryObj)
  else query = decodeURIComponent($.param(queryObj))

  return query.length !== 0 ? path + '?' + query : path
}

function cssTextToObj(str) {
  var arr = str.split(';')
  var obj = {}
  var a
  for (var i in arr) {
    if (arr.hasOwnProperty(i) && arr[i] !== '') {
      a = arr[i].replace(/^\s+|\s+$/g, '').split(':')
      obj[a[0].replace(/^\s+|\s+$/g, '').toLowerCase()] = a[1].replace(/^\s+|\s+$/g, '')
    }
  }
  return obj
}

function objToCssText(obj) {
  var str = ''
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      str += i + ':' + obj[i] + ';'
    }
  }
  return str
}

function setCssText(str, obj) {
  var strObj = {}
  if (str !== '') strObj = cssTextToObj(str)
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (obj[i] !== 'null') {
        if (obj[i] !== '') {
          strObj[i] = obj[i]
        } else delete strObj[i]
      } else delete strObj[i]
    }
  }
  return objToCssText(strObj)
}

function mIfRender() {
  var mIfs = $('[m-if]')
  for (var i = 0; i < mIfs.length; i++) {
    var condition = eval($(mIfs[i]).attr('m-if'))
    if (condition) $(mIfs[i]).css('cssText', setCssText($(mIfs[i])[0].style.cssText, {display: 'null'}))
    else $(mIfs[i]).css('cssText', setCssText($(mIfs[i])[0].style.cssText, {display: 'none!important'}))
    var next = $(mIfs[i]).next()
    var goOn = next.attr('m-else-if') != null || next.attr('m-else') != null
    var isElse
    while (goOn) {
      isElse = next.attr('m-else') != null ? true : false
      if (condition) {
        next.css('cssText', setCssText($(mIfs[i])[0].style.cssText, {display: 'none!important'}))
      } else {
        condition = isElse ? true : eval(next.attr('m-else-if'))
        if (condition) next.css('cssText', '')
        else next.css('cssText', setCssText($(mIfs[i])[0].style.cssText, {display: 'none!important'}))
      }
      next = next.next()
      goOn = !isElse && (next.attr('m-else-if') != null || next.attr('m-else') != null)
    }
  }
}

function mBindRender() {
  for (var i = 0; i < document.all.length; i++) {
    var element = document.all[i]
    var attrs = element.attributes
    if (attrs) {
      for (var j = 0; j < attrs.length; j++) {
        var attr = attrs[j]
        if (attr.specified && attr.name[0] === 'm' && attr.name[1] === ':') {
          var attrName = attr.name.substr(2)
          var attrValue = eval('(' + attr.value + ')')
          if (attrName === 'class' && typeof attrValue === 'object') {
            var $el = $(element)
            for (var n in attrValue) {
              if (attrValue.hasOwnProperty(n)) {
                if (attrValue[n]) {
                  $el.addClass(n)
                } else {
                  $el.removeClass(n)
                }
              }
            }
          } else {
            element.setAttribute(attrName, attrValue)       // 源生 attr
            element[attrName] = attrValue                   // 源生 prop
            // $(element).attr(attrName, attrValue)           // jq attr
          }
        }
      }
    }
  }
}

function repliceBracket(str) {
  var arr = []
  while (str.indexOf('[[') !== -1) {
    arr = str.split('')
    arr.splice(str.indexOf('[['), 2, '{{')
    str = arr.join('')
  }
  while (str.indexOf(']]') !== -1) {
    arr = str.split('')
    arr.splice(str.indexOf(']]'), 2, '}}')
    str = arr.join('')
  }
  return str
}

function fullDate(str) {
  switch (str.length) {
    case 4: {
      return (new Date(str + '-01-01T00:00:00')).valueOf()
    }
    case 7: {
      return (new Date(str + '-01T00:00:00')).valueOf()
    }
    case 10: {
      return (new Date(str + 'T00:00:00')).valueOf()
    }
    default: {
      return (new Date(str)).valueOf()
    }
  }
}

function copy(obj1, obj2, d) {
  d = d != null ? d : 10
  if (Array.isArray(obj2)) {
    obj1 = obj2
  } else {
    for (var i in obj2) {
      if (obj2.hasOwnProperty(i)) {
        if (typeof obj2[i] !== 'object') obj1[i] = obj2[i]
        else if (Array.isArray(obj2[i])) {
          obj1[i] = obj2[i]
        } else {
          if (d > 1) copy(obj1[i], obj2[i], d - 1)
          else obj1[i] = obj2[i]
        }
      }
    }
  }
}

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

