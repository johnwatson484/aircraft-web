const routes = [].concat(
  require('../routes/home'),
  require('../routes/map'),
  require('../routes/public')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    },
  },
}
