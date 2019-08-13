import * as path from 'path'
import * as url from 'url'
import { Koa } from '..'


export function ctxMethods() {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    console.log(`${ctx.request.method}    ${(new Date()).toLocaleDateString()} ${(new Date()).toLocaleTimeString()}    ${ctx.request.url}`)
    ctx.isAjax = () => {
      return ctx.request.method !== 'GET' || path.basename(url.parse(ctx.url).pathname as string) === 'json' || path.basename(url.parse(ctx.url).pathname as string) === 'table'
    }
    await next()
    console.log(`${ctx.request.method}    ${(new Date()).toLocaleDateString()} ${(new Date()).toLocaleTimeString()}    ${ctx.request.url} OK!!!!`)
  }
}
