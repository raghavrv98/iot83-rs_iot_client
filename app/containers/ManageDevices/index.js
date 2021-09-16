/**
 *
 * ManageDevices
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectManageDevices from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import Header from '../../components/Header';
import SkeletonLoader from '../../components/SkeletonLoader/Loadable';
import CustomBreadCrumb from '../../components/CustomBreadCrumb/Loadable';
import Pagination from '../../components/Pagination/Loadable';
import { deviceAlarmData } from '../../utils/sampleData';
import { reduceToUnitBases } from '../../utils/customUtils';

/* eslint-disable react/prefer-stateless-function */
export class ManageDevices extends React.PureComponent {
  state = {
    isLoader: true,
    deviceAlarmData: deviceAlarmData(),
    devicePerPage: 50,
    deviceOffset: 0,
    currentPage: 1,
  };
  componentWillMount() {
    this.stopLoadingHandler();
  }

  stopLoadingHandler = () => {
    setTimeout(() => {
      this.setState({
        isLoader: false,
      });
    }, 1000);
  };

  devicePerPageHandler = event => {
    this.setState(
      {
        devicePerPage: event.target.value,
        isLoader: true,
        deviceOffset: 0,
        currentPage: 1,
      },
      () => this.stopLoadingHandler(),
    );
  };

  onClickNext = fastForward => {
    let devicePerPage = this.state.devicePerPage;
    let deviceOffset = this.state.deviceOffset;
    deviceOffset = fastForward
      ? 5 * devicePerPage + deviceOffset
      : deviceOffset + devicePerPage;
    this.setState(
      {
        deviceOffset,
        currentPage: fastForward
          ? this.state.currentPage + 5
          : this.state.currentPage + 1,
        isLoader: true,
      },
      () => this.stopLoadingHandler(),
    );
  };

  onClickPrevious = fastBackward => {
    let devicePerPage = this.state.devicePerPage;
    let deviceOffset = this.state.deviceOffset;
    deviceOffset = fastBackward
      ? deviceOffset - 5 * devicePerPage
      : deviceOffset - devicePerPage;
    this.setState(
      {
        deviceOffset,
        currentPage: fastBackward
          ? this.state.currentPage - 5
          : this.state.currentPage - 1,
        isLoader: true,
      },
      () => this.stopLoadingHandler(),
    );
  };

  deviceDataHandler = value => {
    this.setState(
      {
        deviceAlarmData: value,
        isLoader: true,
      },
      () => this.stopLoadingHandler(),
    );
  };

  render() {
    return (
      <div>
        <Helmet>
          <title>ManageDevices</title>
          <meta name="description" content="Description of ManageDevices" />
        </Helmet>
        <Header currentPage="manageDevices" />
        <div className="app-content">
          <CustomBreadCrumb
            backButtonPath="/home"
            backButtonText="Device Management"
            backButtonHeading="All Available Devices"
            totalCount={this.state.deviceAlarmData.length}
            history={this.props.history}
            deviceDataHandler={this.deviceDataHandler}
          />
          {this.state.isLoader ? (
            <SkeletonLoader type="deviceView" />
          ) : (
            <ul className="device-card-list list-style-none">
              {this.state.deviceAlarmData
                .slice(
                  this.state.deviceOffset,
                  this.state.deviceOffset + this.state.devicePerPage,
                )
                .map((temp, i) => (
                  <React.Fragment>
                    <li key={i}>
                      {/* <div className="card-outer"> */}
                      <div
                        onClick={() =>
                          this.props.history.push({
                            pathname: '/manageDeviceDetail',
                            state: { temp },
                          })
                        }
                        className={`card card-thumbnail ${temp['onlineStatus'] === 'Yes'
                          ? temp['alarmState'] === 'Yes'
                            ? 'inActive'
                            : 'active'
                          : 'disabled'
                          }`}
                      >
                        <div className="card-header">
                          <h6>
                            {temp['deviceTag']}
                            <span
                              className={
                                temp['outputState'] === 'On' &&
                                  temp['onlineStatus'] === 'Yes'
                                  ? 'active'
                                  : 'inActive'
                              }
                            />
                          </h6>
                        </div>
                        <div className="card-body">
                          <ul className="device-list list-style-none">
                            <li>
                              <div className="flex align-items-center">
                                <div className="fx-b50 text-right">
                                  <h6>Control Temp :</h6>
                                </div>

                                <div className="fx-b50 pd-l-5">
                                  <div className="bar-graph">
                                    <span className="w-80 bg-dark" />
                                  </div>
                                </div>
                              </div>
                              <ul className="sub-device-list list-style-none">
                                <li>
                                  <div className="flex align-items-center">
                                    <div className="fx-b50 text-right">
                                      <h6>Temp 1 :</h6>
                                    </div>
                                    <div className="fx-b50 pd-l-5">
                                      <div className="bar-graph">
                                        <span className="w-50 bg-light" />
                                      </div>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div className="flex align-items-center">
                                    <div className="fx-b50 text-right">
                                      <h6>Temp 2 :</h6>
                                    </div>
                                    <div className="fx-b50 pd-l-5">
                                      <div className="bar-graph">
                                        <span className="w-30 bg-light" />
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </li>
                            <li>
                              <div className="flex align-items-center">
                                <div className="fx-b50 text-right">
                                  <h6>Current :</h6>
                                </div>
                                <div className="fx-b40">
                                  <p>{temp['Line current (A)'] + ' A'}</p>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="flex align-items-center">
                                <div className="fx-b50 text-right">
                                  <h6>G.F :</h6>
                                </div>
                                <div className="fx-b50">
                                  <p>
                                    {temp['Ground Fault Current (mA)'] +
                                      ' mA'}
                                  </p>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="flex align-items-center">
                                <div className="fx-b50 text-right">
                                  <h6>Voltage :</h6>
                                </div>
                                <div className="fx-b50">
                                  <p>{temp['Voltage (V)'] + ' V'}</p>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="flex align-items-center">
                                <div className="fx-b50 text-right">
                                  <h6>Power :</h6>
                                </div>
                                <div className="fx-b50">
                                  <p>{reduceToUnitBases(temp['Power (W)'])}</p>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      {/* </div> */}
                    </li>
                  </React.Fragment>
                ))}
            </ul>
            // <ul></ul>

          )}
          <footer className="app-footer">
            <div className="side-pagination">
              <h6>
                Records Per Page:
                <button
                  className="btn-danger dropdown-toggle"
                  type="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  {this.state.devicePerPage}{' '}
                </button>
                <ul className="dropdown-menu">
                  <li value="10" onClick={this.devicePerPageHandler}>
                    10
                  </li>
                  <li value="20" onClick={this.devicePerPageHandler}>
                    20
                  </li>
                  <li value="50" onClick={this.devicePerPageHandler}>
                    50
                  </li>
                  <li value="100" onClick={this.devicePerPageHandler}>
                    100
                  </li>
                </ul>
              </h6>
            </div>
            <div className="page-selection">
              <button
                onClick={() => this.onClickPrevious(true)}
                disabled={this.state.currentPage - 5 < 1}
                className="btn-transparent btn-danger mr-r-5"
              >
                <i className=" far fa-chevron-double-left " />
              </button>
              <button
                onClick={() => this.onClickPrevious(false)}
                disabled={this.state.currentPage == 1}
                className="btn-transparent  btn-danger "
              >
                <i className="far fa-chevron-left " />
              </button>
              <div className="center">
                <h6>
                  Page
                  <span>{this.state.currentPage}</span>
                  of {Math.ceil(this.state.deviceAlarmData.length / this.state.devicePerPage)}
                </h6>
              </div>
              <button
                onClick={() => this.onClickNext(false)}
                disabled={
                  this.state.currentPage ===
                  Math.ceil(
                    this.state.deviceAlarmData.length /
                    this.state.devicePerPage
                  )
                }
                className="btn-transparent btn-danger mr-r-5"
              >
                <i className="far fa-chevron-right " />
              </button>
              <button
                onClick={() => this.onClickNext(true)}
                disabled={
                  this.state.currentPage + 5 >
                  Math.ceil(
                    this.state.deviceAlarmData.length /
                    this.state.devicePerPage
                  )
                }
                className="btn-transparent btn-danger"
              >
                <i className=" far fa-chevron-double-right " />
              </button>
            </div>
            <div className="side-pagination text-right">
              <h6>
                Total Records :
                <button className="btn-danger">
                  {this.state.deviceAlarmData.length}
                </button>
              </h6>
            </div>
          </footer>
        </div>
      </div>
    );
  }
}

ManageDevices.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  manageDevices: makeSelectManageDevices(),
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

const withReducer = injectReducer({ key: 'manageDevices', reducer });
const withSaga = injectSaga({ key: 'manageDevices', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ManageDevices);
