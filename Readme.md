# redux-effects-fetch

Declarative data fetching for [redux](https://github.com/rackt/redux)

## Installation

`npm install redux-effects-fetch`

## Usage

This package is designed to be used in conjunction with [redux-effects](https://github.com/redux-effects/redux-effects).  Install it like this:

```javascript
import effects from 'redux-effects'
import fetch, { fetchEncodeJSON } from 'redux-effects-fetch'

// fetchEncodeJSON is optional
applyMiddleware(effects, fetch, fetchEncodeJSON)(createStore)
```

This will enable your middleware to support fetch actions.

## Actions

You can create your own action creators for this package, or you can use the one that comes bundled with it.  The action format is simple:

```javascript
{
  type: 'EFFECT_FETCH',
  payload: {
    url,
    params
  }
}
```

Where `url` and `params` are what you would pass as the first and second arguments to the native `fetch` API.  If you want your action creators to support some async flow control, you should use [redux-effects](https://github.com/redux-effects/redux-effects)' `bind` function.  If you do, your fetch action will return you an object with the following properties:

  * `url` - The url of the endpoint you requested (as returned by the request)
  * `status` - The numerical status code of the response (e.g. 200)
  * `statusText` - The text version of the status (e.g. 'OK')
  * `headers` - A [Headers object](https://developer.mozilla.org/en-US/docs/Web/API/Headers)
  * `value` - The deserialized value of the response.  This may be an object or string, depending on the type of response (json or text).

## Examples

### Creating a user

```javascript
import {bind} from 'redux-effects'
import {fetch} from 'redux-effects-fetch'
import {createAction} from 'redux-actions'

function signupUser (user) {
  return bind(fetch(api + '/user', {
    method: 'POST',
    body: user
  }), ({value}) => userDidLogin(value), ({value}) => setError(value))
}

const userDidLogin = createAction('USER_DID_LOGIN')
const setError = createAction('SET_ERROR')
```

This works exactly as if you were working with the native `fetch` API, except your request is actually being executed by middleware.

### Handling loading states

For this I recommend the use of [redux-multi](https://github.com/ashaffer/redux-multi), which allows you to dispatch more than one action at a time.

```javascript
import {bind} from 'redux-effects'
import {fetch} from 'redux-effects-fetch'
import {createAction} from 'redux-actions'

function signupUser (user) {
  return [
    signupIsLoading(),
    bind(fetch(api + '/user', {
      method: 'POST',
      body: user
    }), ({value}) => userDidLogin(value), ({value}) => setError(value))
  ]
}

const signupIsLoading = createAction('SIGNUP_IS_LOADING')
const userDidLogin = createAction('USER_DID_LOGIN')
const setError = createAction('SET_ERROR')
```

## Local development

If you want to develope your frontend application without any REST server running,
you can use [redux-effects-fetch-fixture](https://github.com/team-boris/redux-effects-fetch-fixture) to define
fixtures for your `fetch` requests.
