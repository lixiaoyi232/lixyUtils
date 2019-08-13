require('source-map-support').install()
import 'reflect-metadata'
import path from 'path'
import * as yargs from 'yargs'
import { createConnection } from 'typeorm'

import { config } from './config/config'

(async function init() {
  // typeorm
  const connectionOptions = Object.assign({
    entities: [
      path.join(__dirname, 'app/entities/**/*.js'),
      path.join(__dirname, 'cli/entities/**/*.js')
    ],
  }, config.orm)
  connectionOptions.logging = false
  let connection = await createConnection(connectionOptions as any)


  const SeedCliService = await import('./cli/services/seed.cli-service')



  yargs
    .help('h')
    .alias('h', 'help')
    .command(
      '*', '', function (yargs) {
        return yargs
      }, async function (argv) {
        console.log('\n使用 -h 选项，查看命令列表。\n')
        await connection.close()
        process.exit(0)
      })
    .command(
      'seed [seedfile]', '运行所有[或指定]的seed', function (yargs) {
        return yargs.
        option('prod', {
          alias: 'p',
          boolean: true,
          default: false,
          description: '生产环境seed',
        })
      }, async function (argv) {
        if (argv.seedfile) {
          await SeedCliService.seedByFileName(argv.seedfile)
        } else {
          await SeedCliService.seedAll(argv.prod)
        }
        await connection.close()
        process.exit(0)
      })
    .command(
      'seed:rollback [seedfile]', '回滚最近一次执行[或指定][或所有]的seed', function (yargs) {
        return yargs.
          option('all', {
            alias: 'a',
            boolean: true,
            default: false,
            description: '回滚所有seed',
          }).
          option('number', {
            alias: 'n',
            type: 'number',
            default: 1,
            description: '回滚指定数量的seed，若传负数，则是留下多少个seed的意思。',
          })
      }, async function (argv) {
        if (argv.all) {
          await SeedCliService.rollbackAll()
        } else if (argv.seedfile) {
          await SeedCliService.rollbackByFileName(argv.seedfile)
        } else {
          await SeedCliService.rollback(argv.number)
        }
        await connection.close()
        process.exit(0)
      })
    .command(
      'seed:status', '显示状态', function (yargs) {
        return yargs.
        option('prod', {
          alias: 'p',
          boolean: true,
          default: false,
          description: '生产环境seed',
        })
      }, async function (argv) {
        await SeedCliService.status(argv.prod)
        await connection.close()
        process.exit(0)
      })
    .command(
      'seed:create <seedName>', '创建seed文件', function (yargs) {
        return yargs.
        option('prod', {
          alias: 'p',
          boolean: true,
          default: false,
          description: '生产环境seed',
        })
      }, async function (argv) {
        await SeedCliService.createSeed(argv.seedName, argv.prod)
        await connection.close()
        process.exit(0)
      })
    .argv



})().catch((error) => console.log(error))

