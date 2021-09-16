import { fromJS } from 'immutable';
import manageAlarmsReducer from '../reducer';

describe('manageAlarmsReducer', () => {
  it('returns the initial state', () => {
    expect(manageAlarmsReducer(undefined, {})).toEqual(fromJS({}));
  });
});
