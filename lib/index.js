/**
 * Imports
 */

require('es6-promise').polyfill()
var fetch = require('isomorphic-fetch')

/**
 * Fetch middleware
 */

function fetchMiddleware (api) {
  return function (next) {
    return function (action) {
      if (action.type === 'FETCH') {
        return handleResult(executerequest(action.payload), action.meta.then)
      }

      next(action)
    }
  }
}

/**
 * Execute an actual fetch given a description of the fetch we
 * wish to perform
 */

function executeRequest (desc) {
  return fetch(desc.url, {
      method: desc.method,
      headers: desc.headers,
      body: desc.body
    })
    .then(checkStatus)
    .then(deserialize(desc.json), deserialize(desc.json))
}

/**
 * Deserialize the request body
 */

function deserialize (json) {
  return function (res) {
    return json
      ? res.json()
      : res.text()
  }
}

/**
 * Check the status and reject the promise if it's not in the 200 range
 */

function checkStatus (res) {
  if (res.status >= 200 && res.status < 300) {
    return res
  } else {
    throw res
  }
}

/**
 * Handle the result of the fetch
 */

function handleResult (q, then) {
  if (!then) return q

  return q.then(
    function (res) {
      return execIfFn(then.success || identity, res)
    },
    function (err) {
      return execIfFn(then.failure || identity, err)
    }
  )
}

/**
 * Executes its argument if its a function (with arg), or just returns
 * what it was passed if it's not a function
 */

function execIfFn (descOrFn, arg) {
  return typeof descOrFn === 'function'
    ? descOrFn(arg)
    : descOrFn
}


/**
 * Exports
 */

module.exports = fetchMiddleware