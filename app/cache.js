const { cache } = require('./config')
const { createClient } = require('redis')
const sortArray = require('./sort-array')
const moment = require('moment')
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
  return format(sort(aircraft))
}

const getKeyPrefix = () => {
  return `${cache.partition}:*`
}

const sort = (aircraft) => {
  if (!aircraft.length) {
    return aircraft
  }
  return aircraft.sort((a, b) => sortArray(b.timestamp, a.timestamp))
}

const format = (aircraft) => {
  return aircraft.map(x => ({
    ...x,
    timestampFormatted: moment(x.timestamp).format('DD[/]MM[/]YYYY HH:mm:ss'),
    timePositionDateFormatted: moment(x.timePositionDate).format('DD[/]MM[/]YYYY HH:mm:ss'),
    lastContactDateFormatted: moment(x.lastContactDate).format('DD[/]MM[/]YYYY HH:mm:ss')
  }))
}

module.exports = {
  start,
  stop,
  get
}
