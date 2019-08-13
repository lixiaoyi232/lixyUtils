import fs from 'fs-extra'
import path from 'path'
import { config as prodConfig } from './production'

let config = prodConfig

if (process.env.NODE_ENV === 'production') {

} else if (process.env.NODE_ENV === 'test') {
  if (fs.existsSync(path.join(__dirname, 'test.js'))) {
    config = require('./test').config
  } else {
    console.log('ERROR: need src/config/test.ts')
    process.exit(1)
  }
} else {
  if (fs.existsSync(path.join(__dirname, './developer.js'))) {
    config = require('./developer').config
  } else {
    console.log('ERROR: need src/config/developer.ts')
    process.exit(1)
  }
}


export { config }
