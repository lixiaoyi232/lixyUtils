import path from 'path'
import fs from 'fs-extra'
import moment from 'moment'
import chalk from 'chalk'
import { getRepository } from 'typeorm'

import { kebabCaseToCamelCase, kebabCaseToPascalCase } from '../../lib'
import { MigrationSeed } from '../entities/migration-seed'



const seedsDirPathDist = path.join(__dirname, '../../../dist/app/seeds')
const seedsDirPathSrc = path.join(__dirname, '../../../src/app/seeds')

const seedRepo = getRepository(MigrationSeed)

async function seedOne(fileName: string) {
  let filePath = path.join(seedsDirPathDist, fileName)
  let hasExisted = await fs.pathExists(filePath)
  if (!hasExisted) {
    console.log('Error: ' + fileName + ' does not exist')
    return
  }
  if (fileName.endsWith('.seed.js') || fileName.endsWith('.seed-test.js')) {
    let seed = require(filePath)
    if (!seed.up) {
      console.log('Error: ' + fileName + ' does not have "up" method')
      return
    }
    await seed.up()

    let migrationSeed = new MigrationSeed()
    migrationSeed.name = fileName
    await seedRepo.save(migrationSeed)

    console.log('Seed: ' + fileName)
  }
}

export async function seedByFileName(fileName: string) {
  let migrationSeed = await seedRepo.findOne({name: fileName})
  if (migrationSeed) {
    console.log('Error: ' + fileName + ' has already done')
    return
  }

  await seedOne(fileName)
}

export async function seedAll(isProd: boolean) {
  try {
    let fileNames = fs.readdirSync(seedsDirPathDist)
    if (isProd) {
      fileNames = fileNames.filter(v => !v.endsWith('.seed-test.js'))
    }
    fileNames.sort()
    for (let fileName of fileNames) {
      let migrationSeed = await seedRepo.findOne({name: fileName})
      if (migrationSeed) {
        continue
      }

      await seedOne(fileName)
    }
  } catch (error) {
    console.log(error)
  }
}

async function rollbackOne(migrationSeed: MigrationSeed) {
  let fileName = migrationSeed.name
  let filePath = path.join(seedsDirPathDist, fileName)
  let hasExisted = await fs.pathExists(filePath)
  if (!hasExisted) {
    console.log('Error: ' + fileName + ' does not exist')
    return
  }

  if (fileName.endsWith('.seed.js') || fileName.endsWith('.seed-test.js')) {
    let seed = require(filePath)
    if (!seed.down) {
      console.log('Error: ' + fileName + ' does not have "down" method')
      return
    }
    await seed.down()
  }

  await seedRepo.remove(migrationSeed)

  console.log('Seed Rollback: ' + fileName)
}

export async function rollbackByFileName(fileName: string) {
  let migrationSeed = await seedRepo.findOne({name: fileName})
  if (migrationSeed) {
    await rollbackOne(migrationSeed)
  }
}

export async function rollback(n: number) {
  try {
    let migrationSeeds = await seedRepo.find({
      order: { createdTime: 'DESC' }
    })

    let count = 0
    if (n < 0) {
      count = migrationSeeds.length < -n ? 0 : migrationSeeds.length - (-n)
    } else {
      count = migrationSeeds.length > n ? n : migrationSeeds.length
    }

    for (let i = 0; i < count; i++) {
      const m = migrationSeeds[i]
      await rollbackOne(m)
    }

    // let migrationSeed = await seedRepo.findOne({
    //   order: { createdTime: 'DESC' }
    // })
    // if (migrationSeed) {
      // await rollbackOne(migrationSeed)
    // }
  } catch (error) {
    console.log(error)
  }
}

export async function rollbackAll() {
  try {
    let migrationSeeds = await seedRepo.find({
      order: { createdTime: 'DESC' }
    })

    for (let migrationSeed of migrationSeeds) {
      await rollbackOne(migrationSeed)
    }
  } catch (error) {
    console.log(error)
  }
}

export async function status(isProd: boolean) {
  try {
    let fileNames = fs.readdirSync(seedsDirPathDist)
    let migrationSeeds = await seedRepo.find({
      order: { createdTime: 'ASC' }
    })
    let doneFileNames = migrationSeeds.map(v => v.name)
    let notDoneFileNames = fileNames.filter(v => !doneFileNames.includes(v)).sort()
    if (isProd) {
      doneFileNames = doneFileNames.filter(v => !v.endsWith('.seed-test.js'))
      notDoneFileNames = notDoneFileNames.filter(v => !v.endsWith('.seed-test.js'))
    }

    console.log(chalk.green('== Already Done =='))
    for (let fileName of doneFileNames) {
      console.log(chalk.green('  >>  ' + fileName))
    }
    console.log()
    console.log(chalk.yellow('== Not Done Yet =='))
    for (let fileName of notDoneFileNames) {
      console.log(chalk.yellow('  >>  ' + fileName))
    }
    console.log()

  } catch (error) {
    console.log(error)
  }
}

export async function createSeed(seedName: string, isProd: boolean = false) {
  if (!/^[a-z][a-z\-]*[a-z]$/.test(seedName)) {
    console.log('Error: must use aaa-bbb-ccc form')
    return
  }
  let fileName = moment().format('YYYYMMDDHHmmss') + '-' + seedName
  if (isProd) {
    fileName += '.seed.ts'
  } else {
    fileName += '.seed-test.ts'
  }
  let filePath = path.join(seedsDirPathSrc, fileName)
  if (fs.existsSync(filePath)) {
    console.log('Error: ' + fileName + ' has already existed')
    return
  }

  let objName = kebabCaseToCamelCase(seedName)
  let className = kebabCaseToPascalCase(seedName)

  let data = [
    `import { getManager, Not } from 'typeorm'`,
    `import { ${className} } from '../entities/${seedName}'`,
    ``,
    `export async function up() {`,
    `  let ${objName}: ${className}`,
    `  let list: ${className}[] = []`,
    `  `,
    `  for (let i = 0; i < 10; i++) {`,
    `    ${objName} = new ${className}()`,
    `    list.push(${objName})`,
    `  }`,
    `  `,
    `  await getManager().transaction(async manager => {`,
    `    await manager.save(list)`,
    `  })`,
    `}`,
    ``,
    `export async function down() {`,
    `  await getManager().transaction(async manager => {`,
    `    await manager.delete(${className}, {id: Not(0)})`,
    `  })`,
    `}`,
    ``,
  ].join('\n')

  await fs.writeFile(filePath, data)

  console.log('Created Seed: ' + fileName)

}

