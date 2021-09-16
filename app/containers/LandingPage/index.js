/**
 *
 * LandingPage
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
import makeSelectLandingPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import SkeletonLoader from '../../components/SkeletonLoader/Loadable';
import { deviceAlarmData } from '../../utils/sampleData'
import { clearLocalStorage } from '../../utils/customUtils'

/* eslint-disable react/prefer-stateless-function */
export class LandingPage extends React.PureComponent {
  state = {
    isLoader: true,
    deviceAlarmData: deviceAlarmData()
  };
  componentWillMount() {
    setTimeout(() => {
      this.setState({
        isLoader: false,
      });
    }, 1000);
  }

  componentDidMount() {
    setTimeout(() => {
      this.PieChartConfigHandler();
    }, 1000);
  }

  PieChartConfigHandler = () => {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create('chartdiv', am4charts.PieChart3D);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.legend = new am4charts.Legend();
    chart.legend.labels.template.text = '{devices} {counts}';
    chart.legend.valueLabels.template.disabled = true;

    chart.data = [
      {
        devices: 'In Alarm',
        counts: this.state.deviceAlarmData.filter(val => val.alarmState === "Yes").length,
      },
      {
        devices: 'Not in Alarm',
        counts: this.state.deviceAlarmData.length - this.state.deviceAlarmData.filter(val => val.alarmState === "Yes").length,
      },
    ];

    var series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = 'counts';
    series.dataFields.category = 'devices';
    var colorSet = new am4core.ColorSet();
    colorSet.list = ['#88030a', '#EEEEEE'].map(function (color) {
      return new am4core.color(color);
    });
    series.colors = colorSet;
  };

  render() {
    return (
      <div>
        <Helmet>
          <title>LandingPage</title>
          <meta name="description" content="Description of LandingPage" />
        </Helmet>
        {this.state.isLoader ? (
          <SkeletonLoader type="landingView" />
        ) : (
          <React.Fragment>
            <div className="content-head">
              <div className="brand-wrapper">
                <div className="brand-logo">
                  <img src={require('../../assets/images/nvent_logo.png')} />
                </div>
                <div className="brand-name">
                  <h1 className="text-center">
                    <strong className="text-theme">RAYCHEM </strong> Supervisor
                    </h1>
                  <div className="custom-border-box ">
                    <span className="custom-border border-left" />
                    <span className="custom-border border-right" />
                  </div>
                </div>
                <div className="brand-logo">
                  <img
                    src={require('../../assets/images/Shell_logo.svg.png')}
                  />
                </div>
              </div>
              <div className="content-sub-head ">
                <div className="welcome-title">
                  <h6>  Hello! <strong className="text-theme fw600i"> nVent Demo</strong></h6>
                  <p> Welcome to  <strong className="text-theme fw600i"> Shell Scotford </strong></p>
                </div>
                <div className=" logout-btn">
                  <button
                    type="button"
                    onClick={() => clearLocalStorage()}
                    className="text-white"
                  >
                    Logout
                      <span>
                      <i className="fal fa-sign-out fw600" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="content-body">
              <div className="card-detail-wrapper">
                <ul className="landing-card-list list-style-none">
                  <li>
                    <div
                      className="landing-card"
                      onClick={() => this.props.history.push('/manageDevices')}
                    >
                      <div className="icon-logo">
                        <i className="far fa-server" />
                      </div>
                      <h6>DEVICES</h6>
                    </div>
                  </li>
                  <li>
                    <div
                      className="landing-card"
                      onClick={() => this.props.history.push('/manageAlarms')}
                    >
                      <div className="icon-logo">
                        <i className="fas fa-bell" />
                      </div>
                      <h6>ALARMS</h6>
                    </div>
                  </li>
                  <li>
                    <div className="landing-card">
                      <div className="icon-logo">
                        <i className="fas fa-file-invoice" />
                      </div>
                      <h6>REPORTS</h6>
                    </div>
                  </li>
                  <li>
                    <div
                      className="landing-card"
                      onClick={() =>
                        this.props.history.push('/manageTrends')
                      }
                    >
                      <div className="icon-logo">
                        <i className="fas fa-chart-line" />
                      </div>
                      <h6>TRENDS</h6>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="pie-chart-wrapper">
                <h6>Quick Summary</h6>
                <div className="pie-chart-box">
                  <div id="chartdiv" />
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

LandingPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  landingPage: makeSelectLandingPage(),
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

const withReducer = injectReducer({ key: 'landingPage', reducer });
const withSaga = injectSaga({ key: 'landingPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(LandingPage);
