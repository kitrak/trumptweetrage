'use strict'

const twitter = require('./components/twitter')
const logger = require('./components/logger')
const mongo = require('./components/mongo')

module.exports = Object.assign({}, twitter, logger, mongo)
