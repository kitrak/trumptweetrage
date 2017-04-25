'use strict'

const logger = require('./components/logger')
const mongo = require('./components/mongo')

module.exports = Object.assign({}, logger, mongo)
