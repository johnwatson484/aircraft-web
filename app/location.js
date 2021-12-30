const cache = require('./cache')

const get = async (icao24) => {
  const cacheData = await cache.get('location', icao24)
  return {
    ...cacheData.location,
    center: [cacheData.location[0]?.source?.longitude ?? 0, cacheData.location[0]?.source?.latitude ?? 0]
  }
}

module.exports = {
  get
}
