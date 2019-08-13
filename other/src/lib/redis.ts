import Redis from 'ioredis'
import { config } from '../config/config'


declare module 'ioredis' {
  interface Redis {
    pttl(key: string): Promise<number>
  }
}


export let redis = new Redis({
  port: config.redis.port,
  host: config.redis.host,
  db: config.redis.db
})
