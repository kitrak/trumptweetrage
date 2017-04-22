'use strict'

const joi = require('joi')

const envSchema = joi.object({
  TWITTER_CONSUMER_KEY: joi.string()
    .required(),
  TWITTER_CONSUMER_SECRET: joi.string()
    .required(),
  TWITTER_ACCESS_TOKEN_KEY: joi.string()
    .required(),
  TWITTER_ACCESS_TOKEN_SECRET: joi.string()
    .required()
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  twitter: {
    consumerKey: envVars.TWITTER_CONSUMER_KEY,
    consumerSecret: envVars.TWITTER_CONSUMER_SECRET,
    accessTokenKey: envVars.TWITTER_ACCESS_TOKEN_KEY,
    accessTokenSecret: envVars.TWITTER_ACCESS_TOKEN_SECRET
  }
}

module.exports = config