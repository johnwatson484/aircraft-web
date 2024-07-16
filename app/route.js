const cache = require('./cache')
const turf = require('@turf/turf')
const sortArray = require('./sort-array')

const get = async (icao24) => {
  const cacheData = await cache.get('location', icao24)
  const path = cacheData.location
    .sort((a, b) => sortArray(a.timestamp, b.timestamp))
  const pathPoints = path.map(x => ([x.longitude, x.latitude]))
  const pathFeature = pathPoints.length > 1 ? turf.lineString(pathPoints) : turf.point(pathPoints[0])
  const locationFeature = turf.point(pathPoints[pathPoints.length - 1])
  const rotation = path[path.length - 1].trueTrackRadians ?? 0
  return {
    center: [cacheData.location[0]?.source?.longitude ?? 0, cacheData.location[0]?.source?.latitude ?? 0],
    geoJson: turf.featureCollection([pathFeature, locationFeature]),
    rotation,
  }
}

module.exports = {
  get,
}
