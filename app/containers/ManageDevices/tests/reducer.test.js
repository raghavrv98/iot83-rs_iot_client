import { fromJS } from 'immutable';
import manageDevicesReducer from '../reducer';

describe('manageDevicesReducer', () => {
  it('returns the initial state', () => {
    expect(manageDevicesReducer(undefined, {})).toEqual(fromJS({}));
  });
});
