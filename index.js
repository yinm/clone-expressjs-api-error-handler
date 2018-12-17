const statuses = require('statuses')

const production = process.env.NODE_ENV === 'production'

module.exports = function() {
  return function apiErrorHandler(err, req, res, next) {
    let status = err.status || err.statusCode || 500
    if (status < 400) status = 500
    res.statusCode = status

    const body = {
      status: status
    }

    // show the stacktrace when not in production
    if (!production) body.stack = err.stack

    // internal server errors
    if (status >= 500) {
      console.error(err.stack)
      body.message = statuses[status]
      res.json(body)
      return
    }

    // client errors
    body.message = err.message

    if (err.code) body.code = err.code
    if (err.name) body.name = err.name
    if (err.type) body.type = err.type

    res.json(body)
  }
}
