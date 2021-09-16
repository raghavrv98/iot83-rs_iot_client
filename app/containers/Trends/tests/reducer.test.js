import { fromJS } from 'immutable';
import trendsReducer from '../reducer';

describe('trendsReducer', () => {
  it('returns the initial state', () => {
    expect(trendsReducer(undefined, {})).toEqual(fromJS({}));
  });
});
