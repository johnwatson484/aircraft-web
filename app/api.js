const wreck = require('@hapi/wreck')
const { api } = require('./config')

const get = async (path) => {
  const { protocol, host, username, password } = api
  const request = `${protocol}://${username}:${password}@${host}/${path}`
  const { payload } = await wreck.get(request, getConfiguration())
  return payload
}

const getConfiguration = () => {
  return {
    json: true,
  }
}

module.exports = {
  get,
}
