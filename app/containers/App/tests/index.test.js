import React from 'react';
import { shallow } from 'enzyme';
import { Route, BrowserHistory } from 'react-router-dom';

import App from '../index';

describe('<App />', () => {
  it('should render some routes', () => {
    const renderedComponent = shallow(<App history={BrowserHistory} />);
    expect(renderedComponent.find(Route).length).not.toBe(0);
  });
});
