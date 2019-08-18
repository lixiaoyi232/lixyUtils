/**
 * 名称：表格数据
 * 构造参数：{
    query: any,                 // 请求中？参数转成的对象
    repo: Repository<any>,      // TypeORM中用于查询数据的对象
    select: string[],           // 查询的字段
    leftJoin?: any,             // 连接
    leftJoinAndSelect?: any,    // 连接并查询
    prop: {[key: string]: {     // 前端form表单中的name
      key: string,              // 查询的字段（例：own.id）
      search: string,           // 查询方式（equal，like，date，between，sub，not，
                                   in，notIn，have）
      from?: any,               // 子查询用，Entity
    }},                            
    default?: any,              // 默认查询条件（不可修改）
    queryDefault?: any,         // 默认查询条件（可被修改）
    limit?: any,                // 手动设置limit
    offset?: any,               // 手动设置offset
    count?: any,                // 手动设置查询到的数据总数
    cache?: string | number[],  // ['keyName', 8 * 60 * 60 * 1000]
    takeAndSkip?: boolean,      // 是否启用take和skip
  }
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
  query: ctx.request.query,
  repo: adminRepo,
  default: {
    isSuperUser: false
  },
  select: ['own.id', 'own.account', 'own.createdTime'],
  prop: {
    isSuperUser: {
      key: 'own.isSuperUser',
      search: 'equal'
    },
    id: {
      key: 'own.id',
      search: 'between'
    },
    createdTime: {
      key: 'own.createdTime',
      search: 'date'
    },
    account: {
      key: 'own.account',
      search: 'like'
    },
    permissions: {
      key: 'own.permissions',
      search: 'like'
    },
  },
}

module.exports = class TableData {
  // query: any
  // order: any
  // repo: Repository<any>
  // select: string[]
  // leftJoin: any
  // leftJoinAndSelect: any
  // prop: {[key: string]: {
  //   key: string,
  //   search: string,
  //   from?: any,
  // }}
  // limit: number | null
  // offset: number
  // count: number | null
  // cache: string | number[] | undefined | null
  constructor (c) {
    this.query = {}
    this.repo = c.repo
    this.leftJoin = c.leftJoin != null ? c.leftJoin : {}
    this.leftJoinAndSelect = c.leftJoinAndSelect != null ? c.leftJoinAndSelect : {}
    this.select = c.select
    this.prop = c.prop != null ? c.prop : {}
    this.order = c.default != null && c.default.order != null ?  this.getOrder(c.default.order) : (c.query != null && c.query.order != null && c.query.order !== '' ? this.getOrder(c.query.order) : (c.queryDefault != null && c.queryDefault.order != null ? this.getOrder(c.queryDefault.order) : this.getOrder(null)))
    this.limit = c.limit != null ? (c.limit !== 'null' ? c.limit : null) : (c.query.limit != null ? c.query.limit : null)
    this.offset = c.offset != null ? (c.offset !== 'null' ? c.offset : 0) : (c.query.page != null ? (c.query.page - 1) * (this.limit ? this.limit : 0) : 0)
    this.count = c.count != null ? c.count : null
    this.cache = c.cache != null ? c.cache : null

    this.takeAndSkip = c.takeAndSkip != null ? c.takeAndSkip : true

    if (c.queryDefault != null) for (let i in c.queryDefault) if (this.prop[i]) this.query[i] = c.queryDefault[i]
    for (let i in c.query) if (this.prop[i]) this.query[i] = c.query[i]
    if (c.default != null) for (let i in c.default) if (this.prop[i]) this.query[i] = c.default[i]
  }

  getOrder(o) {
    let order = {}
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
    let whereObj = {}

    let qb = this.repo.createQueryBuilder('own')
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

if (false) {
  ctx.body = await (new module.exports(pObj)).getTableData()
}
