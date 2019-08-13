import Koa from 'koa'
import multer from 'koa-multer'
import { Session } from '.'


declare module 'koa' {
  interface Context {
    session: Session
    params: any
    isAjax(): boolean
    render(path: string, data: any): boolean
  }
  interface Request {
    file: multer.File
    files: {
        [fieldname: string]: multer.File[]
    } | multer.File[]
  }
  type Next = () => Promise<any>
}

export { Koa }
