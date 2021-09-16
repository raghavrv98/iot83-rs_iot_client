/**
 *
 * HomePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Route, Switch } from 'react-router-dom';
import makeSelectHomePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import LandingPage from '../../containers/LandingPage/Loadable';
import ManageDevices from '../../containers/ManageDevices/Loadable';
import ManageDeviceDetail from '../../containers/ManageDeviceDetail/Loadable';
import ManageAlarms from '../../containers/ManageAlarms/Loadable';
import ManageTrends from '../../containers/ManageTrends/Loadable';

/* eslint-disable react/prefer-stateless-function */
export class HomePage extends React.PureComponent {

  componentWillMount() {
    if (!sessionStorage.getItem('username'))
      this.props.history.push('/login');
  }

  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/home" render={props => <LandingPage {...props} />} />
          <Route exact path="/manageDevices" render={props => <ManageDevices {...props} />} />
          <Route exact path="/manageDeviceDetail" render={props => <ManageDeviceDetail {...props} />} />
          <Route exact path="/manageAlarms" render={props => <ManageAlarms {...props} />} />
          <Route exact path="/manageTrends" render={props => <ManageTrends {...props} />} />
        </Switch>
      </React.Fragment>
    );
  }
}

HomePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  homePage: makeSelectHomePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'homePage', reducer });
const withSaga = injectSaga({ key: 'homePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HomePage);
