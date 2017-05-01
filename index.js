'use strict'

const logger = require('winston')

const type = process.env.PROCESS_TYPE

logger.info(`Starting '${type}' process`, { pid: process.pid })

if (type === 'web') {
  require('./web')
} else if (type === 'twitter') {
  require('./worker/twitter')
} else if (type === 'rabbitmq') {
    require('./worker/rabbitmq')
} else if (type == 'twitter-backfill') {
    require('./backfill_tweets')
} else {
  throw new Error(`${type} is an unsupported process type. Use one of: 'web', 'twitter', 'rabbitmq'!`)
}
