import { fromJS } from 'immutable';
import manageDeviceDetailReducer from '../reducer';

describe('manageDeviceDetailReducer', () => {
  it('returns the initial state', () => {
    expect(manageDeviceDetailReducer(undefined, {})).toEqual(fromJS({}));
  });
});
