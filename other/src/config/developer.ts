export let config = {
  env: 'developer',
  port: 3000,
  orm: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'wase234ybb',
    database: 'b',
    logging: true,
    synchronize: true,
    cache: {
      type: 'ioredis',
      options: {
        host: 'localhost',
        port: 6379,
        db: 0
      }
    }
  },
  useRedis: true,
  redis: {
    host: 'localhost',
    port: 6379,
    db: 0
  },
  cookieKeys: ['salt:jixidao2018'],
  session: {
    key: 'skey',
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    signed: true,
    rolling: false,
    renew: true
  },
  static: {
    static: {
      buffer: false,                           // 是否在服务器端做内存缓存
      dynamic: true,                           // 是否允许动态读取文件，即服务器程序启动后，再往该目录添加的文件是否可以访问到
      preload: false                           // 是否预先读取文件，即服务器启动时，就读取所有该目录文件，并生成文件列表，并不一定缓存内容
    },
    uploads: {
      buffer: false,                           // 是否在服务器端做内存缓存
      dynamic: true,                           // 是否允许动态读取文件，即服务器程序启动后，再往该目录添加的文件是否可以访问到
      preload: false                           // 是否预先读取文件，即服务器启动时，就读取所有该目录文件，并生成文件列表，并不一定缓存内容
    }
  },
  nunjucks: {
    noCache: true
  },
  passwordSalt: 'huanxidao'
}
