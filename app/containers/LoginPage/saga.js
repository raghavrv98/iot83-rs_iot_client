
import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import getFormData from 'form-data-urlencoded';


import {
  GET_AUTH_CONFIG_DETAILS,
  GET_AUTH_CONFIG_DETAILS_SUCCESS,
  GET_AUTH_CONFIG_DETAILS_FAILURE,
  GET_TOKEN_DETAILS,
  GET_TOKEN_DETAILS_FAILURE,
  GET_TOKEN_DETAILS_SUCCESS,
  GET_USER_DETAILS,
  GET_USER_DETAILS_SUCCESS,
  GET_USER_DETAILS_FAILURE
} from './constants';
import { errorHandler } from "../../utils/customUtils";
import { client_id, client_secret, redirect_uri, grant_type, domain_url } from "../../utils/authConfig"

export function* apiGetAuthConfigDetailsHandlerAsync(action) {
  try {
    let url = `${domain_url}/.well-known/openid-configuration`
    const response = yield call(axios.get, url);
    yield put({ type: GET_AUTH_CONFIG_DETAILS_SUCCESS, response: response.data });
  } catch (error) {
    yield errorHandler(error, GET_AUTH_CONFIG_DETAILS_FAILURE);
  }
}

export function* apiGetTokenDetailsHandlerAsync(action) {
  try {
    let data = {
      client_id,
      client_secret,
      redirect_uri,
      code: action.code,
      grant_type
    }

    let formData = getFormData(data);

    let url = action.apiUrl
    const response = yield call(axios.post, url, formData, { "Content-Type": "application/x-www-form-urlencoded" });
    yield put({ type: GET_TOKEN_DETAILS_SUCCESS, response: response.data });
  } catch (error) {
    yield errorHandler(error, GET_TOKEN_DETAILS_FAILURE);
  }
}

export function* apiGetUserDetailsHandlerAsync(action) {
  try {
    let url = action.apiUrl
    const response = yield call(axios.get, url, { headers: { "Authorization": `Bearer ${action.token}` } })
    yield put({ type: GET_USER_DETAILS_SUCCESS, response: response.data });
  } catch (error) {
    yield errorHandler(error, GET_USER_DETAILS_FAILURE);
  }
}

export function* watcherGetAuthConfigDetails() {
  yield takeLatest(GET_AUTH_CONFIG_DETAILS, apiGetAuthConfigDetailsHandlerAsync);
}

export function* watcherGetTokenDetails() {
  yield takeLatest(GET_TOKEN_DETAILS, apiGetTokenDetailsHandlerAsync);
}

export function* watcherGetUserDetails() {
  yield takeLatest(GET_USER_DETAILS, apiGetUserDetailsHandlerAsync);
}

export default function* rootSaga() {
  yield all([
    watcherGetAuthConfigDetails(),
    watcherGetTokenDetails(),
    watcherGetUserDetails(),
  ]);
}
