const Joi = require('joi')
const envs = ['development', 'test', 'production']

// Define config schema
const schema = Joi.object().keys({
  port: Joi.number().default(3000),
  env: Joi.string().valid(...envs).default(envs[0]),
  appName: Joi.string(),
  cache: Joi.object({
    socket: Joi.object({
      host: Joi.string(),
      port: Joi.number().default(6379),
      tls: Joi.boolean().default(false),
    }),
    password: Joi.string().allow(''),
    partition: Joi.string().default('aircraft-cache'),
    ttl: Joi.number().default(3600 * 1000 * 24 * 30), // 30 days
  }),
})

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  appName: 'Aircraft Tracking',
  cache: {
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      tls: process.env.REDIS_TLS,
    },
    password: process.env.REDIS_PASSWORD,
    partition: process.env.REDIS_PARTITION,
    ttl: process.env.REDIS_TTL,
  },
}

// Validate config
const { error, value } = schema.validate(config)

// Throw if config is invalid
if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

value.isDev = value.env === 'development'

module.exports = value
