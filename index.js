'use strict'

const logger = require('winston')

const type = process.env.PROCESS_TYPE

logger.info(`Starting '${type}' process`, { pid: process.pid })

if (type === 'web') {
  require('./web')
} else if (type === 'twitter') {
  require('./worker/twitter')
} else {
  throw new Error(`
    ${type} is an unsupported process type. 
    Use one of: 'web', 'twitter'!
  `)
}
