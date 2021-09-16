import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the manageDevices state domain
 */

const selectManageDevicesDomain = state =>
  state.get('manageDevices', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ManageDevices
 */

const makeSelectManageDevices = () =>
  createSelector(selectManageDevicesDomain, substate => substate.toJS());

export default makeSelectManageDevices;
export { selectManageDevicesDomain };
