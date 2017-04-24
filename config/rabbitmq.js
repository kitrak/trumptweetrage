'use strict'

const logger = require('./components/logger')
const rabbitmq = require('./components/rabbitmq')
const mongo = require('./components/mongo')
const twitter = require('./components/twitter')

module.exports = Object.assign({}, logger, rabbitmq, mongo, twitter)
