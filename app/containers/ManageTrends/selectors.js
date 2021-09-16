import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the manageTrends state domain
 */

const selectManageTrendsDomain = state =>
  state.get('manageTrends', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ManageTrends
 */

const makeSelectManageTrends = () =>
  createSelector(selectManageTrendsDomain, substate => substate.toJS());

export default makeSelectManageTrends;
export { selectManageTrendsDomain };
