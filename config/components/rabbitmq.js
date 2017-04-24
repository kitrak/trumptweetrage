'use strict'

const joi = require('joi')

const envSchema = joi.object({
  RABBITMQ_HOST: joi.string()
    .required(),
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  rabbitmq: {
    host: envVars.RABBITMQ_HOST
  }
}

module.exports = config
