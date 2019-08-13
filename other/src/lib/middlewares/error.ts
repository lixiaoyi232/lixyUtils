import chalk from 'chalk'
import { Koa, AppError } from '..'


export function error() {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    try {
      await next()
      if (ctx.type === 'application/json') {
        // console.log(chalk.yellow('RESPONSE: ' + JSON.stringify(ctx.body, null, 2)))
      }
    } catch (error) {
      let isAjax = ctx.isAjax()

      if (error instanceof AppError) {
        ctx.status = 200
        let result = {
          error: error.message,
          msg: error.message,
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

        if (ctx.type === 'application/json') {
          // console.log(chalk.yellow('RESPONSE: ' + JSON.stringify(ctx.body, null, 2)))
        }
      } else {
        ctx.status = 500
        if (isAjax) {
          ctx.body = error.stack // 500 json
        } else {
          ctx.body = '<h1>500</h1><pre>' + error.stack + '</pre>'
        }
        console.error(chalk.red(error.stack))
      }
    }

    if (ctx.status === 404) {
      ctx.body = '<h1>404 not found</h1>'
      ctx.status = 404
    }
  }
}
