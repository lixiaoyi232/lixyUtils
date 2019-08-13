"use strict"
/**
 * 构造函数
 * opt.el      父节点（jquery格式，可以传入#myid）
 * opt.url     获取数据的url
 * opt.limit   每页有多少个数据
 * opt.cols    是一个数组，用于表示表格的列，数组每一项是一个对象，分别具有title和html属性，title属性是列的名字，html是一个函数用于渲染该列中每一个具体的数据，
 *             html函数有一个参数，rowdata，是行数据，html函数必须返回一个jquery对象用于渲染。
 * opt.onFetch 每次获取完数据会执行的回调函数，用户做事件处理的绑定。  参数为rowdatas，是请求后得到的所有杭数据，id为key，一行数据为值。
 * opt.showPagination  是否显示分页器，默认为true。
 */
function MyTable(opt) {
  if (opt.el == null) {
    throw new Error('缺少el项')
  }
  if (opt.limit == null) {
    opt.limit = 10
  }
  if (opt.cols == null) {
    throw new Error('缺少cols项')
  }
  if (opt.showPagination == null) {
    opt.showPagination = true
  }
  if (opt.showPagination) {
    if (opt.url == null) {
      throw new Error('缺少url项')
    }
  }

  var $tr = $('<tr></tr>')
  for (var i = 0; i < opt.cols.length; i++) {
    var col = opt.cols[i]
    $tr.append('<th>' + col.title + '</th>')
  }

  var $thead = $('<thead></thead>')
  $thead.append($tr)

  var $tbody = $('<tbody></tbody>')
  var $table = $('<table></table>')
  $table.append($thead)
  $table.append($tbody)

  var $laypage = $('<div></div>')

  var $el = $(opt.el)
  $el.append($table)

  if (opt.showPagination) {
    $el.append($laypage)
  }

  this.opt = opt
  this.$el = $el
  this.$table = $table
  this.$tbody = $tbody
  this.$laypage = $laypage
  // this.res       请求数据后返回的所有内容
  // this.rowDatas  请求数据后得到的所有行数据，id为key，数据为值。
}

/**
 * 获取数据并刷新表格
 * page     代表获取的数据是第几页数据
 */
MyTable.prototype.fetch = function(page, callback) {
  var self = this
  var page = page || 1
  ajax({
    method: 'GET',
    url: self.opt.url + '?_page=' + page + '&_limit=' + self.opt.limit,
    success: function (res) {
      self.$tbody.empty()
      self.rowDatas = {}
      for (var i = 0; i < res.datas.length; i++) {
        var rowData = res.datas[i]
        self.rowDatas[rowData.id] = rowData
        var $tr = $('<tr data-id="' + rowData.id + '"></tr>')
        for (var j = 0; j < self.opt.cols.length; j++) {
          var col = self.opt.cols[j]
          var $td = $('<td></td>')
          $td.append(col.html(rowData))
          $tr.append($td)
        }
        self.$tbody.append($tr)
      }

      if (self.opt.showPagination) {
        self.$laypage.empty()
        self.$laypage.append('<span>总数:' + res.count + ' 当前在第' + res.page + '页</span>')
        if (res.page > 1) {
          var $a = $('<a href="javascript:;">上一页</a>')
          $a.on('click', function() {
            self.fetch(res.page - 1)
          })
          self.$laypage.append($a)
        }
        if (res.page < res.maxPage) {
          var $a = $('<a href="javascript:;">下一页</a>')
          $a.on('click', function() {
            self.fetch(res.page + 1)
          })
          self.$laypage.append($a)
        }
      }

      self.res = res.res

      if (self.opt.onFetch) {
        self.opt.onFetch(self.rowDatas)
      }

    },
    fail: function () {
    }
  })
}
