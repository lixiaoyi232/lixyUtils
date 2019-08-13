import { Koa, redis, uuid22 } from '..'

type SessionOption = {
  key: string,
  maxAge: number,
  httpOnly: boolean,
  sameSite: string,
  signed: boolean,
  rolling: boolean,
  renew: boolean,
}

export function session(opt: SessionOption) {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    ctx.session = new Session(ctx, opt)
    // const token = ctx.request.header['x-auth-token']
    const token = ctx.cookies.get(opt.key, { signed: opt.signed })
    await ctx.session.init(token)
    await next()
    await ctx.session.save()
  }
}

export class Session {

  private token: string = ''
  private data: any = {}

  private opt: SessionOption
  private ctx: Koa.Context

  private oldRedisKeys: any = {}
  private changed: string[] = []
  private removed: string[] = []
  private visited: string[] = []

  constructor(ctx: Koa.Context, opt: SessionOption) {
    this.ctx = ctx
    this.opt = opt
  }

  async init(token?: string) {
    if (token) {
      let tokenKey = 'auth_token:' + token
      let tokenDataString = await redis.get(tokenKey)
      let tokenData = JSON.parse(tokenDataString)
      if (tokenData) {
        let count = 0
        for (const key in tokenData) {
          let valueString = await redis.get(tokenData[key])
          if (valueString) {
            this.data[key] = JSON.parse(valueString)
            count++
          }
        }
        if (count > 0) {
          this.token = token
        } else {
          await redis.del(tokenKey)
          this.ctx.cookies.set(this.opt.key, '')
        }
      }
    }
  }

  get(key: string) {
    this.visited.push(key)
    return this.data[key]
  }

  set(key: string, value: any) {
    if (!('id' in value)) {
      throw new Error('session data must have "id" property')
    }
    if (!this.oldRedisKeys[key] && this.data[key]) {
      this.oldRedisKeys[key] = 'auth_' + key + ':' + this.data[key].id
    }
    this.data[key] = value
    this.changed.push(key)

    if (!this.token) {
      this.token = uuid22()
    }
  }

  has(key: string) {
    return key in this.data
  }

  remove(key: string) {
    this.removed.push(key)
  }

  async save() {
    if (!this.token) {
      return
    }

    let tokenData: any = {}
    let count = 0
    let shouldSave = false

    for (const key in this.data) {
      const redisKey = 'auth_' + key + ':' + this.data[key].id

      if (this.removed.includes(key)) {
        delete this.data[key]
        await redis.del(redisKey)
        continue
      }

      if (this.changed.includes(key)) {
        await redis.set(redisKey, JSON.stringify(this.data[key]), 'PX', this.opt.maxAge)

        const oldRedisKey = this.oldRedisKeys[key] || redisKey
        if (oldRedisKey !== redisKey) {
          await redis.del(oldRedisKey)
        }

        shouldSave = true

      } else if (this.opt.rolling && this.visited.includes(key)) {
        await redis.set(redisKey, JSON.stringify(this.data[key]), 'PX', this.opt.maxAge)
        shouldSave = true

      } else if (this.opt.renew && this.visited.includes(key)) {
        let ms = await redis.pttl(redisKey)
        if (ms < this.opt.maxAge / 2) {
          await redis.set(redisKey, JSON.stringify(this.data[key]), 'PX', this.opt.maxAge)
          shouldSave = true
        }
      }


      count++
      tokenData[key] = redisKey
    }

    let tokenKey = 'auth_token:' + this.token
    if (count === 0) {
      await redis.del(tokenKey)
      this.ctx.cookies.set(this.opt.key, '')
    } else if (shouldSave) {
      await redis.set(tokenKey, JSON.stringify(tokenData), 'PX', this.opt.maxAge)
      this.ctx.cookies.set(this.opt.key, this.token, {
        httpOnly: this.opt.httpOnly,
        maxAge: this.opt.maxAge,
        sameSite: this.opt.sameSite as 'lax' | 'strict',
        signed: this.opt.signed,
      })
    }

  }
}
