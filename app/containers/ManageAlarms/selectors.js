import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the manageAlarms state domain
 */

const selectManageAlarmsDomain = state =>
  state.get('manageAlarms', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ManageAlarms
 */

const makeSelectManageAlarms = () =>
  createSelector(selectManageAlarmsDomain, substate => substate.toJS());

export default makeSelectManageAlarms;
export { selectManageAlarmsDomain };
