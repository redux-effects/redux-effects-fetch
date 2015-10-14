/**
 * Imports
 */

import realFetch from 'isomorphic-fetch'

/**
 * Action types
 */

const FETCH = 'EFFECT_FETCH'

/**
 * Fetch middleware
 */

function fetchMiddleware ({dispatch, getState}) {
  return next => action =>
    action.type === FETCH
      ? realFetch(action.payload.url, action.payload.params).then(checkStatus).then(deserialize, deserializeError)
      : next(action)
}

/**
 * Deserialize the request body
 */

function deserialize (res) {
  const header = res.headers.get('Content-Type')
  return (header && header.indexOf('application/json') > -1)
    ? res.json()
    : res.text()
}

/**
 * Deserialize the request body, then return a
 * new rejected promise so the failure chain
 * stays failed.
 */

function deserializeError (res) {
  // new rejected Promise to go down failure chain
  return deserialize(res).then(function (body) {
    throw body
  })
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
 * Action creator
 */

function fetch (url = '', params = {}) {
  return {
    type: FETCH,
    payload: {
      url,
      params
    }
  }
}

/**
 * Exports
 */

export default fetchMiddleware
export {
  fetch
}
