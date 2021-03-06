import { combineReducers } from 'redux'
import * as types from '../constants/ActionTypes'

export function list(state = [], action) {
  switch (action.type) {
    case types.GET_ORDERS_LIST_SUCCESS:
      return Object.assign([], action.data)
    default:
      return state
  }
}

export function form(state = { line_items: [] }, action) {
  switch (action.type) {
    case types.GET_ORDERS_NEW_FORM_SUCCESS:
      return Object.assign({}, state, action.data, { type: 'new' })
    case types.GET_ORDERS_SHOW_FORM_SUCCESS:
      return Object.assign({}, state, action.data, { type: 'show' })
    case types.SUBMIT_ORDERS_FORM_SUCCESS:
      return state
    default:
      return state
  }
}

export function allpay(state = {}, action) {
  switch (action.type) {
    case types.GET_ALLPAY_FORM_SUCCESS:
      return Object.assign({}, action.params )
    case types.CLEAN_ALLPAY_FORM:
      return {}
    default:
      return state
  }
}

export default combineReducers({
  list,
  form,
  allpay
})
