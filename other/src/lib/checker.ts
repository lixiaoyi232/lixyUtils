import { AppError } from '.'
import { JSDOM } from 'jsdom'
const createDOMPurify = require('dompurify')
const window = (new JSDOM('')).window
const DOMPurify = createDOMPurify(window)


class Checker {

  private value: any
  private errMsgTitle: string

  constructor(value: any, errMsgTitle?: string) {
    this.value = value
    this.errMsgTitle = errMsgTitle || '该项'
  }

  array<T>(func: (item: any, index: number, arr: any[]) => T, errMsg?: string) {
    if (!Array.isArray(this.value)) {
      throw new AppError(errMsg || this.errMsgTitle + '不是数组')
    }
    return this.value.map(func)
  }

  toSafeString() {
    return DOMPurify.sanitize(String(this.value)) as string
  }

  toString() {
    return String(this.value)
  }

  toNumber() {
    return Number(this.value)
  }

  toBoolean() {
    if (this.value === 'false') {
      return false
    }
    return Boolean(this.value)
  }

  isMatch(regex: RegExp, errMsg?: string) {
    if (!regex.test(this.value)) {
      throw new AppError(errMsg || this.errMsgTitle + '没有匹配该正则表达式')
    }
    return this
  }

  isNotNull(errMsg?: string) {
    if (this.value == null || this.value === '') {
      throw new AppError(errMsg || this.errMsgTitle + '不能为空')
    }
    return this
  }

  isObject(errMsg?: string) {
    if (!(this.value instanceof Object)) {
      throw new AppError(errMsg || this.errMsgTitle + '必须是对象')
    }
    return this
  }

  isBoolean(errMsg?: string) {
    if (!/^(true|false)$/.test(this.value)) {
      throw new AppError(errMsg || this.errMsgTitle + '必须是布尔值')
    }
    return this
  }

  isInt(errMsg?: string) {
    if (!/^\d+$/.test(this.value)) {
      throw new AppError(errMsg || this.errMsgTitle + '必须是整数')
    }
    return this
  }

  isFloat(decimalPlaces?: number, errMsg?: string) {
    let str
    if (decimalPlaces) {
      str = `^\\d+\\.\\d{1,${decimalPlaces}}$`
    } else {
      str = `^\\d+\\.\\d+$`
    }
    let regex = new RegExp(str)
    if (!regex.test(this.value)) {
      throw new AppError(errMsg || this.errMsgTitle + '必须是小数')
    }
    return this
  }

  isString(errMsg?: string) {
    if (typeof this.value !== 'string' || !/^.*$/.test(this.value)) {
      throw new AppError(errMsg || this.errMsgTitle + '必须是字符串')
    }
    return this
  }

  isEnum(enumObj: any, errMsg?: string) {
    return this.isIn(Object.values(enumObj), errMsg)
  }

  isLength(min?: number, max?: number, errMsg?: string) {
    let str
    let msg
    if (min != null && max != null) {
      str = `^.{${min},${max}}$`
      msg = '必须在' + min + '到' + max + '个字符之内'
    } else if (min != null) {
      str = `^.{${min},}$`
      msg = '至少要有' + min + '个字符'
    } else if (max != null) {
      str = `^.{1,${max}}$`
      msg = '必须在1到' + max + '个字符之内'
    } else {
      str = '^.+$'
      msg = '至少要有1个字符'
    }
    let regex = new RegExp(str)
    if (!regex.test(this.value)) {
      throw new AppError(errMsg || this.errMsgTitle + msg)
    }
    return this
  }

  isEqual(target: any, errMsg?: string) {
    if (this.value !== target) {
      throw new AppError(errMsg || this.errMsgTitle + '必须和另外一项相同')
    }
    return this
  }

  isIn(strs: string[], errMsg?: string) {
    if (typeof this.value !== 'string' || !strs.includes(this.value)) {
      throw new AppError(errMsg || this.errMsgTitle + '必须是[' + strs.join(',') + ']其中之一')
    }
    return this
  }

  isPhone(errMsg?: string) {
    let regex = /(^1[34578]\d{9}$|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/
    if (!regex.test(this.value)) {
      throw new AppError(errMsg || this.errMsgTitle + '不是电话号码格式')
    }
    return this
  }

  isCellPhone(errMsg?: string) {
    if (!/^1[34578]\d{9}$/.test(this.value)) {
      throw new AppError(errMsg || this.errMsgTitle + '不是联系手机格式')
    }
    return this
  }

  isDate(errMsg?: string) {
    let regex = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/
    if (!regex.test(this.value)) {
      throw new AppError(errMsg || this.errMsgTitle + '不是日期格式')
    }
    return this
  }

  isYear(errMsg?: string) {
    if (!/^\d+$/.test(this.value)) {
      throw new AppError(errMsg || this.errMsgTitle + '不是年份格式')
    }
    return this
  }

  isChinese(errMsg?: string) {
    if (typeof this.value !== 'string' || !/^[\u4e00-\u9fa5]+$/.test(this.value)) {
      throw new AppError(errMsg || this.errMsgTitle + '不是中文')
    }
    return this
  }

  isChineseIdentifier(errMsg?: string) {
    if (typeof this.value !== 'string' || !/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(this.value)) {
      throw new AppError(errMsg || this.errMsgTitle + '不能包含特殊字符')
    }
    return this
  }

  isIdentifier(errMsg?: string) {
    if (typeof this.value !== 'string' || !/^[a-zA-Z0-9_]+$/.test(this.value)) {
      throw new AppError(errMsg || this.errMsgTitle + '只能包含数字、字母和下划线')
    }
    return this
  }

  isASCII(errMsg?: string) {
    if (typeof this.value !== 'string' || !/^[\x00-\xff]+$/.test(this.value)) {
      throw new AppError(errMsg || this.errMsgTitle + '不能包含中文和特殊字符')
    }
    return this
  }

  isAccount(errMsg?: string) {
    if (typeof this.value !== 'string' || !/^[a-zA-Z0-9_@.]+$/.test(this.value)) {
      throw new AppError(errMsg || this.errMsgTitle + '只能包含数字、字母、下划线、@和.')
    }
    return this
  }

  /*
    * 身份证15位编码规则：dddddd yymmdd xx p
    * dddddd：6位地区编码
    * yymmdd: 出生年(两位年)月日，如：910215
    * xx: 顺序编码，系统产生，无法确定
    * p: 性别，奇数为男，偶数为女
    *
    * 身份证18位编码规则：dddddd yyyymmdd xxx y
    * dddddd：6位地区编码
    * yyyymmdd: 出生年(四位年)月日，如：19910215
    * xxx：顺序编码，系统产生，无法确定，奇数为男，偶数为女
    * y: 校验码，该位数值可通过前17位计算获得
    *
    * 前17位号码加权因子为 Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ]
    * 验证位 Y = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ]
    * 如果验证码恰好是10，为了保证身份证是十八位，那么第十八位将用X来代替
    * 校验位计算公式：Y_P = mod( ∑(Ai×Wi),11 )
    * i为身份证号码1...17 位; Y_P为校验码Y所在校验码数组位置
  */
  isIdCard(errMsg?: string) {
    // 15位和18位身份证号码的正则表达式
    let regex = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/

    // 如果通过该验证，说明身份证格式正确，但准确性还需计算
    if (regex.test(this.value)) {
      if (this.value.length === 18) {
        let idCardWi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ] // 将前17位加权因子保存在数组里
        let idCardY = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ] // 这是除以11后，可能产生的11位余数、验证码，也保存成数组
        let idCardWiSum = 0 // 用来保存前17位各自乖以加权因子后的总和
        for (let i = 0; i < 17; i++) {
          idCardWiSum += this.value.substr(i, 1) * idCardWi[i]
        }
        let idCardMod = idCardWiSum % 11 // 计算出校验码所在数组的位置
        let idCardLast = this.value.substr(17, 1) // 得到最后一位身份证号码
        // 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
        if (idCardMod === 2) {
          if (idCardLast === 'X' || idCardLast === 'x') {
          } else {
            throw new AppError(errMsg || this.errMsgTitle + '错误')
          }
        } else {
          // 用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
          if (idCardLast === String(idCardY[idCardMod])) {
          } else {
            throw new AppError(errMsg || this.errMsgTitle + '错误')
          }
        }
      }
    } else {
      throw new AppError(errMsg || this.errMsgTitle + '格式错误')
    }

    return this
  }

  isEmail(errMsg?: string) {
    if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(this.value)) {
      throw new AppError(errMsg || this.errMsgTitle + '格式错误')
    }
    return this
  }
}

export function check(value: any, errMsgTitle?: string) {
  return new Checker(value, errMsgTitle)
}

