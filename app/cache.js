const { cache: config } = require('./config')
const { createClient } = require('redis')
let client

const start = async () => {
  client = createClient({ socket: config.socket, password: config.password })
  client.on('error', (err) => console.log(`Redis error: ${err}`))
  client.on('reconnecting', () => console.log('Redis reconnecting...'))
  client.on('ready', () => console.log('Redis connected'))
  await client.connect()
}

const stop = async () => {
  await client.disconnect()
}

const keys = async (cache) => {
  const prefix = getKeyPrefix(cache)
  return client.keys(`${prefix}*`)
}

const get = async (cache, key) => {
  const fullKey = key.includes(':') ? key : getFullKey(cache, key)
  const value = await client.get(fullKey)
  return value ? JSON.parse(value) : {}
}

const getFullKey = (cache, key) => {
  const prefix = getKeyPrefix(cache)
  return `${prefix}:${key}`
}

const getKeyPrefix = (cache) => {
  return `${config.partition}:${cache}`
}

module.exports = {
  start,
  stop,
  keys,
  get,
}
