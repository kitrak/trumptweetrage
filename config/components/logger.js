'use strict'

const joi = require('joi')
const winston = require('winston')

const envSchema = joi.object({
	LOGGER_LEVEL: joi.string()
		.allow(['error', 'warn', 'info', 'debug'])
		.default('info'),
	LOGGER_ENABLED: joi.boolean()
    	.truthy('TRUE')
    	.truthy('true')
    	.falsy('FALSE')
    	.falsy('false')
    	.default(true)
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envSchema)

if (error) {
	throw new Error(`Config validation error: ${error.message}`)
}

const config = {
	logger: {
		level: envVars.LOGGER_LEVEL,
		enabled: envVars.LOGGER_ENABLED
	}
}

winston.level = config.logger.level
if (!config.logger.enabled) {
  winston.remove(winston.transports.Console)
}

module.exports = config

module.exports = config