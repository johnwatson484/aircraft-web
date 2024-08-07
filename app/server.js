const hapi = require('@hapi/hapi')
const config = require('./config')
const cache = require('./cache')

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false,
        },
      },
    },
    router: {
      stripTrailingSlash: true,
    },
  })

  // Register the plugins
  await server.register(require('@hapi/inert'))
  await server.register(require('./plugins/views'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/errors'))
  await server.register(require('./plugins/logging'))

  if (config.isDev) {
    await server.register(require('blipp'))
  }

  await cache.start()

  return server
}

module.exports = createServer
