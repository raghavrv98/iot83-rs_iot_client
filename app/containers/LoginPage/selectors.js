import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the loginPage state domain
 */

const selectLoginPageDomain = state => state.get('loginPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by LoginPage
 */

const authConfigDetailsSuccess = () =>
  createSelector(selectLoginPageDomain, substate => substate.get('authConfigDetailsSuccess'));

const authConfigDetailsFailure = () =>
  createSelector(selectLoginPageDomain, substate => substate.get('authConfigDetailsFailure'));

const getTokenDetailsSuccess = () =>
  createSelector(selectLoginPageDomain, substate => substate.get('getTokenDetailsSuccess'));

const getTokenDetailsFailure = () =>
  createSelector(selectLoginPageDomain, substate => substate.get('getTokenDetailsFailure'));

const getUserDetailsSuccess = () =>
  createSelector(selectLoginPageDomain, substate => substate.get('getUserDetailsSuccess'));

const getUserDetailsFailure = () =>
  createSelector(selectLoginPageDomain, substate => substate.get('getUserDetailsFailure'));


const makeSelectLoginPage = () =>
  createSelector(selectLoginPageDomain, substate => substate.toJS());

export default makeSelectLoginPage;
export {
  selectLoginPageDomain, authConfigDetailsSuccess,
  authConfigDetailsFailure, getTokenDetailsSuccess, getTokenDetailsFailure,
  getUserDetailsSuccess, getUserDetailsFailure
};
