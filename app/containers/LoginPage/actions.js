/*
 *
 * LoginPage actions
 *
 */

import { DEFAULT_ACTION, GET_AUTH_CONFIG_DETAILS, GET_TOKEN_DETAILS, GET_USER_DETAILS } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getAuthConfigDetails() {
  return {
    type: GET_AUTH_CONFIG_DETAILS,
  };
}

export function getTokenDetails(apiUrl, code) {
  return {
    type: GET_TOKEN_DETAILS,
    apiUrl,
    code
  };
}

export function getUserDetails(apiUrl, token) {
  return {
    type: GET_USER_DETAILS,
    apiUrl,
    token
  };
}
