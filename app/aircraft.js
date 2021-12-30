const cache = require('./cache')
const sortArray = require('./sort-array')
const moment = require('moment')

const getAll = async () => {
  const keys = await cache.keys('aircraft')
  const aircraft = []
  for (const key of keys) {
    const tracked = await cache.get('aircraft', key)
    aircraft.push(tracked)
  }
  return format(sort(aircraft))
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
  getAll
}
