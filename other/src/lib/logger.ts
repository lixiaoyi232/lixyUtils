import moment from 'moment'
import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
const log4js = require('log4js')

import { config } from '../config/config'


// 日志根目录
let baseLogPath = path.resolve(__dirname, '../../logs')

let errorPath = '/error'
let errorLogPath = baseLogPath + errorPath + '/error'

let accessPath = '/access'
let accessLogPath = baseLogPath + accessPath + '/access'


if (config.env === 'production') {
  fs.ensureDirSync(baseLogPath)
  fs.ensureDirSync(baseLogPath + errorPath)
  fs.ensureDirSync(baseLogPath + accessPath)
}


log4js.addLayout('myFile', function (config: any) {
  return function (logEvent: any) {
    return `[${moment(logEvent.startTime).format('YYYY-MM-DD HH:mm:ss.SSS')}] [${logEvent.level.levelStr}] ${logEvent.data[0]}`
  }
})

log4js.addLayout('myStdout', function (config: any) {
  return function (logEvent: any) {
    let str = `[${logEvent.level.levelStr}] ${logEvent.data[0]}`
    if (logEvent.level.levelStr === 'error' || logEvent.level.levelStr === 'fatal' || logEvent.level.levelStr === 'warn') {
      str = chalk.red(str)
    } else {
      str = chalk.yellow(str)
    }
    return str
  }
})

let configProduction = {
  appenders: {
    errorLogger: {
      type:                 'dateFile',          // 日志类型
      filename:             errorLogPath,        // 日志输出位置
      alwaysIncludePattern: true,                // 是否总是有后缀名
      pattern:              '-yyyy-MM-dd.log',   // 后缀，每天创建一个新的日志文件
      layout:               { type: 'myFile' }   // 输出格式
    },
    accessLogger: {
      type:                 'dateFile',
      filename:             accessLogPath,
      alwaysIncludePattern: true,
      pattern:              '-yyyy-MM-dd.log',
      layout:               { type: 'myFile' }
    }
  },
  categories: {
    default:      { appenders: ['accessLogger'], level: 'info' },
    errorLogger:  { appenders: ['errorLogger'],  level: 'error' },
    accessLogger: { appenders: ['accessLogger'], level: 'info' }
  }
}

let configDevelopment = {
  appenders: {
    stdout: {
      type:   'stdout',
      layout: { type: 'myStdout' }
    }
  },
  categories: {
    default:      { appenders: ['stdout'], level: 'all' },
    errorLogger:  { appenders: ['stdout'], level: 'error' },
    accessLogger: { appenders: ['stdout'], level: 'info' }
  }
}

if (config.env === 'production') {
  log4js.configure(configProduction)
} else {
  log4js.configure(configDevelopment)
}





let errorLogger  = log4js.getLogger('errorLogger')
let accessLogger = log4js.getLogger('accessLogger')


export let logger = {
  trace(message: string) {
    accessLogger.trace(message)
  },
  debug(message: string) {
    accessLogger.debug(message)
  },
  info(message: string) {
    accessLogger.info(message)
  },
  warn(message: string) {
    accessLogger.warn(message)
  },
  error(message: string) {
    errorLogger.error(message)
  },
  fatal(message: string) {
    errorLogger.fatal(message)
  }
}
