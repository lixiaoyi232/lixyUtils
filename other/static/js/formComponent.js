// 注意：属性名为class的，属性名都必须加引号。例：{'class': 'myclass'}
// 使用：导入该js文件，在html代码中加入<div id="myForm"></div>用于存放表单，在script标签中执行newForm(config)即可

// config例子
// 简
// {
//   form: {
//     submit: {
//       event: function (data) {}
//     }
//     items: [
//       {
//         label: '姓名',
//         elements: {
//           eType: 'input',
//           name: 'name',
//           layVerify: 'required|iphon',
//         }
//       },
//     ]
//   }
// }
// 繁
// {
//   parent: '#myForm',
//   type: 'form',
//   form: {
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
//           },
//           {
//             eType: 'img',
//             name: 'test6',
//             url: '/upload/',
//             accept: 'file',
//             done: function (res) {console.log(res.url)}
//           }
//         ]
//       }
//     ],
//     verify: {
//       select: function (value) {
//         if (value === '' || value === 'null') return '必填项不能为空'
//       }
//     }
//   }
// }


// 构造函数
function FormComponent(config) {
  var self = this
  var value = ''
  var cfg
  this.fullFormItems = function (items) {
    var ele
    var star = ''
    for (var i in items) {
      if (items.hasOwnProperty(i)) {
        if (!Array.isArray(items[i].elements)) items[i].elements = [items[i].elements]
        items[i].label = items[i].label != null ? items[i].label : ''
        items[i].show = items[i].show != null ? items[i].show : true
        items[i].inline = items[i].inline != null ? items[i].inline : (config.type !== 'table' ? false : true)
        var star = ''
        for (var j in items[i].elements) {
          if (items[i].elements.hasOwnProperty(j)) {
            ele = items[i].elements[j]
            if (ele.layVerify != null && (ele.layVerify.split('|').indexOf('required') !== -1 || ele.layVerify.split('|').indexOf('select') !== -1)) star = '<span style="color: red; font-size: 14px; line-height: 20px;">＊</span>'
            switch (ele.eType) {
              case 'input':
                items[i].elements[j] = {
                  eType: ele.eType,
                  type: ele.type != null ? ele.type : 'text',
                  name: ele.name != null ? ele.name : '',
                  show: ele.show != null ? ele.show : true,
                  display: ele.display != null ? ele.display : 'inline',
                  placeholder: ele.placeholder != null ? ele.placeholder : '',
                  autocomplete: ele.autocomplete != null ? ele.autocomplete : 'off',
                  'class': ele['class'] != null ? repliceBracket(ele['class']) : '',
                  layVerify: ele.layVerify != null ? ele.layVerify : '',
                  events: ele.events != null ? ele.events : []
                }
                break
              case 'textarea':
                items[i].elements[j] = {
                  eType: ele.eType,
                  type: ele.type != null ? ele.type : 'text',
                  name: ele.name != null ? ele.name : '',
                  show: ele.show != null ? ele.show : true,
                  display: ele.display != null ? ele.display : 'block',
                  placeholder: ele.placeholder != null ? ele.placeholder : '',
                  autocomplete: ele.autocomplete != null ? ele.autocomplete : 'off',
                  'class': ele['class'] != null ? repliceBracket(ele['class']) : '',
                  layVerify: ele.layVerify != null ? ele.layVerify : '',
                  rows: ele.rows != null ? ele.rows : '5',
                  events: ele.events != null ? ele.events : []
                }
                break
              case 'select':
                items[i].elements[j] = {
                  eType: ele.eType,
                  name: ele.name != null ? ele.name : '',
                  show: ele.show != null ? ele.show : true,
                  layFilter: ele.layFilter != null ? ele.layFilter : (ele.name != null ? ele.name : ''),
                  display: ele.display != null ? ele.display : 'inline',
                  'class': ele['class'] != null ? repliceBracket(ele['class']) : '',
                  layVerify: ele.layVerify != null ? ele.layVerify : '',
                  laySearch: ele.laySearch,
                  option: ele.option,
                  events: ele.events != null ? ele.events : []
                }
                break
              case 'between':
                if (ele.children == null) ele.children = [{}, {}]
                else if (ele.children.length === 1) ele.children.push({})
                items[i].elements[j] = {
                  eType: ele.eType,
                  name: ele.name != null ? ele.name : '',
                  show: ele.show != null ? ele.show : true,
                  display: ele.display != null ? ele.display : 'inline',
                  children: [
                    {
                      type: ele.children[0].type != null ? ele.children[0].type : 'text',
                      placeholder: ele.children[0].placeholder != null ? ele.children[0].placeholder : '',
                      value: ele.children[0].value != null ? ele.children[0].value : '',
                      autocomplete: ele.children[0].autocomplete != null ? ele.children[0].autocomplete : 'off',
                      'class': ele.children[0]['class'] != null ? repliceBracket(ele.children[0]['class']) : '',
                      layVerify: ele.children[0].layVerify != null ? ele.children[0].layVerify : '',
                      events: ele.children[0].events != null ? ele.children[0].events : []
                    },
                    {
                      type: ele.children[1].type != null ? ele.children[1].type : 'text',
                      placeholder: ele.children[1].placeholder != null ? ele.children[1].placeholder : '',
                      value: ele.children[1].value != null ? ele.children[1].value : '',
                      autocomplete: ele.children[1].autocomplete != null ? ele.children[1].autocomplete : 'off',
                      'class': ele.children[1]['class'] != null ? repliceBracket(ele.children[1]['class']) : '',
                      layVerify: ele.children[1].layVerify != null ? ele.children[1].layVerify : '',
                      events: ele.children[1].events != null ? ele.children[1].events : []
                    }
                  ]
                }
                break
              case 'date':
                items[i].elements[j] = {
                  eType: ele.eType,
                  type: ele.type != null ? ele.type : 'date',
                  name: ele.name != null ? ele.name : '',
                  show: ele.show != null ? ele.show : true,
                  display: ele.display != null ? ele.display : 'inline',
                  id: ele.id != null ? ele.id : ele.name,
                  range: ele.range != null ? ele.range : false,
                  placeholder: ele.placeholder != null ? ele.placeholder : '-',
                  'class': ele['class'] != null ? repliceBracket(ele['class']) : '',
                  layVerify: ele.layVerify != null ? ele.layVerify : '',
                  events: ele.events != null ? ele.events : []
                }
                break
              case 'char':
                items[i].elements[j] = {
                  eType: ele.eType,
                  name: ele.name != null ? ele.name : '',
                  show: ele.show != null ? ele.show : true,
                  element: ele.element != null ? repliceBracket(ele.element) : '',
                  'class': ele['class'] != null ? repliceBracket(ele['class']) : '',
                  display: ele.display != null ? ele.display : 'block',
                  events: ele.events != null ? ele.events : []
                }
                break
              case 'file':
                items[i].elements[j] = {
                  eType: ele.eType,
                  name: ele.name != null ? ele.name : '',
                  show: ele.show != null ? ele.show : true,
                  'class': ele['class'] != null ? repliceBracket(ele['class']) : '',
                  btnClass: ele.btnClass != null ? repliceBracket(ele.btnClass) : 'layui-btn layui-btn-normal',
                  imgClass: ele.imgClass != null ? repliceBracket(ele.imgClass) : 'layui-upload-img myImg',
                  fileClass: ele.fileClass != null ? repliceBracket(ele.fileClass) : 'myFile',
                  layVerify: ele.layVerify != null ? ele.layVerify : '',
                  display: ele.display != null ? ele.display : 'inline',
                  url: ele.url != null ? ele.url : '/upload/',
                  accept: ele.accept != null ? ele.accept : 'images',
                  done: ele.done != null ? ele.done : function (res) {},
                  events: ele.events != null ? ele.events : []
                }
                break
              case 'checkbox':
                items[i].elements[j] = {
                  eType: ele.eType,
                  show: ele.show != null ? ele.show : true,
                  'class': ele['class'] != null ? repliceBracket(ele['class']) : '',
                  display: ele.display != null ? ele.display : 'block',
                  children: []
                }
                for (var k = 0; k < ele.children.length; k++) {
                  var one = ele.children[k]
                  items[i].elements[j].children.push({
                    name: one.name != null ? one.name : ele.name + k,
                    title: one.title != null ? one.title : ele.name + k,
                    show: one.show != null ? one.show : true,
                    laySkin: one.laySkin != null ? one.laySkin : 'primary',
                    checked: one.checked != null ? one.checked : false,
                    disabled: one.disabled != null ? one.disabled : false,
                    events: one.events != null ? one.events : []
                  })
                }
                break
              case 'radio':
                items[i].elements[j] = {
                  eType: ele.eType,
                  name: ele.name != null ? ele.name : '',
                  show: ele.show != null ? ele.show : true,
                  'class': ele['class'] != null ? repliceBracket(ele['class']) : '',
                  display: ele.display != null ? ele.display : 'block',
                  children: []
                }
                for (var k = 0; k < ele.children.length; k++) {
                  var one = ele.children[k]
                  items[i].elements[j].children.push({
                    title: one.title != null ? one.title : ele.name + k,
                    value: one.value,
                    show: one.show != null ? one.show : true,
                    checked: one.checked != null ? one.checked : false,
                    disabled: one.disabled != null ? one.disabled : false,
                    events: one.events != null ? one.events : []
                  })
                }
                break
            }
          }
        }
        if (items[i].label.indexOf('＊') === -1) items[i].label = star + items[i].label
      }
    }
  }
  this.backSubmit = function (config) {
    var submit = config.form.submit
    var parent = config.parent != null ? config.parent : '#myForm'
    if (config.form.submit != null) {
      return {
        layFilter: submit.layFilter != null ? submit.layFilter : parent.slice(1) + 'Submit',
        show: submit.show != null ? submit.show : true,
        inline: submit.inline != null ? submit.inline : false,
        'class': submit['class'] != null ? submit['class'] : 'layui-btn-normal',
        label: submit.label != null ? submit.label : '提交',
        event: submit.event != null ? submit.event : function (data) {
          console.log(data.field)
        }
      }
    } else {
      return {
        layFilter: parent.slice(1) + 'Submit',
        'class': 'layui-btn-normal',
        show: true,
        inline: false,
        float: 'left',
        label: '提交',
        event: function (data) {
          console.log(data.field)
        }
      }
    }
  }
  this.fullConfig = function (config) {
    if (config != null) {
      this.fullFormItems(config.form.items)
      cfg =  {
        parent: config.parent != null ? config.parent : '#myForm',
        type: config.type,
        form: {
          layFilter: config.form.layFilter != null ? config.form.layFilter : (config.parent != null ? config.parent : '#myForm').slice(1),
          'class': config.form['class'] != null ? config.form['class'] : '',
          labelWidth: config.form.labelWidth != null ? config.form.labelWidth : '80',
          done: config.form.done != null ? config.form.done : function () {
            console.log('表单渲染完后什么也不做……')
          },
          val: config.form.val != null ? config.form.val : {},
          submit: this.backSubmit(config),
          items: config.form.items,
          verify: config.form.verify != null ? config.form.verify : {},
          dateArr: []
        }
      }
    }
  }
  this.addForm = function () {
    var labelWidth = cfg.form.labelWidth
    var items = cfg.form.items
    var ele
    var opts
    var one
    value += '<style>.layui-input-block{margin-left: 10px;}.layui-form-item>.layui-input-block{margin-left: ' + (parseFloat(labelWidth) + 30) + 'px;}.formInline {display: inline-block!important;margin-bottom: 0;}</style><form class="layui-form ' + (cfg.form['class'] != null ? cfg.form['class'] : '') + '" lay-filter="' + cfg.form.layFilter + '" >'
    for (var i in items) {
      if (items.hasOwnProperty(i)) {
        if (typeof items[i] !== 'object') layer.alert('表格操作按钮类型有误')
        value += '<div class="layui-form-item ' + (items[i].inline ? 'formInline' : '') + (items[i].elements[0].eType === 'textarea' ? ' layui-form-text' : '') + ' formLine" m-if="' + items[i].show + '"><label class="layui-form-label" style="width: ' + labelWidth + 'px;">' + items[i].label + '</label>'
        for (var j in items[i].elements) {
          if (items[i].elements.hasOwnProperty(j)) {
            ele = items[i].elements[j]
            switch (ele.eType) {
              case 'input':
                value += '<div class="layui-input-' + ele.display + '"><input type="' + ele.type + '" name="' + ele.name + '" lay-verify="' + ele.layVerify + '" placeholder="' + ele.placeholder + '" autocomplete="' + ele.autocomplete + '" class="layui-input ' + ele['class'] + '" m-if="' + ele.show + '"></div>'
                break
              case 'textarea':
                value += '<div class="layui-input-' + ele.display + '"><textarea type="' + ele.type + '" name="' + ele.name + '" lay-verify="' + ele.layVerify + '" placeholder="' + ele.placeholder + '" autocomplete="' + ele.autocomplete + '" class="layui-textarea ' + ele['class'] + '" rows="' + ele.rows + '" m-if="' + ele.show + '"></textarea></div>'
                break
              case 'select':
                opts = ele.option
                value += '<div class="layui-input-' + ele.display + '"><select name="' + ele.name + '" lay-filter="' + ele.layFilter + '" lay-verify="' + ele.layVerify + '" class="layui-input ' + ele['class'] + '"' + (ele.laySearch ? ' lay-search' : '') + ' m-if="' + ele.show + '">'
                for (var k in opts) {
                  if (opts.hasOwnProperty(k)) {
                    value += '<option value="' + opts[k].value + '"' + (opts[k].selected ? ' selected' : '') + (opts[k].disabled ? ' disabled' : '') + '>' + opts[k].label + '</option>'
                  }
                }
                value += '</select></div>'
                break
              case 'between':
                // value += '<div class="layui-input-' + ele.display + '" m-if="' + ele.show + '"><div class="layui-input-inline" style="width: 82px;"><input type="' + ele.children[0].type + '" name="_min' + ele.name + '"' + ' lay-verify="' + ele.children[0].layVerify + '"' + ' placeholder="' + ele.children[0].placeholder + '" value="' + ele.children[0].value + '" autocomplete="' + ele.children[0].autocomplete + '" class="layui-input ' + ele.children[0]['class'] + '"></div><div class="layui-form-mid" style="font-size: 12px;">-</div><div class="layui-input-inline" style="width: 82px; margin-right: 0;"><input type="' + ele.children[1].type + '" name="_max' + ele.name + '"' + ' lay-verify="' + ele.children[1].layVerify + '"' + ' placeholder="' + ele.children[1].placeholder + '" value="' + ele.children[1].value + '" autocomplete="' + ele.children[1].autocomplete + '" class="layui-input ' + ele.children[1]['class'] + '"></div></div>'
                value += '<div class="layui-input-' + ele.display + '" m-if="' + ele.show + '"><div class="layui-input-inline" style="width: 67px;"><input type="' + ele.children[0].type + '" name="_min' + ele.name + '"' + ' lay-verify="' + ele.children[0].layVerify + '"' + ' placeholder="' + ele.children[0].placeholder + '" value="' + ele.children[0].value + '" autocomplete="' + ele.children[0].autocomplete + '" class="layui-input ' + ele.children[0]['class'] + '"></div><div class="layui-form-mid" style="font-size: 12px;">-</div><div class="layui-input-inline" style="width: 67px; margin-right: 0;"><input type="' + ele.children[1].type + '" name="_max' + ele.name + '"' + ' lay-verify="' + ele.children[1].layVerify + '"' + ' placeholder="' + ele.children[1].placeholder + '" value="' + ele.children[1].value + '" autocomplete="' + ele.children[1].autocomplete + '" class="layui-input ' + ele.children[1]['class'] + '"></div></div>'
                break
              case 'date':
                value += '<div class="layui-input-' + ele.display + '"><input type="text" id="' + ele.id + '" name="' + ele.name + '" lay-verify="' + ele.layVerify + '" placeholder="' + ele.placeholder + '" class="layui-input ' + ele['class'] + '" m-if="' + ele.show + '"></div>'
                break
              case 'char':
                value += '<div class="layui-input-' + ele.display + ' ' + ele['class'] + ' formChar"><div name="' + ele.name + '" m-if="' + ele.show + '">' + ele.element + '</div></div>'
                break
              case 'file':
                value += '<div class="layui-upload layui-input-' + ele.display + ' ' + ele['class'] + '" m-if="' + ele.show + '"><button type="button" class="' + ele.btnClass + '" id="' + ele.name + 'Btn">' + (ele.accept === 'images' ? '上传图片' : '上传文件') + '</button><div class="layui-upload-list">' + (ele.accept === 'images' ? '<a id="' + ele.name + 'A" target="_blank"><img class="' + ele.imgClass + '" id="' + ele.name + 'Img"></a>' : '<p class="' + ele.fileClass + '" id="' + ele.name + 'File"></p>') + '<input hidden="hidden" name="' + ele.name + '" lay-verify="' + ele.layVerify + '"></div></div>'
                break
              case 'checkbox':
                value += '<div class="layui-input-' + ele.display + ' ' + ele['class'] + '" m-if="' + ele.show + '">'
                for (var k in ele.children) {
                  if ( ele.children.hasOwnProperty(k)) {
                    one = ele.children[k]
                    value += '<input type="checkbox" name="' + one.name + '" title="' + one.title + '" lay-skin="' + one.laySkin + '" m-if="' + one.show + '"' + (one.checked ? ' checked' : '') + '' + (one.disabled ? ' disabled' : '') + '>'
                  }
                }
                value += '</div>'
                break
              case 'radio':
                value += '<div class="layui-input-' + ele.display + ' ' + ele['class'] + '" m-if="' + ele.show + '">'
                for (var k in ele.children) {
                  if ( ele.children.hasOwnProperty(k)) {
                    one = ele.children[k]
                    value += '<input type="radio" name="' + ele.name + '" title="' + one.title + '" value="' + one.value + '" m-if="' + one.show + '"' + (one.checked ? ' checked' : '') + '' + (one.disabled ? ' disabled' : '') + '>'
                  }
                }
                value += '</div>'
                break
            }
          }
        }
        value += '</div>'
      }
    }
    var submit = cfg.form.submit
    var sbmtStr = '<div class="layui-form-item ' + (submit.inline ? 'formInline' : '') + '" m-if="' + submit.show + '"><div class="layui-input-block"><button class="layui-btn ' + submit['class'] + '" lay-submit lay-filter="' + submit.layFilter + '" style="min-width: 100px;">' + submit.label + '</button></div></div>'
    value += sbmtStr
    value += '</form>'
  }
  this.updateToHtml = function () {
    $(cfg.parent).html(value)
    this.render()
  }
  this.addEvent = function () {
    form.verify(cfg.form.verify)
    if (cfg.type !== 'table') {
      $('[lay-filter=' + cfg.form.layFilter + ']').submit(function (e) {
        if (e.target !== this) return true
        // e.preventDefault()放在if (e.target !== this) return true上面的话，内部的提交事件也会被阻止，ie8会出问题，如上传图片，外层的submit需要阻止，上传图片的submit不应该阻止
        e.preventDefault()
        $('[lay-filter=' + cfg.form.submit.layFilter + ']').trigger('click')
      })
      form.on('submit(' + cfg.form.submit.layFilter + ')', function (data) {
        for (var i in cfg.form.dateArr) {
          if (cfg.form.dateArr.hasOwnProperty(i)) {
            var key = cfg.form.dateArr[i]
            var arr = data.field[key].split(' - ')
            if (arr.length === 1 && arr[0] !== '') {
              data.field[key] = fullDate(arr[0])
            } else if (arr.length === 2) {
              data.field[key] = fullDate(arr[0]) + '___' + fullDate(arr[1])
            }
          }
        }
        cfg.form.submit.event.call(this, data)
        return false
      })
    }
    if (cfg.form.val != null) form.val(cfg.form.layFilter, cfg.form.val)
    var items = cfg.form.items
    for (var i in items) {
      if (items.hasOwnProperty(i)) {
        for (var j in items[i].elements) {
          if (items[i].elements.hasOwnProperty(j)) {
            switch (items[i].elements[j].eType) {
              case 'input':
                for (var k in items[i].elements[j].events) {
                  if (items[i].elements[j].events.hasOwnProperty(k)) {
                    (function () {
                      var eve = items[i].elements[j].events[k]
                      if (eve.type == null || eve.type === 'on') $('[name=' + items[i].elements[j].name + ']').on(eve.name, function (e) {e.preventDefault();eve.callback.call(this, e, self.getConfig())})
                      else if (eve.type === 'delegate') $('[name=' + items[i].elements[j].name + ']').delegate(eve.query, eve.name, function (e) {e.preventDefault();eve.callback.call(this, e, self.getConfig())})
                    })()
                  }
                }
                break
              case 'textarea':
                for (var k in items[i].elements[j].events) {
                  if (items[i].elements[j].events.hasOwnProperty(k)) {
                    (function () {
                      var eve = items[i].elements[j].events[k]
                      if (eve.type == null || eve.type === 'on') $('[name=' + items[i].elements[j].name + ']').on(eve.name, function (e) {e.preventDefault();eve.callback.call(this, e, self.getConfig())})
                      else if (eve.type === 'delegate') $('[name=' + items[i].elements[j].name + ']').delegate(eve.query, eve.name, function (e) {e.preventDefault();eve.callback.call(this, e, self.getConfig())})
                    })()
                  }
                }
                break
              case 'select':
                for (var k in items[i].elements[j].events) {
                  if (items[i].elements[j].events.hasOwnProperty(k)) {
                    (function () {
                      var eve = items[i].elements[j].events[k]
                      if (eve.type == null || eve.type === 'on') {
                        if (eve.name === 'laySelect') form.on('select(' + items[i].elements[j].layFilter + ')', function (data) {eve.callback.call(this, data, self.getConfig())})
                        else $('[name=' + items[i].elements[j].name + ']').on(eve.name, function (e) {e.preventDefault();eve.callback.call(this, e, self.getConfig())})
                      } else if (eve.type === 'delegate') $('[name=' + items[i].elements[j].name + ']').delegate(eve.query, eve.name, function (e) {e.preventDefault();eve.callback.call(this, e, self.getConfig())})
                    })()
                  }
                }
                break
              case 'between':
                for (var k in items[i].elements[j].children[0].events) {
                  if (items[i].elements[j].children[0].events.hasOwnProperty(k)) {
                    (function () {
                      var eve = items[i].elements[j].children[0].events[k]
                      if (eve.type == null || eve.type === 'on') $('[name=' + items[i].elements[j].children[0].name + ']').on(eve.name, function (e) {e.preventDefault();eve.callback.call(this, e, self.getConfig())})
                      else if (eve.type === 'delegate') $('[name=' + items[i].elements[j].children[0].name + ']').delegate(eve.query, eve.name, function (e) {e.preventDefault();eve.callback.call(this, e, self.getConfig())})
                    })()
                  }
                }
                for (var k in items[i].elements[j].children[1].events) {
                  if (items[i].elements[j].children[1].events.hasOwnProperty(k)) {
                    (function () {
                      var eve = items[i].elements[j].children[1].events[k]
                      if (eve.type == null || eve.type === 'on') $('[name=' + items[i].elements[j].children[1].name + ']').on(eve.name, function (e) {e.preventDefault();eve.callback.call(this, e, self.getConfig())})
                      else if (eve.type === 'delegate') $('[name=' + items[i].elements[j].children[1].name + ']').delegate(eve.query, eve.name, function (e) {e.preventDefault();eve.callback.call(this, e, self.getConfig())})
                    })()
                  }
                }
                break
              case 'date':
                (function () {
                  laydate.render({elem: '#' + items[i].elements[j].id, range: items[i].elements[j].range, type: items[i].elements[j].type
                  })
                  cfg.form.dateArr.push(items[i].elements[j].name)
                  for (var k in items[i].elements[j].events) {
                    if (items[i].elements[j].events.hasOwnProperty(k)) {
                      (function () {
                        var eve = items[i].elements[j].events[k]
                        if (eve.type == null || eve.type === 'on') $('[name=' + items[i].elements[j].name + ']').on(eve.name, function (e) {e.preventDefault();eve.callback.call(this, e, self.getConfig())})
                        else if (eve.type === 'delegate') $('[name=' + items[i].elements[j].name + ']').delegate(eve.query, eve.name, function (e) {e.preventDefault();eve.callback.call(this, e, self.getConfig())})
                      })()
                    }
                  }
                })()
                break
              case 'char':
                for (var k in items[i].elements[j].events) {
                  if (items[i].elements[j].events.hasOwnProperty(k)) {
                    (function () {
                      var eve = items[i].elements[j].events[k]
                      if (eve.type == null || eve.type === 'on') $('[name=' + items[i].elements[j].name + ']').on(eve.name, function (e) {e.preventDefault();eve.callback.call(this, e, self.getConfig())})
                      else if (eve.type === 'delegate') $('[name=' + items[i].elements[j].name + ']').delegate(eve.query, eve.name, function (e) {e.preventDefault();eve.callback.call(this, e, self.getConfig())})
                    })()
                  }
                }
                break
              case 'file':
                (function () {
                  var itemEle = items[i].elements[j]
                  if (itemEle.accept === 'images') $('#' + itemEle.name + 'Img')[0].src = $('[name=' + itemEle.name + ']').val()
                  else $('#' + itemEle.name + 'File').html($('[name=' + itemEle.name + ']').val())
                  layui.upload.render({
                    elem: '#' + itemEle.name + 'Btn',
                    url: itemEle.url,
                    accept: itemEle.accept,
                    done: function(res){
                      if (itemEle.accept === 'images') {
                        $('#' + itemEle.name + 'Img')[0].src = res.url
                        $('#' + itemEle.name + 'A')[0].href = res.url
                      } else $('#' + itemEle.name + 'File').html(res.url)
                      $('[name=' + itemEle.name + ']').val(res.url)
                      itemEle.done.call(this, res)
                    }
                  })
                  for (var k in itemEle.events) {
                    if (itemEle.events.hasOwnProperty(k)) {
                      (function () {
                        var eve = itemEle.events[k]
                        if (eve.type == null || eve.type === 'on') $('[name=' + itemEle.name + ']').on(eve.name, function (e) {e.preventDefault();eve.callback.call(this, e, self.getConfig())})
                        else if (eve.type === 'delegate') $('[name=' + itemEle.name + ']').delegate(eve.query, eve.name, function (e) {e.preventDefault();eve.callback.call(this, e, self.getConfig())})
                      })()
                    }
                  }
                })()
                break
              case 'checkbox':
                (function () {
                  for (var k in items[i].elements[j].children) {
                    if (items[i].elements[j].children.hasOwnProperty(k)) {
                      one = items[i].elements[j].children[k]
                      for (var l in one.events) {
                        if (one.events.hasOwnProperty(l)) {
                          (function () {
                            var eve = one.events[l]
                            if (eve.type == null || eve.type === 'on') $('[name=' + items[i].elements[j].children[k].name + ']').on(eve.name, function (e) {e.preventDefault();eve.callback.call(this, e, self.getConfig())})
                            else if (eve.type === 'delegate') $('[name=' + items[i].elements[j].children[k].name + ']').delegate(eve.query, eve.name, function (e) {e.preventDefault();eve.callback.call(this, e, self.getConfig())})
                          })()
                        }
                      }
                    }
                  }
                })()
                break
            }
          }
        }
      }
    }
  }
  this.getConfig = function () {
    var f = cfg.form
    var val = {}
    var dateArr = []
    for (var i in f.val) if (f.val.hasOwnProperty(i)) val[i] = f.val[i]
    for (var i in f.dateArr) if (f.dateArr.hasOwnProperty(i)) dateArr[i] = f.dateArr[i]
    return {
      layFilter: f.layFilter,
      'class': f['class'],
      labelWidth: f.labelWidth,
      val: val,
      done: f.done,
      submit: {
        layFilter: f.submit.layFilter,
        'class': f.submit['class'],
        show: f.submit.show,
        inline: f.submit.inline,
        float: f.submit.float,
        label: f.submit.label,
        event: f.submit.event
      },
      items: f.items,
      verify: f.verify,
      dateArr: f.dateArr,
    }
  }
  this.render = function () {
    form.render()
    cfg.form.done()
    mIfRender()
  }
  this.init = function () {
    // 补满配置对象
    this.fullConfig(config)
    this.addForm()
    // 将 DOM字符串添加到代码中（配置文件中指定的位置）,渲染，并监听排序
    this.updateToHtml()
    this.addEvent()
    return this.getConfig()
  }
}





// 主函数
function newForm(config) {
  return (new FormComponent(config)).init()
  // (new FormComponent(config)).init()
}
