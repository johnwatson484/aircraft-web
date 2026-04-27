const { geo } = require('./config')

const transformAircraftResponse = (response) => {
  return response.states?.map(x => ({
    icao24: x[0],
    callSign: x[1].trim() || 'UNKNOWN',
    originCountry: x[2],
    timePosition: x[3],
    timePositionDate: new Date(x[3] * 1000),
    lastContact: x[4],
    lastContactDate: new Date(x[4] * 1000),
    longitude: x[5],
    latitude: x[6],
    barometricAltitude: x[7],
    onGround: x[8],
    velocity: x[9] ?? 0,
    velocityMph: x[9] == null ? 0 : (Math.round(x[9] * 2.23694)),
    trueTrack: x[10],
    trueTrackRadians: x[10] == null ? 0 : x[10] * 0.0174533,
    verticalRate: x[11] ?? 0,
    verticalRateMph: x[11] == null ? 0 : (Math.round(x[11] * 2.23694)),
    sensors: x[12],
    geoAltitude: x[13],
    squawk: x[14],
    spi: x[15],
    positionSource: x[16],
    timestamp: new Date(),
    source: {
      longitude: geo.longitude,
      latitude: geo.latitude,
      distance: geo.distance,
    },
  })) ?? []
}

module.exports = {
  transformAircraftResponse,
}
