require('source-map-support').install()
import 'reflect-metadata'
import { createConnection, getRepository } from 'typeorm'
import path from 'path'
import qr from 'qr-image'
import bodyParser from 'koa-bodyparser'
import koaLogger from 'koa-logger'
import Router from 'koa-router'
let view = require('koa-view')
const staticCache = require('koa-static-cache')
const xmlParser = require('koa-xml-body')
import http from 'http'
import https from 'https'
import fs from 'fs-extra'
import sslify from 'koa-sslify'

import { Koa, logger, logAndHandleError, error, session, uploadSingle, ctxMethods } from './lib'
import { config } from './config/config'
import * as njkFilters  from './app/nunjucks-filters'
import { WebConfig } from './app/entities/web-config'



 (async function init() {
  // typeorm
  const connectionOptions = Object.assign({
    entities: [
      path.join(__dirname, 'app/entities/**/*.js')
    ],
  }, config.orm)
  await createConnection(connectionOptions as any)

  // koa app
  const app = new Koa()

  // cookieKeys
  app.keys = config.cookieKeys

  // force https on all pages
  app.use(sslify({}))

  // ctx methods
  app.use(ctxMethods())

  // logAndHandleError
  if (config.env === 'production') {
    app.use(logAndHandleError())
  } else {
    app.use(koaLogger())
    app.use(error())
  }

  app.use(async (ctx: Koa.Context, next: Koa.Next) => {
    await next()
    if (ctx.path.startsWith('/uploads/dfiles/')) ctx.response.set('Content-Disposition', 'attachment; filename=' + encodeURIComponent(ctx.query.filename))
  })

  // koa-static-cache
  const staticConfig = Object.assign({
    dir: path.join(__dirname, '../static'),  // 静态文件目录
    prefix: '/static',                       // url访问时访问前缀路径
    // maxAge: 365 * 24 * 60 * 60,              // 浏览器缓存有效时间
    // cacheControl: '',                        // 浏览器缓存另外一种控制时间的方式
    buffer: true,                            // 是否在服务器端做内存缓存
    // gzip: true,                              // 传输时，若浏览器支持的化，是否使用gzip压缩
    // usePrecompiledGzip: true,                // 若能使用gzip压缩传输，是否提前预先压缩
    // filter: function | array,                // 过滤器，可以过滤哪些文件可以被访问，哪些不可以
    dynamic: true,                           // 是否允许动态读取文件，即服务器程序启动后，再往该目录添加的文件是否可以访问到
    preload: true                            // 是否预先读取文件，即服务器启动时，就读取所有该目录文件，并生成文件列表，并不一定缓存内容
  }, config.static.static)
  app.use(staticCache(staticConfig))

  const uploadsConfig = Object.assign({
    dir: path.join(__dirname, '../uploads'),  // 静态文件目录
    prefix: '/uploads',                       // url访问时访问前缀路径
    // maxAge: 365 * 24 * 60 * 60,              // 浏览器缓存有效时间
    // cacheControl: '',                        // 浏览器缓存另外一种控制时间的方式
    buffer: false,                            // 是否在服务器端做内存缓存
    // gzip: true,                              // 传输时，若浏览器支持的化，是否使用gzip压缩
    // usePrecompiledGzip: true,                // 若能使用gzip压缩传输，是否提前预先压缩
    // filter: function | array,                // 过滤器，可以过滤哪些文件可以被访问，哪些不可以
    dynamic: true,                           // 是否允许动态读取文件，即服务器程序启动后，再往该目录添加的文件是否可以访问到
    preload: false                           // 是否预先读取文件，即服务器启动时，就读取所有该目录文件，并生成文件列表，并不一定缓存内容
  }, config.static.uploads)
  app.use(staticCache(uploadsConfig))

  // session
  app.use(session(Object.assign({
    key: 'skey',
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    signed: true,
    rolling: false,
    renew: true
  }, config.session)))

  app.use(xmlParser({xmlOptions: {explicitArray: false}})) // 解析xml格式为object
  // bodyParser
  app.use(bodyParser())

  // koa-view  nunjucks
  app.use(view(
    path.join(__dirname, '../views'),
    Object.assign({
      ext: 'html',
      filters: njkFilters
    }, config.nunjucks)
  ))


  app.use(async (ctx: Koa.Context, next: Koa.Next) => {
    let webConfig: WebConfig|undefined
    if (!ctx.path.startsWith('/admin/')) webConfig = (await getRepository(WebConfig).find({where: {key: 'webConfig'}, cache: {id: 'webConfig', milliseconds: 3600000}}))[0]
    if (webConfig != null) ctx.state.webConfig = JSON.parse(webConfig.value)
    await next()
  })

  // router
  let router = new Router()
  let routes = require('./app/routes').routes
  for (let [method, url, ...middlewares] of routes) {
    (router as any)[method](url, ...middlewares)
  }
  router.post('/upload', uploadSingle('file'), async (ctx: Koa.Context) => {
    ctx.body = {
      url: '/uploads/temp/' + ctx.request.file.filename,
      name: ctx.request.file.filename,
    }
    ctx.type = 'text/html'
  })
  router.get('/qrcode', async (ctx: Koa.Context) => {
    ctx.body = qr.image(ctx.query.text)
    ctx.type = 'image/png'
  })
  router.get('/MP_verify_Gg919QrlpniIGp1T.txt', async (ctx: Koa.Context) => {
    ctx.body = await fs.readFile(path.join(__dirname, '../files/wechat/MP_verify_Gg919QrlpniIGp1T.txt'))
    ctx.type = 'text/plain'
  })
  app.use(router.routes())
  app.use(router.allowedMethods())

  // SSL options
  let sslOptions = {
    key: fs.readFileSync(path.join(__dirname, '../files/ssl/server.key')),  // 私钥
    cert: fs.readFileSync(path.join(__dirname, '../files/ssl/server.pem'))  // 证书
  }
  // listen on the port
  let server = http.createServer(app.callback())
  server.listen(config.port, () => {
    logger.info('app listening on port ' + config.port)
  })
  let httpsServer = https.createServer(sslOptions, app.callback())
  httpsServer.listen(443, () => {
    logger.info('app listening on port ' + 443)
  })
  server.keepAliveTimeout = 10 * 1000
  httpsServer.keepAliveTimeout = 10 * 1000

  // listen on the port
  // let server = app.listen(config.port, () => {
  //   logger.info('app listening on port ' + config.port)
  // })
  // server.keepAliveTimeout = 10 * 1000

  // 定时任务
  await import('./app/cron')

})().catch((error) => logger.error(error.stack))
