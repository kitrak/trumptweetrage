'use strict'

const joi = require('joi')

const envSchema = joi.object({
  MONGO_URL: joi.string()
    .required(),
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  mongo: {
    url: envVars.MONGO_URL
  }
}

module.exports = config
