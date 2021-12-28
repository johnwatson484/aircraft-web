module.exports = [{
  method: 'GET',
  path: '/assets/{path*}',
  handler: {
    directory: {
      path: [
        'app/public/assets'
      ]
    }
  }
}]
