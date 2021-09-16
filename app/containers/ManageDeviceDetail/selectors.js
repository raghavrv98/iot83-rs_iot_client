import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the manageDeviceDetail state domain
 */

const selectManageDeviceDetailDomain = state =>
  state.get('manageDeviceDetail', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ManageDeviceDetail
 */

const makeSelectManageDeviceDetail = () =>
  createSelector(selectManageDeviceDetailDomain, substate => substate.toJS());

export default makeSelectManageDeviceDetail;
export { selectManageDeviceDetailDomain };
