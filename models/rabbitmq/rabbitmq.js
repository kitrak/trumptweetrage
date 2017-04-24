'use strict'

const config = require('../../config')
const Tortoise = require('tortoise')

const tortoise = new Tortoise(config.rabbitmq.host)
module.exports = tortoise
