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
    ttl: Joi.number().default(172800), // 2 days in seconds
  }),
  api: Joi.object({
    protocol: Joi.string().default('https'),
    host: Joi.string().default('opensky-network.org/api'),
    username: Joi.string(),
    password: Joi.string(),
  }),
  geo: Joi.object({
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
    distance: Joi.number().default(15),
  }),
  frequency: Joi.number().default(90000), // 90 seconds
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
  api: {
    protocol: process.env.API_PROTOCOL,
    host: process.env.API_HOST,
    username: process.env.API_USERNAME,
    password: process.env.API_PASSWORD,
  },
  geo: {
    longitude: process.env.GEO_LONGITUDE,
    latitude: process.env.GEO_LATITUDE,
    distance: process.env.GEO_DISTANCE,
  },
  frequency: process.env.FREQUENCY,
}

// Validate config
const { error, value } = schema.validate(config)

// Throw if config is invalid
if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

value.isDev = value.env === 'development'

module.exports = value
