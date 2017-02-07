/**
 * Imports
 */

import test from 'tape'
import fetchMock from 'fetch-mock'
import fetchMw, {fetch} from '../src'

const urlTimeout = 'http://localhost/timeout'

const urlSuccess = 'http://localhost/200'

const failureUrl = 'http://localhost/404'

fetchMock.get(urlTimeout, new Promise(res => setTimeout(res, 2000)).then(() => 200));

fetchMock.get(urlSuccess, {
  headers: { 'Content-Type': ['text/html'] },
});

fetchMock.get(failureUrl, { status: 404 });

/**
 * Setup
 */

const api = {
  dispatch: () => {},
  getState: () => ({})
}

const run = fetchMw(api)(() => {})

/**
 * Tests
 */

test('should work', t => {
  run(fetch(urlSuccess)).then(({url, headers, value, status, statusText}) => {
    t.equal(url, urlSuccess)
    t.equal(status, 200)
    t.equal(statusText, 'OK')
    t.ok(headers.get('content-type').indexOf('text/html') !== -1)
    t.end()
  })
})

test('should reject on timeout', t => {
  t.plan(1)
  run(fetch(urlTimeout, { timeout: 1000 })).then(() => t.fail(), (res) => t.pass())
})

test('should reject on invalid response', t => {
  t.plan(1)
  run(fetch(failureUrl)).then(() => t.fail(), (res) => t.pass())
})
