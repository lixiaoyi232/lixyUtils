// 注意：属性名为class的，属性名都必须加引号。例：{'class': 'myclass'}
// 使用：导入该js文件，在html代码中加入<div id="myTable"></div>用于存放表单，在script标签中执行newTable(config)即可

// config例子
// 简
// {
//   table: {
//     config: {
//       elem: '#admin',
//       url: '/admin/admin/admin/table',
//       cols: [
//         [
//           {field: 'id', title: 'ID'},
//           {fixed: 'right', toolbar: '#operation'}
//         ]
//       ]
//     }
//   }
// }
// 繁
// {
//   parent: '#myTable',
//   type: 'table',
//   btns: {
//     'class': 'class1 class2',
//     items: [
//       'new',
//       'dels',
//       'setCols',
//       {
//         layEvent: 'new',
//         'class': 'layui-btn-normal',
//         label: '新建',
//         event: function (obj, config, render) {render(config)}
//       }
//     ]
//   },
//   search: {
//     layFilter: 'search',
//     'class': '',
//     labelWidth: '80',
//     val: {
//       name: '名字1'
//     },
//     done: function () {},
//     submit: {
//       layFilter: 'myFormSubmit',
//       'class': 'layui-btn-normal',
//       show: true,
//       inline: false,
//       float: 'left',
//       label: '提交',
//       event: function (data, config, render) {render(config)}
//     },
//     items: [
//       {
//         label: '姓名',
//         show: true,
//         inline: true,
//         elements: {
//           eType: 'input',
//           type: 'text',
//           name: 'name',
//           display: 'inline',  // block：占整行、inline：占部分
//           placeholder: '请输入……',
//           autocomplete: 'off',  // off：关，on：开
//           'class': '',
//           layVerify: 'required|iphon',
//           events: [
//             {
//               name: 'change',
//               callback: function (e) {}
//             }
//           ]
//         }
//       },
//       {
//         label: '测试',
//         show: true,
//         inline: true,
//         elements: [
//           {
//             eType: 'textarea',
//             type: 'text',
//             name: 'test1',
//             display: 'inline',  // block：占整行、inline：占部分
//             placeholder: '请输入……',
//             autocomplete: 'off',  // off：关，on：开
//             'class': '',
//             layVerify: 'required|iphon',
//             rows: '5',
//             events: []
//           },
//           {
//             eType: 'select',
//             name: 'test2',
//             layFilter: 'select',
//             display: 'inline',
//             'class': '',
//             layVerify: 'required|iphon',
//             laySearch: true,
//             option: [
//               {value: 'null', label: '请选择', disabled: true},
//               {value: 'all', label: '全部', selected: true},
//               {value: '0', label: '选项0'},
//               {value: '1', label: '选项1'},
//             ],
//             events: [
//               {
//                 name: 'laySelect',
//                 callback: function (data) {}
//               }
//             ]
//           },
//           {
//             eType: 'between',
//             name: 'test3',
//             children: [
//               {
//                 type: 'text',
//                 placeholder: '',
//                 autocomplete: 'off',
//                 'class': '',
//                 layVerify: '',
//                 events: []
//               },
//               {
//                 type: 'text',
//                 placeholder: '',
//                 autocomplete: 'off',
//                 'class': '',
//                 layVerify: '',
//                 events: []
//               }
//             ]
//           },
//           {
//             eType: 'date',
//             name: 'test4',
//             display: 'inline',
//             id: 'test4',
//             range: false,
//             placeholder: '-',
//             'class': '',
//             layVerify: '',
//             events: []
//           },
//           {
//             eType: 'char',
//             name: 'test5',
//             element: '<div style="">test5</div>',
//             display: 'inline',
//             events: ele.events != null ? ele.events : []
//           }
//         ]
//       }
//     ],
//     verify: {
//       select: function (value) {
//         if (value === '' || value === 'null') return '必填项不能为空'
//       }
//     }
//   },
//   table: {
//     layFilter: 'admin',
//     tool: {
//       items: [
//         'info',
//         'edit',
//         'del',
//         {
//           layEvent: 'del',
//           'class': 'layui-btn-primary',
//           label: '按钮',
//           event: function (obj, config, render) {render(config)}
//         }
//       ]
//     },
//     lineStyle: [
//       {
//         condition: 'd.name === \'学生1\' && count > 10 || curr === 1 && table.code === 0',  // res: table请求的返回值，curr:当前页码，count:数据总数，d:当前行数据
//         style: {
//           color: 'red',
//           backgroundColor: '#dff'
//         }
//       }
//     ],
//     templates: [
//       {
//         id: 'ct',  // 不能与cols中的field重复
//         content: '[[# var createdTime = dateFormat(new Date(d.createdTime), \'YYYY-MM-DD HH:mm:ss\') ]][[ createdTime ]]'
//       }
//     ],
//     checkboxType: 'checkbox',  // checkbox、radio、none
//     checkboxShow: true,
//     checkbox: function (obj, config, render) {render(config)},
//     config: {
//       elem: '#admin',
//       id: 'admin',
//       url: '/admin/admin/admin/table',
//       toolbar: 'toolbar',
//       hright: 'full',
//       page: true,
//       colsMinWidth: 80,
//       cols: [
//         [
//           {field: 'id', title: 'ID', name: 'ID', sort: true, width: 80, minWidth: 80, maxWidth: 80, show: true, align: 'center'},
//           {fixed: 'right', align: 'center', toolbar: '#operation'}
//         ]
//       ],
//       done: function (res, curr, count, config, render) {}
//     }
//   }
// }

if (_resize_arr == null) var _resize_arr = {}

// 构造函数
function TableComponent(config) {
  var value = ''
  var cfg = {}
  var self = this
  var sto
  this.fullBtnsItems = function (items) {
    for (var i in items) {
      if (items.hasOwnProperty(i)) {
        if (typeof items[i] === 'string') items[i] = {layEvent: items[i]}
        if (typeof items[i] !== 'object') throw new Error('btns.items[' + i + ']的类型错误，只能是string和object')
        switch (items[i].layEvent) {
          case 'new':
            items[i] = {
              layEvent: items[i].layEvent,
              'class': items[i]['class'] != null ? items[i]['class'] : 'layui-btn-normal',
              label: items[i].label != null ? items[i].label : '新建',
              event: items[i].event != null ? items[i].event : function (obj, config, render) {
                var path = config.url.split('?')[0]
                path = (path[path.length - 1] === '/' ? path.slice(0, path.length - 6) : (path.slice(0, path.length - 5)))
                // window.location.href = path + 'new'
                window.tableRender = render
                layer.open({
                  type: 2,
                  title: '新建',
                  shade: 0.8,
                  area: ['90%', '90%'],
                  content: path + 'new'
                })
              }
            }
            break
          case 'dels':
            items[i] = {
              layEvent: items[i].layEvent,
              'class': items[i]['class'] != null ? items[i]['class'] : 'layui-btn-danger',
              label: items[i].label != null ? items[i].label : '批量删除',
              event: items[i].event != null ? items[i].event : function (obj, config, render) {
                var data = table.checkStatus(config.id).data
                var items = []
                for (var i in data) {
                  if (data.hasOwnProperty(i)) {
                    items.push(data[i].id)
                  }
                }
                var path = config.url.split('?')[0]
                path = (path[path.length - 1] === '/' ? path.slice(0, path.length - 6) : (path.slice(0, path.length - 5)))
                layer.confirm('真的删除么', function(index){
                  ajax({
                    method: 'POST',
                    url: path + 'delete',
                    data: JSON.stringify(items),
                    success: function () {
                      layer.msg('批量删除成功', {time: 2000, icon:6})
                      render()
                      layer.close(index)
                    }
                  })
                })
              }
            }
            break
          case 'setCols':
            items[i] = {
              layEvent: items[i].layEvent,
              'class': items[i]['class'] != null ? items[i]['class'] : 'layui-btn-primary',
              label: items[i].label != null ? items[i].label : '设置',
              event: items[i].event != null ? items[i].event : function (obj, config, render) {
                var cols = config.colsOriginal[0]
                var str = '<div style="margin: 10px 0; display: inline-block;"><button class="layui-btn layui-btn-warm" style="height: 28px; padding: 0 15px; line-height: 28px;" onClick="$(\'#onlyOneForm input\').prop(\'checked\', true);$(\'#onlyOneForm .layui-form-checkbox\').addClass(\'layui-form-checked\')">全选</button></div><div style="margin: 10px 0; display: inline-block;"><button class="layui-btn layui-btn-primary" style="height: 28px; padding: 0 15px; line-height: 28px;" onClick="$(\'#onlyOneForm input\').prop(\'checked\', false);$(\'#onlyOneForm .layui-form-checkbox\').removeClass(\'layui-form-checked\')">全不选</button></div><form class="layui-form" id="onlyOneForm" lay-filter="onlyOneForm" action="">'
                for (var i in cols) {
                  if (cols.hasOwnProperty(i)) {
                    str += '<input type="checkbox" name="' + cols[i].name + '" title="' + cols[i].title + '" lay-skin="primary"'
                    if (cols[i].show) str += ' checked'
                    str += '>'
                  }
                }
                str += '</form><script>(function () {form.render(null, \'onlyOneForm\')})()</script>'
                layer.confirm(str, {btn: ['确认','取消'], title: '设置'}, function(index){
                  var cols = config.colsOriginal[0]
                  var list = getFormData('#onlyOneForm')
                  for (var i in cols) if (cols.hasOwnProperty(i)) config.colsOriginal[0][i].show = false
                  for (var i in list) if (list.hasOwnProperty(i)) {
                    for (var j in cols) {
                      if (cols.hasOwnProperty(j) && cols[j].name === i) {
                        config.colsOriginal[0][j].show = true
                        break
                      }
                    }
                  }
                  render(config)
                  layer.close(index)
                })
              }
            }
            break
          default:
            items[i] = {
              layEvent: items[i].layEvent,
              'class': items[i]['class'] != null ? items[i]['class'] : 'layui-btn-primary',
              label: items[i].label != null ? items[i].label : '按钮',
              event: items[i].event != null ? items[i].event : function (obj, config, render) {console.log('按钮' + items[i].layEvent + '被点了')}
            }
            break
        }
        items[i]['class'] = repliceBracket(items[i]['class'])
        items[i].label = repliceBracket(items[i].label)
      }
    }
  }
  this.fullToolItems = function (config) {
    var items = config.table.tool.items
    for (var i in items) {
      if (items.hasOwnProperty(i)) {
        if (typeof items[i] === 'string') items[i] = {layEvent: items[i]}
        if (typeof items[i] !== 'object') throw new Error('table.tool.items[' + i + ']的类型错误，只能是string和object')
        switch (items[i].layEvent) {
          case 'info':
            items[i] = {
              layEvent: items[i].layEvent,
              'class': items[i]['class'] != null ? items[i]['class'] : 'layui-btn-primary',
              label: items[i].label != null ? items[i].label : '详情',
              event: items[i].event != null ? items[i].event : function (obj, config, render) {
                var path = config.url.split('?')[0]
                path = (path[path.length - 1] === '/' ? path.slice(0, path.length - 6) : (path.slice(0, path.length - 5)))
                // openWindow(path + obj.data.id + '/info')
                layer.open({
                  type: 2,
                  title: '详情',
                  shade: 0.8,
                  area: ['90%', '90%'],
                  content: path + obj.data.id + '/info'
                })
              }
            }
            break
          case 'edit':
            items[i] = {
              layEvent: items[i].layEvent,
              'class': items[i]['class'] != null ? items[i]['class'] : 'layui-btn-primary',
              label: items[i].label != null ? items[i].label : '编辑',
              event: items[i].event != null ? items[i].event : function (obj, config, render) {
                var path = config.url.split('?')[0]
                path = (path[path.length - 1] === '/' ? path.slice(0, path.length - 6) : (path.slice(0, path.length - 5)))
                // window.location.href = path + obj.data.id
                // openWindow(path + obj.data.id)
                window.tableRender = render
                layer.open({
                  type: 2,
                  title: '编辑',
                  shade: 0.8,
                  area: ['90%', '90%'],
                  content: path + obj.data.id
                })
              }
            }
            break
          case 'del':
            items[i] = {
              layEvent: items[i].layEvent,
              'class': items[i]['class'] != null ? items[i]['class'] : 'layui-btn-danger',
              label: items[i].label != null ? items[i].label : '删除',
              event: items[i].event != null ? items[i].event : function (obj, config, render) {
                var path = config.url.split('?')[0]
                path = (path[path.length - 1] === '/' ? path.slice(0, path.length - 6) : (path.slice(0, path.length - 5)))
                layer.confirm('真的删除行么', function(index){
                  ajax({
                    method: 'DELETE',
                    url: path + obj.data.id,
                    success: function () {
                      layer.msg('删除成功', {time: 2000, icon:6})
                      render()
                      layer.close(index)
                    }
                  })
                })
              }
            }
            break
          default:
            items[i] = {
              layEvent: items[i].layEvent,
              'class': items[i]['class'] != null ? items[i]['class'] : 'layui-btn-primary',
              label: items[i].label != null ? items[i].label : '按钮',
              event: items[i].event != null ? items[i].event : function (obj, config, render) {console.log('按钮' + items[i].layEvent + '被点了')}
            }
            break
        }
        items[i]['class'] = repliceBracket(items[i]['class'])
        items[i].label = repliceBracket(items[i].label)
      }
    }
  }
  this.fullCols = function (cols) {
    for (var i in cols) {
      if (cols.hasOwnProperty(i)) {
        if (cols[i].width != null) cols[i].myWidth = cols[i].width
        if (cols[i].name == null) cols[i].name = cols[i].field
        if (cols[i].show == null) cols[i].show = true
        if (cols[i].toolbar != null) {
          if (config.table.tool != null) config.table.tool.id = cols[i].toolbar.slice(1)
          else throw new Error('newTabel中上传的配置对象的table.tool不能为null')
          if (cols[i].name == null) cols[i].name = 'operation'
          if (cols[i].title == null) cols[i].title = '操作'
        }
      }
    }
  }
  this.backSearch = function (config) {
    if (config.search != null && config.search.items != null) {
      var search = {
        layFilter: config.search.layFilter != null ? config.search.layFilter : config.table.config.elem.slice(1) + 'Search',
        'class': config.search['class'] != null ? config.search['class'] : '',
        labelWidth: config.search.labelWidth != null ? config.search.labelWidth : '80',
        val: config.search.val != null ? config.search.val : {},
        items: config.search.items,
        verify: config.search.verify != null ? config.search.verify : {}
      }
      var submit = config.search.submit
      if (submit != null) search.submit = {
        layFilter: submit.layFilter != null ? submit.layFilter : config.search.layFilter + 'Submit',
        inline: submit.inline != null ? submit.inline : true,
        'class': submit['class'] != null ? submit['class'] : 'layui-btn-normal',
        float: submit.float != null ? submit.float : 'right',
        label: submit.label != null ? submit.label : '搜索',
        event: submit.event != null ? submit.event : function (data, config, render) {
          render(config)
        }
      }
      else search.submit = {
        layFilter: search.layFilter + 'Submit',
        inline: true,
        'class': 'layui-btn-normal',
        float: 'right',
        label: '搜索',
        event: function (data, config, render) {
          render(config)
        }
      }
      return search
    }
  }
  this.backTablePage = function (p) {
    var page = {
      curr: 1,
      limit: 10,
      limits: [10, 20, 50, 100]
    }
    if (p === false) return false
    else for (var i in p) if (p.hasOwnProperty(i)) page[i] = p[i]
    return page
  }
  this.backTableConfig = function (c) {
    var back = {
      elem: c.elem,
      id: c.id != null ? c.id : c.elem.slice(1),
      url: c.url,
      toolbar: c.toolbar != null ? c.toolbar : c.elem + 'Toolbar',
      height: c.height,
      page: this.backTablePage(c.page),
      colsMinWidth: c.colsMinWidth != null ? c.colsMinWidth : 80,
      colsOriginal: [[]],
      done: function (res, curr, count) {
        var curr2 = Math.ceil(count / cfg.table.config.page.limit)
        if (curr2 === 0) curr2 = 1
        cfg.table.config.page.limit = res.limit * 1
        cfg.table.config.page.curr = Math.min(curr2, curr)
        if (curr2 < curr) {
          self.render()
          return false
        }
        if (res.error !== undefined) layer.msg(res.error,{ time: 1000 })
        else self.addLineStyle(res, curr, count)
        $(window).off('resize', _resize_arr[cfg.parent])
        _resize_arr[cfg.parent] = function () {
          clearTimeout(sto)
          sto = setTimeout(function () {self.render()}, 100)
        }
        $(window).on('resize', _resize_arr[cfg.parent])
        if (c.done != null) c.done.call(this, res, curr, count, self.getConfig(), function (c) {
          if (c != null) copy(cfg.table.config, c)
          self.updateToHtml()
        })
        else console.log('table渲染完之后什么都不做')
        layer.close(cfg.firstIndex)
      }
    }
    var item
    for (var i in c.cols[0]) {
      if (c.cols[0].hasOwnProperty(i)) {
        var element = c.cols[0][i]
        item = {}
        for (var j in element) if (element.hasOwnProperty(j)) item[j] = element[j]
        back.colsOriginal[0].push(item)
      }
    }
    return back
  }
  this.backTable = function (config) {
    return {
      layFilter: config.table.layFilter != null ? config.table.layFilter : config.table.config.elem.slice(1),
      checkboxType: config.table.checkboxType != null ? config.table.checkboxType : 'checkbox',
      checkboxShow: config.table.checkboxShow != null ? config.table.checkboxShow : true,
      tool: config.table.tool != null ? config.table.tool : null,
      lineStyle: config.table.lineStyle != null ? config.table.lineStyle : [],
      templates: config.table.templates != null ? config.table.templates : [],
      checkbox: config.table.checkbox != null ? config.table.checkbox : function () {},
      config: this.backTableConfig(config.table.config)
    }
  }
  this.fullConfig = function (config) {
    if (config != null) {
      if (config.btns != null && config.btns.items != null) this.fullBtnsItems(config.btns.items)
      if (config.table.tool != null && config.table.tool.items != null) this.fullToolItems(config)
      this.fullCols(config.table.config.cols[0])
      cfg =  {
        parent: config.parent != null ? config.parent : '#myTable',
        type: config.type != null ? config.type : 'table',
        btns: config.btns != null ? {
          'class': config.btns['class'] != null ? config.btns['class'] : '',
          items: config.btns.items
        } : null,
        search: this.backSearch(config),
        table: this.backTable(config)
      }
      this.addCheckbox()
    }
  }
  this.addBtns = function () {
    if (cfg.btns != null && cfg.btns.items != null) {
      value += '<div class="layui-btn-container ' + cfg.btns['class'] + '">'
      var items = cfg.btns.items
      for (var i in items) {
        if (items.hasOwnProperty(i)) {
          var item = items[i]
          value += '<button class="layui-btn ' + item['class'] + '" lay-event="' + item.layEvent + '" style="min-width: 100px;" type="button">' + item.label + '</button>'
        }
      }
      value += '</div>'
    }
  }
  this.addSearch = function () {
    if (cfg.search != null && cfg.search.items != null) {
      value += '<div id="' + cfg.search.layFilter + '"></div>'
    }
  }
  this.addToolbar = function () {
    value += '<script type="text/html" id="' + cfg.table.config.toolbar.slice(1) + '">'
    this.addBtns()
    this.addSearch()
    value += '</script>'
  }
  this.addTable = function () {
    var table = cfg.table
    value += '<table id="' + table.config.elem.slice(1) + '" lay-filter="' + table.layFilter + '"></table>'
  }
  this.addTool = function () {
    if (cfg.table.tool != null && cfg.table.tool.items != null) {
      value += '<style>.layui-btn+.layui-btn {margin-left: 0px;}</style><script type="text/html" id="operation">'
      var items = cfg.table.tool.items
      for (var i in items) {
        if (items.hasOwnProperty(i)) {
          value += '<a class="layui-btn layui-btn-xs ' + items[i]['class'] + '" lay-event="' + items[i].layEvent + '">' + items[i].label + '</a>'
        }
      }
      value += '</script>'
    }
  }
  this.addTemplates = function () {
    var tpls = cfg.table.templates
    for (var i in tpls) {
      if (tpls.hasOwnProperty(i)) {
        value += '<script type="text/html" id="' + tpls[i].id + '">' + repliceBracket(tpls[i].content) + '</script>'
      }
    }
  }
  this.addCheckbox = function () {
    switch (cfg.table.checkboxType) {
      case 'checkbox': {
        cfg.table.config.colsOriginal[0].unshift({name: 'onlyOneCheckbox', type:'checkbox', fixed: 'left', show: cfg.table.checkboxShow, title: '复选框', width: 60, myWidth: 60})
        break
      }
      case 'radio': {
        cfg.table.config.colsOriginal[0].unshift({name: 'onlyOneCheckbox', type:'radio', fixed: 'left', show: cfg.table.checkboxShow, title: '单选框', width: 60, myWidth: 60})
        break
      }
    }

  }
  this.updateToHtml = function () {
    $(cfg.parent).html('')
    $(cfg.parent).html(value)
    if (cfg.type === 'layer') $(cfg.parent).parent().css('overflowY', 'scroll')
    this.render()
    var config = cfg.table.config
    table.on('sort(' + cfg.table.layFilter + ')', function (obj) {
      var queryObj = {order: null}
      switch (obj.type) {
        case 'asc':
          queryObj.order = '' + obj.field
          break;
        case 'desc':
          queryObj.order = '-' + obj.field
          break;
      }
      // config.page = 1
      config.url = setQuery(config.url, queryObj)
      self.render()
      self.addSort(obj)
    })
    table.on('checkbox(' + config.id + ')', function(obj){
      cfg.table.checkbox.call(this, obj, self.getConfig(), function (c) {
        if (c != null) for (var i in c) if (c.hasOwnProperty(i)) cfg.table.config[i] = c[i]
        self.render()
      })
    })
  }
  this.addSort = function (obj) {
    var eles = $('th[data-field] .layui-table-sort.layui-inline')
    for (var i = 0; i < eles.length; i++) if ($(eles[i]).parent().parent().attr('data-field') === obj.field) $(eles[i]).attr('lay-sort', obj.type)
  }
  this.addLineStyle = function (res, curr, count) {
    var lineStyle = cfg.table.lineStyle
    var d
    var ele
    for (var i in res.data) {
      if (res.data.hasOwnProperty(i)) {
        d = res.data[i]
        for (var j in lineStyle) {
          if (lineStyle.hasOwnProperty(j)) {
            if (eval(lineStyle[j].condition)) {
              ele = $('[data-index=' + i + ']')
              for (var k in lineStyle[j].style) {
                if (lineStyle[j].style.hasOwnProperty(k)) {
                  ele.css(k, lineStyle[j].style[k])
                }
              }
            }
          }
        }
      }
    }
  }
  this.addBtnsEvent = function () {
    if (cfg.btns != null && cfg.btns.items != null) {
      var items = cfg.btns.items
      table.on('toolbar(' + cfg.table.layFilter + ')', function(obj){
        $(this).blur()
        delete obj.config
        for (var i in items) if (items.hasOwnProperty(i)) if (items[i].layEvent === obj.event) items[i].event.call(this, obj, self.getConfig(), function (c) {
          if (c != null) copy(cfg.table.config, c)
          self.updateToHtml()
        })
      })
    }
  }
  this.addSearchEvent = function () {
    if (cfg.search != null && cfg.search.items != null) {
      var self = this
      // form.verify(cfg.search.verify)
      $('[lay-filter=' + cfg.search.layFilter + ']').submit(function (e) {
        e.preventDefault()
        $('[lay-filter=' + cfg.search.submit.layFilter + ']').click()
      })
      form.on('submit(' + cfg.search.submit.layFilter + ')', function (data) {
        cfg.searchIndex = layer.load(0, {shade: [0.4,'#fff']})
        for (var i in data.field) if (data.field.hasOwnProperty(i)) cfg.search.val[i] = data.field[i]
        for (var i in cfg.search.dateArr) {
          if (cfg.search.dateArr.hasOwnProperty(i)) {
            var key = cfg.search.dateArr[i]
            var arr = data.field[key].split(' - ')
            if (arr.length === 1 && arr[0] !== '') {
              data.field[key] = fullDate(arr[0])
            } else if (arr.length === 2) {
              data.field[key] = fullDate(arr[0]) + '___' + fullDate(arr[1])
            }
          }
        }
        cfg.table.config.url = setQuery(cfg.table.config.url, data.field)
        cfg.search.submit.event.call(this, data, self.getConfig(), function (c) {
          if (c != null) copy(cfg.table.config, c)
          self.updateToHtml()
          layer.close(cfg.searchIndex)
        })
        return false
      })
    }
  }
  this.addToolEvent = function () {
    if (cfg.table.tool != null && cfg.table.tool.items != null) {
      var items = cfg.table.tool.items
      table.on('tool(' + cfg.table.layFilter + ')', function (obj) {
        $(this).blur()
        for (var i in items) {
          if (items.hasOwnProperty(i) && items[i].layEvent === obj.event) {
            if (items[i].event != null) items[i].event.call(this, obj, self.getConfig(), function (c) {
              if (c != null) copy(cfg.table.config, c)
              self.render()
            })
            break
          }
        }
      })
    }
  }
  this.getConfig = function () {
    var c = cfg.table.config
    var cs = cfg.table.config.cols[0]
    var cso = cfg.table.config.colsOriginal[0]
    var cols = []
    var colsOriginal = []
    for (var i in cs) {
      if (cs.hasOwnProperty(i)) {
        cols.push({})
        for (var j in cs[i]) {
          if (cs[i].hasOwnProperty(j) && ['myWidth', 'name', 'show'].indexOf(j) === -1) {
            cols[i][j] = cs[i][j]
          }
        }
      }
    }
    for (var i in cso) {
      if (cso.hasOwnProperty(i)) {
        colsOriginal.push({})
        for (var j in cso[i]) {
          if (cso[i].hasOwnProperty(j)) {
            colsOriginal[i][j] = cso[i][j]
          }
        }
      }
    }
    return {
      elem: c.elem,
      id: c.id,
      url: c.url,
      height: c.height,
      page: c.page,
      searchIndex: cfg.searchIndex,
      colsOriginal: [colsOriginal],
      cols: [cols],
    }
  }
  this.allotWidth = function (width, arr) {
    var startNum = width
    var widthArr = []
    var diffArr = []
    var lessArr = []
    var lessArr2 = []
    var noArr = arr
    var avg
    var tempWidth
    var goOn = true
    for (var i in arr) {
      if (arr.hasOwnProperty(i)) {
        if (arr[i].maxWidth != null) widthArr.push(arr[i].maxWidth)
        widthArr.push(arr[i].minWidth)
        if (arr[i].maxWidth == null || arr[i].maxWidth >= arr[i].minWidth) {
          width -= arr[i].width
          if (startNum > arr[i].minWidth) startNum = arr[i].minWidth
        } else throw new Error('表头minWidth属性超过maxWidth属性了')
      }
    }
    widthArr.sort(function (x, y) {return x > y})
    for (var i = 0; i < widthArr.length -1; i++) if (widthArr[i + 1] > widthArr[i]) diffArr.push(widthArr[i + 1] - widthArr[i])
    arr = noArr
    noArr = []
    while (width > 0) {
      if (diffArr.length === 0) {
        goOn = true
        while (goOn) {
          avg = Math.ceil(width / arr.length)
          goOn = false
          for (var i in arr) {
            if (arr.hasOwnProperty(i)) {
              if (arr[i].maxWidth != null && arr[i].maxWidth - arr[i].width < avg) {
                width -= arr[i].maxWidth - arr[i].width
                arr[i].width = arr[i].maxWidth
                goOn = true
              } else {
                noArr.push(arr[i])
              }
            }
          }
          arr = noArr
          noArr = []
        }
        avg = Math.floor(width / arr.length)
        for (var i in arr) {
          if (arr.hasOwnProperty(i)) {
            arr[i].width += avg
            width -= avg
          }
        }
        for (var i in arr) {
          if (arr.hasOwnProperty(i)) {
            if (width !== 0) {
              arr[i].width += 1
              width -= 1
            } else break
          }
        }
        break
      } else {
        startNum += diffArr[0]
        lessArr = []
        tempWidth = 0
        for (var i in arr) {
          if (arr.hasOwnProperty(i) && arr[i].width < startNum) lessArr.push(arr[i])
          else noArr.push(arr[i])
        }
        for (var i in lessArr) if (lessArr.hasOwnProperty(i)) {
          if (lessArr[i].maxWidth != null && lessArr[i].maxWidth - lessArr[i].width < diffArr[0]) tempWidth += lessArr[i].maxWidth - lessArr[i].width
          else tempWidth += diffArr[0]
        }
        if (width >= tempWidth) {
          goOn = true
          lessArr2 = []
          while (goOn) {
            goOn = false
            for (var i in lessArr) {
              if (lessArr.hasOwnProperty(i)) {
                if (lessArr[i].maxWidth != null && lessArr[i].maxWidth - lessArr[i].width < diffArr[0]) {
                  width -= lessArr[i].maxWidth - lessArr[i].width
                  lessArr[i].width = lessArr[i].maxWidth
                  goOn = true
                } else lessArr2.push(lessArr[i])
              }
            }
            lessArr = lessArr2
            lessArr2 = []
          }
          for (var i in lessArr) {
            if (lessArr.hasOwnProperty(i)) {
              lessArr[i].width += diffArr[0]
              width -= diffArr[0]
              noArr.push(lessArr[i])
            }
          }
          arr = noArr
          noArr = []
        } else {
          goOn = true
          lessArr2 = []
          while (goOn) {
            goOn = false
            avg = Math.ceil(width / lessArr.length)
            for (var i in lessArr) {
              if (lessArr.hasOwnProperty(i)) {
                if (lessArr[i].maxWidth != null && lessArr[i].maxWidth - lessArr[i].width < avg) {
                  width -= lessArr[i].maxWidth - lessArr[i].width
                  lessArr[i].width = lessArr[i].maxWidth
                  goOn = true
                } else lessArr2.push(lessArr[i])
              }
            }
            lessArr = lessArr2
            lessArr2 = []
          }
          avg = Math.floor(width / lessArr.length)
          for (var i in lessArr) {
            if (lessArr.hasOwnProperty(i)) {
              lessArr[i].width += avg
              width -= avg
            }
          }
          for (var i in lessArr) {
            if (lessArr.hasOwnProperty(i)) {
              if (width !== 0) {
                lessArr[i].width += 1
                width -= 1
              } else break
            }
          }
          break
        }
        if (arr.length === 0) break
        diffArr.shift()
      }
    }
    var cols = cfg.table.config.colsOriginal[0]
    for (var i in cols) if (cols.hasOwnProperty(i) && cols[i].show) cols[i].width -= 1
  }
  this.render = function () {
    cfg.firstIndex = layer.load(0, {shade: [0.4,'#fff']})
    cfg.table.config.cols = [[]]
    var cols = cfg.table.config.colsOriginal[0]
    var tableWidth
    var colsHaveWidth = 0
    var colsNotHaveWidth = 0
    var noWidthArr = []
    if (cfg.table.config.width == null) tableWidth = $(cfg.table.config.elem).parent().width() - 1
    else tableWidth = cfg.table.config.width
    for (var i in cols) {
      if (cols.hasOwnProperty(i)) {
        if (cols[i].show) {
          if (cols[i].myWidth != null) {
            if (typeof cols[i].myWidth === 'string') {
              if (/^[0-9]*\.?[0-9]*\%$/.test(cols[i].myWidth)) {
                colsHaveWidth += parseInt(parseFloat(cols[i].myWidth.split('%')[0]) / 100 * tableWidth)
              } else throw new Error('表头width属性的字符串不合法！')
            } else if (typeof cols[i].myWidth === 'number') {
              colsHaveWidth += cols[i].myWidth
            } else throw new Error('表头width属性类型错误！')
          } else {
            var colsMinWidth = cfg.table.config.colsMinWidth
            if (cols[i].minWidth == null || cols[i].minWidth <  colsMinWidth) {
              cols[i].minWidth = colsMinWidth
              colsNotHaveWidth += colsMinWidth
            } else colsNotHaveWidth += cols[i].minWidth
            noWidthArr.push(cols[i])
          }
          cfg.table.config.cols[0].push(cols[i])
        }
        if (cols[i].myWidth == null) cols[i].width = cols[i].minWidth
        else cols[i].width = cols[i].myWidth
      }
    }
    if (colsHaveWidth + colsNotHaveWidth > tableWidth) {
      for (var i in noWidthArr) if (noWidthArr.hasOwnProperty(i)) noWidthArr[i].width = noWidthArr[i].minWidth
    } else this.allotWidth(tableWidth - colsHaveWidth, noWidthArr)
    // cfg.table.config.url = setQuery(cfg.table.config.url, {_now_time: (new Date()).valueOf()})
    table.render(cfg.table.config)
    if (cfg.search != null && cfg.search.items != null) {
      // var eve = cfg.search.submit.event
      cfg.search = newForm({parent: '#' + cfg.search.layFilter, type: 'table',form: cfg.search})
      // cfg.search.submit.event = eve
    }
    $('[lay-event=LAYTABLE_COLS]').css('display', 'none')
    $('[lay-event=LAYTABLE_EXPORT]').css('display', 'none')
    $('[lay-event=LAYTABLE_PRINT]').css('display', 'none')

  }
  this.init = function () {
    // 补满配置对象
    this.fullConfig(config)
    // 添加头部工具栏 DOM字符串
    this.addToolbar()
    // 添加table DOM字符串
    this.addTable()
    // 添加操作按钮列 DOM字符串
    this.addTool()
    // 添加templates DOM字符串
    this.addTemplates()
    // 将 DOM字符串添加到代码中（配置文件中指定的位置）,渲染，并监听排序
    this.updateToHtml()
    // 是否有批量操作按钮，有则加入相应点击事件
    this.addBtnsEvent()
    // 是否有搜索项，有则加入相应点击事件
    this.addSearchEvent()
    // 表头是否有操作按钮列，有则加入相应点击事件
    this.addToolEvent()
    return this.getConfig()
  }
}





// 主函数
function newTable(config) {
  // return (new TableComponent(config)).init()
  (new TableComponent(config)).init()
}
