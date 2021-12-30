const { getAll } = require('../aircraft')

module.exports = [{
  method: 'GET',
  path: '/',
  handler: async (request, h) => {
    const aircraft = await getAll()
    return h.view('home', { aircraft })
  }
}]
