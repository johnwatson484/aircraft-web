const { get } = require('../location')
const Joi = require('joi')

module.exports = [{
  method: 'GET',
  path: '/map',
  options: {
    validate: {
      query: Joi.object({
        icao24: Joi.string()
      })
    },
    handler: async (request, h) => {
      const { icao24 } = request.query
      const locations = await get(icao24)
      return h.view('map', { icao24, locations })
    }
  }
}]
