const { cache } = require('./config')
const { createClient } = require('redis')
let client

const start = async () => {
  client = createClient({ socket: cache.socket, password: cache.password })
  client.on('error', (err) => console.log(`Redis error: ${err}`))
  client.on('reconnecting', () => console.log('Redis reconnecting...'))
  client.on('ready', () => console.log('Redis connected'))
  await client.connect()
}

const stop = async () => {
  await client.disconnect()
}

const get = async (key) => {
  const fullKey = getFullKey(key)
  const value = await client.get(fullKey)
  return value ? JSON.parse(value) : {}
}

const getFullKey = (key) => {
  const prefix = getKeyPrefix()
  return `${prefix}:${key}`
}

const getKeyPrefix = () => {
  return `${cache.partition}`
}

module.exports = {
  start,
  stop,
  get
}
