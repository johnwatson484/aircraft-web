module.exports = [{
  method: 'GET',
  path: '/assets/{path*}',
  handler: {
    directory: {
      path: [
        'app/public/css',
        'app/public/assets',
        'app/public/js'
      ]
    }
  }
}]
