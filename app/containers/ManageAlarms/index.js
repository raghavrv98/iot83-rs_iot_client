/**
 *
 * ManageAlarms
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
import makeSelectManageAlarms from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import Header from '../../components/Header';
import SkeletonLoader from '../../components/SkeletonLoader/Loadable';
import CustomBreadCrumb from '../../components/CustomBreadCrumb/Loadable';
import moment from 'moment';
import { cloneDeep } from 'lodash';
const _ = require("underscore")

/* eslint-disable react/prefer-stateless-function */
export class ManageAlarms extends React.PureComponent {
  state = {
    isShelveOpen: false,
    isLoader: true,
    alarmPerPage: 10,
    alarmOffset: 0,
    currentPage: 1,
    shelvedData: [],
    alarmData: []
  };

  componentWillMount() {
    this.stopLoadingHandler()
  }
  stopLoadingHandler = () => {
    setTimeout(() => {
      this.setState({
        isLoader: false,
      });
    }, 1000);
  }

  closeHandler = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  alarmPerPageHandler = (event) => {
    this.setState({
      alarmPerPage: event.target.value,
      isLoader: true,
      alarmOffset: 0,
      currentPage: 1,
    }, () => this.stopLoadingHandler())
  }

  onClickNext = (fastForward) => {
    let alarmPerPage = this.state.alarmPerPage
    let alarmOffset = this.state.alarmOffset
    alarmOffset = fastForward ? 5 * alarmPerPage + alarmOffset : alarmOffset + alarmPerPage
    this.setState({
      alarmOffset,
      currentPage: fastForward ? this.state.currentPage + 5 : this.state.currentPage + 1,
      isLoader: true,
    }, () => this.stopLoadingHandler())
  }

  onClickPrevious = (fastBackward) => {
    let alarmPerPage = this.state.alarmPerPage
    let alarmOffset = this.state.alarmOffset
    alarmOffset = fastBackward ? alarmOffset - (5 * alarmPerPage) : alarmOffset - alarmPerPage
    this.setState({
      alarmOffset,
      currentPage: fastBackward ? this.state.currentPage - 5 : this.state.currentPage - 1,
      isLoader: true,
    }, () => this.stopLoadingHandler())
  }

  deviceDataHandler = (value, ddata) => {
    let alarmData = []

    if (ddata.length > 0) {
      value.map(data => {
        ddata.map(dd => {
          if (!data[dd.filterId]) {
            value = value.filter(val => {
              val.alarmDetails = val.alarmDetails.filter(alarm => {
                if (dd.subfilternames.includes(alarm[dd.filterId])) {
                  return alarm
                }
              })
              return val
            })
          }
        })
      })
    }

    value.map(value => value.alarmDetails.map(val => alarmData.push(val)))

    this.setState({
      alarmData,
      isLoader: true
    }, () => this.stopLoadingHandler())
  }

  shelveHandler = (event, val) => {
    let checked = event.target.checked
    let shelvedData = cloneDeep(this.state.shelvedData)
    checked ? shelvedData.push(val) : shelvedData.splice(shelvedData.findIndex(value => _.isEqual(value, val)), 1)
    this.setState({
      shelvedData
    })
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>ManageAlarms</title>
          <meta name="description" content="Description of ManageAlarms" />
        </Helmet>
        <Header currentPage="manageAlarms" />
        <div className="app-content">
          <CustomBreadCrumb
            backButtonPath='/home'
            backButtonText="Manage Alarms"
            backButtonHeading="All Available Alarms"
            totalCount={this.state.alarmData.length}
            history={this.props.history}
            deviceDataHandler={this.deviceDataHandler}
          />
          {this.state.isLoader ? (
            <SkeletonLoader type="alarmView" />
          ) : (
              <div>
                <div className="alarm-btn-group">
                  <h6>Alarm Status :</h6>
                  <div className="alarm-status-wrapper">
                    <div className="alarm-btn">
                      <button type="button" className="btn-transparent active">
                        <i className="far fa-ban text-danger" />
                    Suppress
                  </button>
                    </div>
                    <div className="alarm-btn">
                      <button type="button" className="btn-transparent">
                        <i className="far fa-thumbs-up text-success" />
                    Acknowledge
                  </button>
                    </div>
                    <div className="alarm-btn">
                      <button type="button" className="btn-transparent">
                        <i className="far fa-sync-alt text-primary" />
                    Reset
                  </button>
                    </div>
                    <div className="alarm-btn">
                      <button
                        type="button"
                        className="btn-transparent"
                        onClick={() => {
                          this.setState({ isShelveOpen: true });
                        }}
                        disabled={this.state.shelvedData.length < 1}
                      >
                        <i className="far fa-comment-alt-check text-warning" />
                    Shelve
                  </button>
                    </div>
                  </div>
                </div>
                <ul className="app-list-view list-style-none">
                  {this.state.alarmData.slice(this.state.alarmOffset, (this.state.alarmOffset + this.state.alarmPerPage)).map((val, index) =>
                    <li key={index}>
                      <label className="custom-check-box">
                        <input type="checkbox" onChange={(event) => this.shelveHandler(event, val)} />
                        <span className="checkmark" />
                      </label>
                      <div className="app-list-item">
                        <div className="alarm-icon">
                        <img src={require('../../assets/images/alarmRaised.png')} />
                        </div>
                        <div className="list-description">
                          <p className="mr-b-4">
                            <span className="title">Tag :</span>
                            <span className="content">{val.deviceTag}</span>
                            <span className="mx-2">|</span>
                            <span className="title">Type :</span>
                            <span className="content">{val.alarmType}</span>
                          </p>
                          <p className="mr-b-0">
                            <span className="title">Description :</span>
                            <span className="content">
                              {val.description}
                            </span>
                          </p>
                        </div>
                        <div className="list-content">
                          <h6>Alarm Status</h6>
                          <p>{val.status}</p>
                        </div>
                        <div className="list-content">
                          <h6>Timestamp</h6>
                          <p>{moment(val.timestamp).format("DD MMM YYYY HH:mm:ss")}</p>
                        </div>
                        <div className="list-content">
                          <h6>Device Priority</h6>
                          <p>{val.devicePriority}</p>
                        </div>
                        <div className="list-content">
                          <h6>Alarm Priority</h6>
                          <p>{val.alarmPriority}</p>
                        </div>
                        <div className="list-content">
                          <h6>Shelved Time Remaining</h6>
                          <p>{val.shelvedTimeRemaining}</p>
                        </div>
                      </div>
                    </li>
                  )
                  }
                </ul>
                <ul className="mobile-list-view list-style-none" >
                  {this.state.alarmData.slice(this.state.alarmOffset, (this.state.alarmOffset + this.state.alarmPerPage)).map((val, index) =>
                    <li key={index}>
                      <div className="alarm-icon">
                      <img src={require('../../assets/images/alarmRaised.png')} />
                      </div>
                      <h6>{val.deviceTag}<span className="float-right">Generated : {moment(val.timestamp).format("DD MMM YYYY HH:mm:ss")}</span></h6>
                      <p>{val.description}</p>
                      <h5>Last Renewed : {val.shelvedTimeRemaining}<span className="float-right text-theme">{val.status}</span></h5>
                    </li>
                  )}
                </ul>
              </div>
            )}

          {/* shelve alarm popup Modal start */}
          {this.state.isShelveOpen && (
            <div className="modal d-block" id="shelvePopup">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">
                      Shelve Alarm
                      <button
                        className="close"
                        onClick={() => { this.setState({ isShelveOpen: false }) }}
                      >
                        <i className="far fa-times" />
                      </button>
                    </h4>
                  </div>
                  <div className="modal-body pd-30">
                    <div className="shelve-info">
                      <h6>
                        Tag :<strong>{this.state.shelvedData.length > 1 ? "Multiple" : this.state.shelvedData[0].deviceTag}</strong>
                      </h6>
                      <h6>
                        Type :<strong>{this.state.shelvedData.length > 1 ? "Multiple" : this.state.shelvedData[0].alarmType}</strong>
                      </h6>
                      <h6>
                        Status :<strong>{this.state.shelvedData.length > 1 ? "Multiple" : this.state.shelvedData[0].status}</strong>
                      </h6>
                    </div>
                    <div className="shelve-body">
                      <div className="form-group">
                        <label className="form-label">
                          <span className="mr-r-10">
                            <i className="far fa-lightbulb" />
                          </span>
                          Reason for Shelving
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="flex">
                        <div className="form-group mr-r-10">
                          <label className="form-label">
                            <span className="mr-r-10">
                              <i className="far fa-calendar-alt" />
                            </span>
                            Days
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">
                            <span className="mr-r-10">
                              <i className="far fa-hourglass-start" />
                            </span>
                            Hours
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">
                          <span className="mr-r-10">
                            <i className="far fa-comment-alt-check " />
                          </span>
                          Comments
                        </label>
                        <textarea
                          type="text"
                          rows="3"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="flex justify-content-end mr-t-20">
                      <button type="button" className="btn-danger" onClick={() => { this.setState({ isShelveOpen: false }) }}>
                        <i className="far fa-check-circle" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* shelve alarm popup Modal end */}
        </div>
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
                  {this.state.alarmPerPage}{' '}
                </button>
                <ul className="dropdown-menu">
                  <li value="10" onClick={this.alarmPerPageHandler}>
                    10
                  </li>
                  <li value="20" onClick={this.alarmPerPageHandler}>
                    20
                  </li>
                  <li value="50" onClick={this.alarmPerPageHandler}>
                    50
                  </li>
                  <li value="100" onClick={this.alarmPerPageHandler}>
                    100
                  </li>
                </ul>
              </h6>
            </div>
            <div className="page-selection">
              <button
                onClick={() => this.onClickPrevious(true)}
                disabled={(this.state.currentPage - 5) < 1}
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
                  of {Math.ceil(this.state.alarmData.length /this.state.alarmPerPage,)}
                </h6>
              </div>
              <button
                onClick={() => this.onClickNext(false)}
                disabled={
                  this.state.currentPage ===
                  Math.ceil(
                    this.state.alarmData.length /
                    this.state.alarmPerPage,
                  )
                }
                className="btn-transparent btn-danger mr-r-5"
              >
                <i className="far fa-chevron-right" />
              </button>
              <button
                onClick={() => this.onClickNext(true)}
                disabled={
                  this.state.currentPage + 5 >
                  Math.ceil(
                    this.state.alarmData.length /
                    this.state.alarmPerPage,
                  )
                }
                className="btn-transparent btn-danger"
              >
                <i className=" far fa-chevron-double-right" />
              </button>
            </div>
            <div className="side-pagination text-right">
              <h6>
                Total Records :
                <button className="btn-danger">
                  {this.state.alarmData.length}
                </button>
              </h6>
            </div>
          </footer>
      </div>
    );
  }
}

ManageAlarms.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  manageAlarms: makeSelectManageAlarms(),
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

const withReducer = injectReducer({ key: 'manageAlarms', reducer });
const withSaga = injectSaga({ key: 'manageAlarms', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ManageAlarms);
