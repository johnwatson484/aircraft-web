const { get } = require('../cache')

module.exports = [{
  method: 'GET',
  path: '/',
  handler: async (request, h) => {
    const aircraft = await get()
    return h.view('home', { aircraft })
  }
}]
