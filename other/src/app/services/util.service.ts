import { Member } from '../entities/member'
import { Admin } from '../entities/admin'
import { sha256 } from '../../lib'
import { config } from '../../config/config'
import { Repository } from 'typeorm'
import * as XLSX from 'xlsx'
import http from 'http'
import fs from 'fs-extra'
import path from 'path'

export class TableDataConfig {
  query: any
  order: any
  repo: Repository<any>
  select: string[]
  leftJoin: any
  leftJoinAndSelect: any
  prop: {[key: string]: {
    key: string,
    search: string,
    from: any,
  }}
  limit: number | null
  offset: number
  count: number | null
  groupBy: any
  cache: any

  takeAndSkip: boolean
  constructor (c: any) {
    this.query = {}
    this.repo = c.repo
    this.leftJoin = c.leftJoin != null ? c.leftJoin : {}
    this.leftJoinAndSelect = c.leftJoinAndSelect != null ? c.leftJoinAndSelect : {}
    this.select = c.select
    this.prop = c.prop != null ? c.prop : {}
    this.order = c.order != null ? this.getOrder(c.order) : (c.default != null && c.default.order != null ?  this.getOrder(c.default.order) : (c.query != null && c.query.order != null && c.query.order !== '' ? this.getOrder(c.query.order) : (c.queryDefault != null && c.queryDefault.order != null ? this.getOrder(c.queryDefault.order) : this.getOrder(null))))
    this.limit = c.limit != null ? (c.limit !== 'null' ? c.limit : null) : (c.query.limit != null ? c.query.limit : null)
    this.offset = c.offset != null ? (c.offset !== 'null' ? c.offset : 0) : (c.query.page != null ? (c.query.page - 1) * (this.limit ? this.limit : 0) : 0)
    this.count = c.count != null ? c.count : null
    this.groupBy = c.groupBy != null ? c.groupBy : null
    this.cache = c.cache != null ? c.cache : null

    this.takeAndSkip = c.takeAndSkip != null ? c.takeAndSkip : true

    if (c.queryDefault != null) for (let i in c.queryDefault) if (this.prop[i]) this.query[i] = c.queryDefault[i]
    for (let i in c.query) if (this.prop[i]) this.query[i] = c.query[i]
    if (c.default != null) for (let i in c.default) if (this.prop[i]) this.query[i] = c.default[i]
  }

  getOrder(o: string|null) {
    let order: any = {}
    if (o) {
      let oArr = o.split(',')
      for (let i of oArr) {
        let key = i[0] === '-' ? i.slice(1) : i
        if (this.prop[key]) {
          let k = this.prop[key].key
          // let k = this.prop[key].key.split('.').map(item => `"${item}"`).join('.')
          if (i[0] === '-') order[k] = 'DESC'
          else order[k] = 'ASC'
        }
      }
    }
    if (order['own.id'] == null) order['own.id'] = 'DESC'
    return order
  }

  getDataObj() {
    let linkStr = ''
    let whereStr = ''
    let whereObj: any = {}

    let qb: any = this.repo.createQueryBuilder('own')
    for (let i in this.query) {
      if (this.prop[i] != null && this.query[i] != null) {
        let key = this.prop[i].key != null ? this.prop[i].key.split('.').map(item => `"${item}"`).join('.') : ''
        switch (this.prop[i].search) {
          case 'equal': {
            if (this.query[i] !== 'all') {
              whereStr += `${linkStr}${key}=:${i}`
              whereObj[i] = this.query[i]
              linkStr = ' AND '
            }
            break
          }
          case 'not': {
            if (this.query[i] !== 'null') {
              whereStr += `${linkStr}${key}!=:${i}`
              whereObj[i] = this.query[i]
              linkStr = ' AND '
            }
            break
          }
          case 'in': {
            if (this.query[i] !== 'all') {
              let and = ''
              whereStr += `${linkStr}${key} IN (`
              for (let j in this.query[i].split(',')) {
                whereStr += `${and}:${i + j}`
                whereObj[i + j] = this.query[i].split(',')[j]
                and = ', '
              }
              whereStr += ')'
              linkStr = ' AND '
            }
            break
          }
          case 'notIn': {
            if (this.query[i] !== 'null') {
              let and = ''
              whereStr += `${linkStr} NOT(${key} IN (`
              for (let j in this.query[i].split(',')) {
                whereStr += `${and}:${i + j}`
                whereObj[i + j] = this.query[i].split(',')[j]
                and = ', '
              }
              whereStr += '))'
              linkStr = ' AND '
            }
            break
          }
          case 'like': {
            whereStr += `${linkStr}${key} LIKE :${i}`
            whereObj[i] = `%${this.query[i]}%`
            linkStr = ' AND '
            break
          }
          case 'between': {
            let arr = this.query[i].split('*')
            if (arr[0] !== '' && arr[1] !== '') {
              whereStr += `${linkStr}${key} BETWEEN :${i}0 AND :${i}1`
              whereObj[i + '0'] = parseInt(arr[0])
              whereObj[i + '1'] = parseInt(arr[1])
              linkStr = ' AND '
            } else if (arr[0] !== '') {
              whereStr += `${linkStr}${key} >= :${i}`
              whereObj[i] = parseInt(arr[0])
              linkStr = ' AND '
            } else if (arr[1] !== '') {
              whereStr += `${linkStr}${key} <= :${i}`
              whereObj[i] = parseInt(arr[1])
              linkStr = ' AND '
            }
            break
          }
          case 'date': {
            let arr = this.query[i].split('_')
            let date = new Date(parseInt(arr[arr.length - 1]))
            whereStr += `${linkStr}${key} BETWEEN :${i}0 AND :${i}1`
            whereObj[i + '0'] = new Date(parseInt(arr[0]))
            whereObj[i + '1'] = new Date(date.setDate(date.getDate() + 1))
            linkStr = ' AND '
            break
          }
          case 'have': {
            switch (this.query[i]) {
              case 'true': {
                whereStr += `${linkStr}${key} IS NOT NULL`
                linkStr = ' AND '
                break
              }
              case 'false': {
                whereStr += `${linkStr}${key} IS NULL`
                linkStr = ' AND '
                break
              }
            }
            break
          }
          case 'sub': {
            // {search: 'notIn', select: '"sub"."id"', leftJoin: {'sub.matchApplies': 'matchApplies'}, where: '"matchApplies"."matchId"={{ match.id }}'}
            let subObj = JSON.parse(this.query[i])
            let subStr = qb.subQuery().select(subObj.select).from(this.prop[i].from, 'sub')
            if (subObj.leftJoin != null) for (let j in subObj.leftJoin) subStr.leftJoin(j, subObj.leftJoin[j])
            subStr.where(subObj.where)
            switch (subObj.search) {
              case 'in': {
                whereStr += `${linkStr}${key} IN ${subStr.getQuery()}`
                break
              }
              case 'notIn': {
                whereStr += `${linkStr}NOT(${key} IN ${subStr.getQuery()})`
                break
              }
              case 'nullOrIn': {
                whereStr += `${linkStr}(${key} IS NULL OR ${key} IN ${subStr.getQuery()})`
                break
              }
            }
            linkStr = ' AND '
            break
          }
          case 'str': {
            whereStr += linkStr + this.query[i]
            linkStr = ' AND '
            break
          }
        }
      }
    }
    if (this.select != null) qb = qb.select(this.select)
    for (let i in this.leftJoin) qb = qb.leftJoin(i, this.leftJoin[i])
    for (let i in this.leftJoinAndSelect) qb = qb.leftJoinAndSelect(i, this.leftJoinAndSelect[i])
    if (this.limit) {
      if (this.takeAndSkip) {
        qb = qb.take(this.limit)
      }
      else qb = qb.limit(this.limit)
    }
    if (this.offset) {
      if (this.takeAndSkip) {
        qb = qb.skip(this.offset)
      }
      else qb = qb.offset(this.offset)
    }
    qb = qb.orderBy(this.order)
    qb = qb.where(whereStr, whereObj)
    if (this.cache != null) qb = qb.cache(...this.cache)
    return qb
  }
  async getTableData() {
    let arr = await this.getDataObj().getManyAndCount()
    if (this.groupBy != null && this.groupBy.length >= 2) {
      let ids: number[] = [0]
      let key = 'groupByAttr'
      if (this.groupBy[1].split(' ').length >= 2) key = this.groupBy[1].split(' ')[1]
      else this.groupBy[1] += ' ' + key
      for (let i of arr[0]) ids.push(i.id)
      let obj = (await this.getDataObj().groupBy(this.groupBy[0]).select(this.groupBy).where(`own.id In ('${ids.join('\',\'')}')`).getRawMany()).reduce((obj: any, i: any) => (obj[i.own_id] = i[key], obj), {})
      for (let i of arr[0]) i[key] = obj[i.id]
    }
    return {
      code: 0,
      msg: '',
      limit: this.limit,
      count: this.count != null ? this.count : arr[1],
      data: arr[0]
    }
  }
  getManyAndCount = async () => await this.getDataObj().getManyAndCount()
  getMany = async () => await this.getDataObj().getMany()
  getCount = async () => await this.getDataObj().getCount()
  getOne = async () => await this.getDataObj().getOne()
  getRawOne = async () => await this.getDataObj().getRawOne()
  getRawMany = async () => await this.getDataObj().getRawMany()
  getQuery = async () => await this.getDataObj().getQuery()
  getRawCount = async () => (await this.getDataObj().select('count("own"."id") count').orderBy().limit().offset().getRawMany())[0].count
  getLimit = () => this.limit
}

export class Pmsn {
  name: string
  value: string
  checked: boolean
  list: object
  constructor(c?: boolean) {
    this.name = '所有权限'
    this.value = 'all'
    this.checked = c != null ? c : true
    this.list = {
      mem: {'name': '前台用户管理', 'checked': false, 'list': {
        sch: {'name': '学校用户', 'checked': false, 'list': {
          a: {'name': '增', 'checked': false},
          d: {'name': '删', 'checked': false},
          u: {'name': '改', 'checked': false},
          g: {'name': '查', 'checked': false},
          old: {'name': '往期学生', 'checked': false, 'list': {
            a: {'name': '增', 'checked': false},
            d: {'name': '删', 'checked': false},
            u: {'name': '改', 'checked': false},
            g: {'name': '查', 'checked': false}
          }},
        }},
        std: {'name': '学生用户', 'checked': false, 'list': {
          a: {'name': '增', 'checked': false},
          d: {'name': '删', 'checked': false},
          u: {'name': '改', 'checked': false},
          g: {'name': '查', 'checked': false},
          fml: {'name': '家庭', 'checked': false, 'list': {
            a: {'name': '增', 'checked': false},
            d: {'name': '删', 'checked': false},
            u: {'name': '改', 'checked': false},
            g: {'name': '查', 'checked': false}
          }},
          scr: {'name': '成绩', 'checked': false, 'list': {
            a: {'name': '增', 'checked': false},
            d: {'name': '删', 'checked': false},
            u: {'name': '改', 'checked': false},
            g: {'name': '查', 'checked': false}
          }},
          old: {'name': '往期学校', 'checked': false, 'list': {
            a: {'name': '增', 'checked': false},
            d: {'name': '删', 'checked': false},
            u: {'name': '改', 'checked': false},
            g: {'name': '查', 'checked': false}
          }},
        }},
        tch: {'name': '老师用户', 'checked': false, 'list': {
          a: {'name': '增', 'checked': false},
          d: {'name': '删', 'checked': false},
          u: {'name': '改', 'checked': false},
          g: {'name': '查', 'checked': false}
        }},
        grp: {'name': '爱心团体用户', 'checked': false, 'list': {
          a: {'name': '增', 'checked': false},
          d: {'name': '删', 'checked': false},
          u: {'name': '改', 'checked': false},
          g: {'name': '查', 'checked': false},
        }},
        psn: {'name': '爱心人士用户', 'checked': false, 'list': {
          a: {'name': '增', 'checked': false},
          d: {'name': '删', 'checked': false},
          u: {'name': '改', 'checked': false},
          g: {'name': '查', 'checked': false}
        }},
        oth: {'name': '其他人士用户', 'checked': false, 'list': {
          a: {'name': '增', 'checked': false},
          d: {'name': '删', 'checked': false},
          u: {'name': '改', 'checked': false},
          g: {'name': '查', 'checked': false}
        }},
        sap: {'name': '入学申请', 'checked': false, 'list': {
          g: {'name': '查', 'checked': false},
          v: {'name': '审核（分区权限）', 'checked': false}
        }},
      }},
      mch: {'name': '大赛管理', 'checked': false, 'list': {
        mch: {'name': '大赛', 'checked': false, 'list': {
          a: {'name': '增', 'checked': false},
          d: {'name': '删', 'checked': false},
          u: {'name': '改', 'checked': false},
          g: {'name': '查', 'checked': false},
        }},
        apl: {'name': '报名表', 'checked': false, 'list': {
          a: {'name': '增', 'checked': false},
          d: {'name': '删', 'checked': false},
          u: {'name': '改', 'checked': false},
          g: {'name': '查', 'checked': false},
          v: {'name': '审核（分区权限）', 'checked': false}
        }},
        sfv: {'name': '初赛故事审核', 'checked': false, 'list': {
          g: {'name': '查', 'checked': false},
          o: {'name': '一审（分区权限）', 'checked': false},
          t: {'name': '二审', 'checked': false}
        }},
        ssv: {'name': '复赛故事审核', 'checked': false, 'list': {
          g: {'name': '查', 'checked': false},
          f: {'name': '复赛审核（分区权限）', 'checked': false},
          aw: {'name': '颁奖', 'checked': false}
        }},
        stv: {'name': '获奖感言审核', 'checked': false, 'list': {
          g: {'name': '查', 'checked': false},
          f: {'name': '审核（分区权限）', 'checked': false},
        }},
      }},
      sty: {'name': '故事管理', 'checked': false, 'list': {
        sty: {'name': '故事', 'checked': false, 'list': {
          a: {'name': '增', 'checked': false},
          d: {'name': '删', 'checked': false},
          u: {'name': '改', 'checked': false},
          g: {'name': '查', 'checked': false},
          ad: {'name': '精选', 'checked': false}
        }},
        typ: {'name': '故事类别', 'checked': false, 'list': {
          a: {'name': '增', 'checked': false},
          d: {'name': '删', 'checked': false},
          u: {'name': '改', 'checked': false},
          g: {'name': '查', 'checked': false}
        }},
        cmt: {'name': '故事评论', 'checked': false, 'list': {
          a: {'name': '增', 'checked': false},
          d: {'name': '删', 'checked': false},
          u: {'name': '改', 'checked': false},
          g: {'name': '查', 'checked': false}
        }},
      }},
      aid: {'name': '资助管理', 'checked': false, 'list': {
        apl: {'name': '资助申请', 'checked': false, 'list': {
          a: {'name': '增', 'checked': false},
          d: {'name': '删', 'checked': false},
          u: {'name': '改', 'checked': false},
          g: {'name': '查', 'checked': false},
          v: {'name': '改状态（分区权限）', 'checked': false},
        }},
        aid: {'name': '资助单', 'checked': false, 'list': {
          a: {'name': '增', 'checked': false},
          d: {'name': '删', 'checked': false},
          u: {'name': '改', 'checked': false},
          g: {'name': '查', 'checked': false},
          v: {'name': '改状态', 'checked': false}
        }},
        dtl: {'name': '资助明细', 'checked': false, 'list': {
          a: {'name': '增', 'checked': false},
          d: {'name': '删', 'checked': false},
          u: {'name': '改', 'checked': false},
          g: {'name': '查', 'checked': false},
        }},
        sav: {'name': '故事审核', 'checked': false, 'list': {
          g: {'name': '查', 'checked': false},
          v: {'name': '审核（分区权限）', 'checked': false},
        }},
        msg: {'name': '资助回复', 'checked': false, 'list': {
          a: {'name': '增', 'checked': false},
          d: {'name': '删', 'checked': false},
          u: {'name': '改', 'checked': false},
          g: {'name': '查', 'checked': false}
        }}
      }},
      atc: {'name': '文章管理', 'checked': false, 'list': {
        atc: {'name': '文章', 'checked': false, 'list': {
          a: {'name': '增', 'checked': false},
          d: {'name': '删', 'checked': false},
          u: {'name': '改', 'checked': false},
          g: {'name': '查', 'checked': false}
        }},
      }},
      svy: {'name': '调查问卷管理', 'checked': false, 'list': {
        svy: {'name': '调查问卷', 'checked': false, 'list': {
          a: {'name': '增', 'checked': false},
          d: {'name': '删', 'checked': false},
          u: {'name': '改', 'checked': false},
          g: {'name': '查', 'checked': false},
          ok: {'name': '发布', 'checked': false},
          end: {'name': '完结', 'checked': false}
        }},
      }},
      dts: {'name': '数据中心', 'checked': false, 'list': {
        atb: {'name': '数据查询', 'checked': false},
        cnt: {'name': '统计', 'checked': false},
      }},
      cht: {'name': '跨网通', 'checked': false, 'list': {
        act: {'name': '单聊', 'checked': false, 'list': {
          all: {'name': '全部', 'checked': false},
          area: {'name': '分区（分区权限）', 'checked': false},
        }},
        psh: {'name': '推送', 'checked': false, 'list': {
          all: {'name': '全部', 'checked': false},
          area: {'name': '分区（分区权限）', 'checked': false},
        }}
      }},
      wcg: {'name': '网站管理', 'checked': false}
    }
  }
}

export function sha256Password(user: Member|Admin) {
  return sha256(user.account + user.password + user.createdTime.getTime() + config.passwordSalt)
}

export function tableQuery(query: any, searchKeys?: string[], defaultValue?: {page?: number, limit?: number}) {
  let page = defaultValue && defaultValue.page != null ? defaultValue.page : 1
  if (query['_page']) {
    let temp = parseInt(query['_page'])
    if (temp > 0) {
      page = temp
    }
  }

  let limit = defaultValue && defaultValue.limit != null ? defaultValue.limit : 10
  if (query['_limit']) {
    let temp = parseInt(query['_limit'])
    if (temp > 0) {
      limit = temp
    }
  }

  let searches: {[key: string]: any} = {}

  if (query && searchKeys) {
    for (const key in query) {
      const value = query[key]

      if (searchKeys.includes(key)) {
        searches[key] = value
      }
    }
  }

  return {
    page, limit, searches
  }
}




export function tableResponse(datasAndCount: [any[], number], page: number, limit: number, url?: string, searches?: {[key: string]: any}) {

  if (url) {
    let reg = new RegExp('([?&])' + '_page' + '=[^&]+(&|$)')
    if (reg.test(url)) {
      url = url.replace(reg, '$1')
    }
    reg = new RegExp('([?&])' + '_limit' + '=[^&]+(&|$)')
    if (reg.test(url)) {
      url = url.replace(reg, '$1')
    }
    if (url[url.length - 1] !== '&' && url[url.length - 1] !== '?') {
      if (/\?/.test(url)) {
        url += '&'
      } else {
        url += '?'
      }
    }
  }

  return {
    datas: datasAndCount[0],
    count: datasAndCount[1],
    page,
    limit,
    maxPage: Math.ceil(datasAndCount[1] / limit),
    url,
    searches,
    // rowDatas: encodeURIComponent(JSON.stringify(arrayToMap(datasAndCount[0]))),
  }
}


export function arrayToMap(array: Array<any>) {
  let map: any = {}
  for (let i = 0; i < array.length; i++) {
    map[array[i].id] = array[i]
  }
  return map
}


export function createExcel(cfg: {headers: {label: string, callback: Function}[], datas: any[], sheetName: string, opts?: any}[]) {
  let wb: any = {SheetNames: [], Sheets: {}}
  for (let i of cfg) {
    wb.SheetNames.push(i.sheetName)
    let cell: any = {}
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


export async function downloadImg(url: string, to: string) {
  await new Promise((resolve, reject) => {
    http.get(url, function(res) {
      let imgData = ''
      res.setEncoding('binary')
      res.on('data', function(chunk) {imgData += chunk})
      res.on('end', function() {
        fs.writeFile(path.join(__dirname, '../../../', to), imgData, 'binary', function(err) {
          if (err) {
            reject()
          }
          else {
            resolve()
          }
        })
      })
    })
  })
}

