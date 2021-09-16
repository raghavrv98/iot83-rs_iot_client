import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the trends state domain
 */

const selectTrendsDomain = state => state.get('trends', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by Trends
 */

const makeSelectTrends = () =>
  createSelector(selectTrendsDomain, substate => substate.toJS());

export default makeSelectTrends;
export { selectTrendsDomain };
