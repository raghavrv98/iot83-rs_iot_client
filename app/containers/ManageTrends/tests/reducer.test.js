import { fromJS } from 'immutable';
import manageTrendsReducer from '../reducer';

describe('manageTrendsReducer', () => {
  it('returns the initial state', () => {
    expect(manageTrendsReducer(undefined, {})).toEqual(fromJS({}));
  });
});
