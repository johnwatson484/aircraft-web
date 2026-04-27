const { get } = require('./api')
const { getBoundingBox } = require('./geo')
const { transformAircraftResponse } = require('./transform')
const cache = require('./cache')
const { frequency } = require('./config')

const start = async () => {
  try {
    await trackAircraft()
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, frequency)
  }
}

const trackAircraft = async () => {
  const bbox = getBoundingBox()
  const { lamin, lomin, lamax, lomax } = bbox
  const aircraft = await get(`states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`)
  const transformedResponse = transformAircraftResponse(aircraft)
  for (const plane of transformedResponse) {
    await cache.set('aircraft', plane.icao24, plane)
    await cache.update('location', plane.icao24, {
      location: [{
        timestamp: plane.timestamp,
        longitude: plane.longitude,
        latitude: plane.latitude,
        trueTrackRadians: plane.trueTrackRadians,
        source: plane.source,
      }],
    })
    console.log(`Cached tracked aircraft: ${plane.icao24}-${plane.callSign}`)
  }
}

module.exports = {
  start,
}
