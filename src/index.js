/**
 * Imports
 */

import fetch from 'isomorphic-fetch'

/**
 * Fetch middleware
 */

function fetchMiddleware ({dispatch, getState}) {
  return next => action =>
    action.type === 'FETCH'
      ? fetch(action.payload.url, action.payload.params).then(checkStatus).then(deserialize, deserialize)
      : next(action)
}

/**
 * Deserialize the request body
 */

function deserialize (res) {
  var header = res.headers.get('Content-Type');
  return (header && header.indexOf('application/json') > -1)
    ? res.json()
    : res.text()
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
 * Exports
 */

export default fetchMiddleware
