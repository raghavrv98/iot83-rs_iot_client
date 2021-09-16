/*
 *
 * LoginPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_AUTH_CONFIG_DETAILS_SUCCESS,
  GET_AUTH_CONFIG_DETAILS_FAILURE,
  GET_TOKEN_DETAILS_FAILURE,
  GET_TOKEN_DETAILS_SUCCESS,
  GET_USER_DETAILS_SUCCESS,
  GET_USER_DETAILS_FAILURE
} from './constants';

export const initialState = fromJS({});

function loginPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_AUTH_CONFIG_DETAILS_SUCCESS:
      return state.set('authConfigDetailsSuccess', action.response);
    case GET_AUTH_CONFIG_DETAILS_FAILURE:
      return state.set('authConfigDetailsFailure', action.error);
    case GET_TOKEN_DETAILS_SUCCESS:
      return state.set('getTokenDetailsSuccess', action.response);
    case GET_TOKEN_DETAILS_FAILURE:
      return state.set('getTokenDetailsFailure', action.error);
    case GET_USER_DETAILS_SUCCESS:
      return state.set('getUserDetailsSuccess', action.response);
    case GET_USER_DETAILS_FAILURE:
      return state.set('getUserDetailsFailure', action.error);
    default:
      return state;
  }
}

export default loginPageReducer;
