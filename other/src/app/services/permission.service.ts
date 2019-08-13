import { Koa, AppError } from '../../lib'
import { MemberType, VerifyStatus, ArticleType } from '../entities/enum'

export function websiteWhatEver(ctx: Koa.Context) {
  if (ctx.session.has('member')) {
    ctx.state.curMember = ctx.session.get('member')
  }
  ctx.state.MemberType = MemberType
  ctx.state.VerifyStatus = VerifyStatus
  ctx.state.ArticleType = ArticleType
  ctx.state.encodedUrl = encodeURIComponent(ctx.url)
}

export function websiteNeedLogin(ctx: Koa.Context) {
  if (!ctx.session.has('member')) {
    throw new AppError({message: '您没有登录，无法执行该操作。', redirect: '/login'})
  } else {
    ctx.state.curMember = ctx.session.get('member')
    ctx.state.MemberType = MemberType
    ctx.state.VerifyStatus = VerifyStatus
    ctx.state.ArticleType = ArticleType
    ctx.state.encodedUrl = encodeURIComponent(ctx.url)
  }
}

export function adminNeedLogin(ctx: Koa.Context) {
  if (!ctx.session.has('admin')) {
    throw new AppError({message: '您没有登录，无法执行该操作。', redirect: '/admin/login'})
  } else {
    ctx.state.curAdmin = ctx.session.get('admin')
    ctx.state.encodedUrl = encodeURIComponent(ctx.url)
  }
}

export function adminNeedSuperUser (ctx: Koa.Context) {
  if (!ctx.session.has('admin')) {
    throw new AppError({message: '您没有登录，无法执行该操作。', redirect: '/admin/login'})
  } else {
    ctx.state.curAdmin = ctx.session.get('admin')
    ctx.state.encodedUrl = encodeURIComponent(ctx.url)

    if (!ctx.session.get('admin').isSuperUser) {
      if (ctx.isAjax()) {
        throw new AppError('您没有权限，无法执行该操作。')
      } else {
        throw new AppError('<h1>您没有权限</h1>')
      }
    }
  }
}

export function adminNeedPermission (ctx: Koa.Context, permissionName: string) {
  if (!ctx.session.has('admin')) {
    throw new AppError({message: '您没有登录，无法执行该操作。', redirect: '/admin/login'})
  } else {
    ctx.state.curAdmin = ctx.session.get('admin')
    ctx.state.ctxUrl = ctx.url
    if (!ctx.session.get('admin').isSuperUser && ctx.session.get('admin').permissions[permissionName] == null) {
      if (ctx.isAjax()) {
        throw new AppError('您没有权限，无法执行该操作。')
      } else {
        throw new AppError('<h1>您没有权限</h1>')
      }
    }
  }
}
