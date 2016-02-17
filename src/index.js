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
      ? realFetch(action.payload.url, action.payload.params).then(checkStatus).then(createResponse, createErrorResponse)
      : next(action)
}

/**
 * Create a plain JS response object.  Note that 'headers' is still a Headers
 * object (https://developer.mozilla.org/en-US/docs/Web/API/Headers), and must be
 * read using that API.
 */

function createResponse (res) {
  return deserialize(res).then(value => ({
    url: res.url,
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
    value: value
  }))
}

/**
 * Create the response, then return a new rejected
 * promise so the failure chain stays failed.
 */

function createErrorResponse (res) {
  return createResponse(res).then(function (res) {
    throw res
  })
}

/**
 * Deserialize the request body
 */

function deserialize (res) {
  const header = res.headers.get('Content-Type') || ''
  if (header.indexOf('application/json') > -1) return res.json()
  if (header.indexOf('application/ld+json') > -1) return res.json()
  if (header.indexOf('application/octet-stream') > -1) return res.arrayBuffer()
  return res.text()
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
  fetch,
  FETCH
}
