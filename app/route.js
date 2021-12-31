const cache = require('./cache')
const turf = require('@turf/turf')
const sortArray = require('./sort-array')

const get = async (icao24) => {
  const cacheData = await cache.get('location', icao24)
  const pathPoints = cacheData.location
    .sort((a, b) => sortArray(a.timestamp, b.timestamp))
    .map(x => ([x.longitude, x.latitude]))
  const pathFeature = pathPoints.length > 1 ? turf.lineString(pathPoints) : turf.point(pathPoints[0])
  const locationFeature = turf.point(pathPoints[pathPoints.length - 1])
  return {
    center: [cacheData.location[0]?.source?.longitude ?? 0, cacheData.location[0]?.source?.latitude ?? 0],
    geoJson: turf.featureCollection([pathFeature, locationFeature])
  }
}

module.exports = {
  get
}
