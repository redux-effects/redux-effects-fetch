# redux-fetch

Declarative data fetching for [redux](https://github.com/rackt/redux)

## Usage

Add `redux-fetch` to your redux middleware stack (preferably at the beginning).  Then, instead of imperatively calling `fetch` in your action creators, you can produce descriptions of the fetch you want to perform, and the middleware will execute it for you.

```javascript
function createUser (user) {
  return {
    type: 'FETCH',
    payload: {
      method: 'POST',
      url: '/user',
      body: user
    },
    meta: {
      then: logUserIn
    }
  }
}

function logUserIn () {
  return {
    type: 'USER_DID_LOGIN'
  }
}
```

## Coming soon

Less-verbose ways of doing this.  Going to try to create some creators for these things, so that the API can be just like fetch.  Something like

```javascript
var fetch = require('declarative-fetch')

function createUser (user) {
  return fetch('/user/', {
    method: 'post',
    body: user
  })
  .then(logUserIn)
}
```