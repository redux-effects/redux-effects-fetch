import test from 'tape'
import {omit} from 'lodash/object'
import {fetch, fetchEncodeJSON} from '../src'


const run = (action, cb) => fetchEncodeJSON()(cb)(action)


test('should ignore other actions', t => {
  const action = {
    type: 'NO_FETCH',
    payload: {}
  }

  run(action, newAction => {
    t.equal(newAction, action)
    t.end()
  })
})

test('non-JSON requests', t => {
    const action = fetch('/foo', {method: 'POST', headers: {'Content-Type': 'text/plain'}, body: 'foo'})
    run(action, newAction => {
      t.equal(newAction, action)
      t.end()
    })
})


test('should ignore requests whose body is a string', t => {
  const action = fetch('/foo', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: 'foo'
  })
  run(action, newAction => {
    t.equal(newAction, action)
    t.end()
  })
})

test('should encode the body if it is an object', t => {
  const request = {
    method: 'POST',
    body: {message: 'Hello world!'}
  }
  const action = fetch('/foo', request)
  const payload = action.payload

  run(action, newAction => {
    t.equal(newAction.payload.params.body,JSON.stringify({message: 'Hello world!'}))
    t.same(omit(newAction.payload.params, ['body', 'headers']), omit(payload.params, ['body']))
    t.same(omit(newAction.payload, ['params']), omit(payload, ['params']))
    t.end()
  })
})

test('should add an accept header if it encoded the object', t => {
  const request = {
    method: 'POST',
    body: {message: 'Hello world!'},
    headers: {
      'Content-Type': 'application/json',
      'X-Foo': 'bar'
    }
  }
  const action = fetch('/foo', request)
  const payload = action.payload
  run(action, newAction => {
    t.same(newAction.payload.params.headers, {
      'X-Foo': 'bar',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
    // Ensure that the payload is otherwise unmodified
    t.same(omit(newAction.payload.params, ['body', 'headers']), omit(payload.params, ['body', 'headers']))
    t.same(omit(newAction.payload, ['params']), omit(payload, ['params']))
    t.end()
  })
})

test('should leave an existing accept header untouched', t => {
  const request = {
    method: 'POST',
    body: {message: 'foo'},
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    }
  }
  const action = fetch('/foo', request)

  run(action, newAction => {
    t.same(newAction.payload.params.body,JSON.stringify({message: 'foo'}))
    t.same(newAction.payload.params.headers, {
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    })
    t.end()
  })
})
