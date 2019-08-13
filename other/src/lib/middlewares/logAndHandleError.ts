import bytes from 'bytes'
import { Koa, logger, AppError } from '..'

export function logAndHandleError() {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    const start = new Date()
    try {
      await next()

      let ms = new Date().getTime() - start.getTime()
      logAccess(ctx, ms)
    } catch (error) {
      let isAjax = ctx.isAjax()

      if (error instanceof AppError) {
        ctx.status = 200
        let result = {
          error: error.message,
          ...error
        } // AppError json

        if (isAjax) {
          ctx.body = result
        } else {
          if (error.redirect) {
            if (error.redirect.indexOf('?') === -1) ctx.redirect(error.redirect + '?_error=' + encodeURIComponent(error.message))
            else ctx.redirect(error.redirect + '&_error=' + encodeURIComponent(error.message))
          } else {
            ctx.body = '<pre>' + JSON.stringify(result, null, 2) + '</pre>'
          }
        }

        let ms = new Date().getTime() - start.getTime()
        logAccess(ctx, ms)
      } else {
        ctx.status = 500
        if (isAjax) {
          ctx.body = error.stack // 500 json
        } else {
          ctx.body = '<h1>500</h1><pre>' + error.stack + '</pre>'
        }

        let ms = new Date().getTime() - start.getTime()
        logError(ctx, error, ms)
      }
    }

    if (ctx.status === 404) {
      ctx.body = '<h1>404 not found</h1>'
      ctx.status = 404
    }
  }
}


function logAccess(ctx: Koa.Context, resTime: number) {
  let text = `${ctx.method} ${ctx.url} ${ctx.status} ${resTime}ms ${bytes(ctx.length || 0).toLowerCase()}`
  logger.info(text)
}

function logError(ctx: Koa.Context, err: Error, resTime: number) {
  let text = `${ctx.method} ${ctx.url} ${ctx.status} ${resTime}ms ${bytes(ctx.length || 0).toLowerCase()}` + '\n' + err.stack
  logger.error(text)
}


