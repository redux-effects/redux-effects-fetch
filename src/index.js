/**
 * Imports
 */

import 'isomorphic-fetch'
import fetchEncodeJSON from './fetchEncodeJSON'
import { fetchMiddleware, fetchActionCreator, FETCH } from './fetch'

/**
 * Exports
 */

export default fetchMiddleware
export {
  fetchActionCreator as fetch,
  FETCH,
  fetchEncodeJSON
}
