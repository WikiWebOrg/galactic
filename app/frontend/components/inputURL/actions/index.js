/**
 * app/frontend/components/inputURL/actions/index.js
 * Copyright (c) 2016, Galactic
*/

import { Get } from "../../../lib/Api"
export const POST_URL_SEARCH = 'POST_URL_SEARCH'
export const RECEIVE_URL_SEARCH = 'RECEIVE_URL_SEARCH'
export const RECEIVE_URL_ERROR = 'RECEIVE_URL_ERROR'

function requestSearchResult(urlInput) {
  return {
    type: POST_URL_SEARCH,
    urlInput
  }
}

function receiveSearchResult(result, uid) {
  return {
    type: RECEIVE_URL_SEARCH,
    result,
    uid
  }
}

function receiveErr(err) {
  return {
    type: RECEIVE_URL_ERROR,
    err
  }
}

export function getSearch(q, uid) {

  return dispatch => {
    dispatch(requestSearchResult(q))
    return Get(
        '/api/searchurl',
        {q},
        (err, res)=>dispatch(receiveErr(err)),
        (err, res)=>dispatch(receiveSearchResult(res.body, uid))
    )
  }
}

export function resetSearch(uid) {
  return {
    type: RECEIVE_URL_SEARCH,
    null,
    uid
  }
}