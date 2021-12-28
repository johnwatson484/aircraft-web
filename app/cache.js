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

const get = async () => {
  const prefix = getKeyPrefix()
  const keys = await client.keys(prefix)
  const aircraft = []
  for (const key of keys) {
    const tracked = await client.get(key)
    const parsed = JSON.parse(tracked)
    aircraft.push(parsed)
  }
  return aircraft
}

const getKeyPrefix = () => {
  return `${cache.partition}:*`
}

module.exports = {
  start,
  stop,
  get
}
