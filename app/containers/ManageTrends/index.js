/**
 *
 * ManageTrends
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
import makeSelectManageTrends from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import Header from '../../components/Header';
import SkeletonLoader from '../../components/SkeletonLoader/Loadable';
import LineChart from '../../components/LineChart';
import Select from 'react-select';
import { cloneDeep } from 'lodash';
import NoDataFound from '../../components/NoDataFound/Loadable';
import { chartDurationData, legendData } from '../../utils/sampleData'

import CustomBreadCrumb from '../../components/CustomBreadCrumb/Loadable'
import { reduceToUnitBases } from '../../utils/customUtils';

/* eslint-disable react/prefer-stateless-function */
export class ManageTrends extends React.PureComponent {

  state = {
    isLoader: true,
    devicePerPage: 2,
    deviceOffset: 0,
    currentPage: 1,
    deviceData: [],
    chartDuration: 10080,
    legend: legendData(),
    copyData: [],
    realData: [],
    selectedOption: [
      { value: 'current', label: 'Current' },
      { value: 'sensorTemp1', label: 'Sensor Temp. 1' },
      { value: 'voltage', label: 'Voltage' },
      { value: 'outputState', label: 'Output State' },
      { value: 'power', label: 'Power' },
      { value: 'sensorTemp2', label: 'Sensor Temp. 2' },
      { value: 'gf', label: 'GF' }
    ],
    options: [
      { value: 'controlTemp', label: 'control Temp.' },
      { value: 'sensorTemp1', label: 'Sensor Temp. 1' },
      { value: 'sensorTemp2', label: 'Sensor Temp. 2' },
      { value: 'setPoint', label: 'Set Point' },
      { value: 'current', label: 'Current' },
      { value: 'gf', label: 'GF' },
      { value: 'voltage', label: 'Voltage' },
      { value: 'power', label: 'Power' },
      { value: 'outputState', label: 'Output State' },
    ],
    optionsCopy: [
      { value: 'controlTemp', label: 'control Temp.' },
      { value: 'sensorTemp1', label: 'Sensor Temp. 1' },
      { value: 'sensorTemp2', label: 'Sensor Temp. 2' },
      { value: 'setPoint', label: 'Set Point' },
      { value: 'current', label: 'Current' },
      { value: 'gf', label: 'GF' },
      { value: 'voltage', label: 'Voltage' },
      { value: 'power', label: 'Power' },
      { value: 'outputState', label: 'Output State' },
    ]
  }
  stopLoadingHandler = () => {
    setTimeout(() => {
      this.setState({
        isLoader: false,
      });
    }, 1000);
  };

  componentWillMount() {
    this.generateData(this.state.chartDuration)
    this.stopLoadingHandler()
  }

  componentWillUnmount() {
    am4core.disposeAllCharts();
  }

  deviceDataHandler = (value) => {
    this.setState({
      deviceData: value,
    })
  }

  onClickNext = (fastForward) => {
    am4core.disposeAllCharts();
    let devicePerPage = this.state.devicePerPage
    let deviceOffset = this.state.deviceOffset
    deviceOffset = fastForward ? 5 * devicePerPage + deviceOffset : deviceOffset + devicePerPage
    let deviceDetails = this.state.deviceData[deviceOffset]
    this.setState({
      deviceOffset,
      deviceDetails,
      currentPage: fastForward ? this.state.currentPage + 5 : this.state.currentPage + 1,
      isLoader: true,
    }, () => this.stopLoadingHandler())
  }

  onClickPrevious = (fastBackward) => {
    am4core.disposeAllCharts();
    let devicePerPage = this.state.devicePerPage
    let deviceOffset = this.state.deviceOffset
    deviceOffset = fastBackward ? deviceOffset - (5 * devicePerPage) : deviceOffset - devicePerPage
    let deviceDetails = this.state.deviceData[deviceOffset]
    this.setState({
      deviceOffset,
      deviceDetails,
      currentPage: fastBackward ? this.state.currentPage - 5 : this.state.currentPage - 1,
      isLoader: true,
    }, () => this.stopLoadingHandler())
  }

  msToTime = (ms) => {
    var cms = new Date(ms);
    return cms.toLocaleTimeString()
  }

  checkAlarmUrlHandler = (minutes, i, m) => {
    return this.msToTime(Math.round(new Date().getTime()) - (60 * 1000 * minutes) + (minutes * 1000 * i)) == this.msToTime(Math.round(new Date().getTime() - m))
  }

  generateData = (minutes) => {
    am4core.disposeAllCharts();
    let data = []
    for (let i = 0; i < 60; i++) {
      let voltage = (Math.random() * (121 - 119) + 119)
      let current = (Math.random() * (22 - 18) + 18)
      let power = Math.round(voltage * current)
      let SensorTemp2 = (((Math.random() * (12 - 8) + 8) * 9 / 5) + 32)
      let SensorTemp1 = (((Math.random() * (6 - 4) + 4) * 9 / 5) + 32)
      let controlTemp = (((Math.random() * (12 - 8) + 8) * 9 / 5) + 32)
      let outputState = (Math.random() * (1 - 0) + 0).toFixed(0)
      data.push({
        "gf": (Math.random() * (19 - 17) + 17),
        "current": current,
        "sensorTemp2": SensorTemp2,
        "sensorTemp1": SensorTemp1,
        "controlTemp": controlTemp,
        "voltage": voltage,
        "power": power,
        "outputState": outputState,
        "date": Math.round(new Date().getTime()) - (60 * 1000 * minutes) + (minutes * 1000 * i),
        "alarmingAttr": this.checkAlarmUrlHandler(minutes, i, 21600000) ? 'gf' : this.checkAlarmUrlHandler(minutes, i, 43200000) ? 'sensorTemp1' : this.checkAlarmUrlHandler(minutes, i, 64800000) ? 'sensorTemp1' : this.checkAlarmUrlHandler(minutes, i, 86400000) ? 'current' : "",
        "alarmIconUrl": (this.checkAlarmUrlHandler(minutes, i, 21600000) || this.checkAlarmUrlHandler(minutes, i, 43200000) || this.checkAlarmUrlHandler(minutes, i, 64800000) || this.checkAlarmUrlHandler(minutes, i, 86400000)) ? require('../../assets/images/alarmRaised.png') : ""
      })
    }
    this.setState({
      realData: data,
      copyData: data,
    }, () => this.initialData())
  }

  initialData = () => {
    let realData = cloneDeep(this.state.realData);
    let copyData = cloneDeep(this.state.copyData);
    this.state.legend.map(legendObject => {
      if (legendObject.info) {
        legendObject.info.map(legend => {
          copyData = copyData.map((val, index) => {
            if (legend.display) {
              val[legend.name] = realData[index][legend.name]
            }
            else {
              val[legend.name] = null
            }
            return val
          })
        })
      }
      else {
        copyData = copyData.map((val, index) => {
          if (legendObject.display) {
            val[legendObject.name] = realData[index][legendObject.name]
          }
          else {
            val[legendObject.name] = null
          }
          return val
        })
      }
      return legendObject
    })
    this.setState({
      copyData
    })
  }

  handleChange = selectedOption => {
    am4core.disposeAllCharts();
    let realData = cloneDeep(this.state.realData);
    let copyData = cloneDeep(this.state.copyData);

    let legend = cloneDeep(this.state.legend)

    legend.map(legend => {
      if (legend.info) {
        legend.info.map(info => {
          if (selectedOption.map(option => option.value).includes(info.name)) {
            info.display = true
          }
          else {
            info.display = false
          }

          copyData = copyData.map((val, index) => {
            if (info.display) {
              val[info.name] = realData[index][info.name]


            }
            else {
              val[info.name] = null

            }
            return val
          })
        })
      }
      else {
        if (selectedOption.map(option => option.value).includes(legend.name)) {
          legend.display = true
        }
        else {
          legend.display = false
        }

        copyData = copyData.map((val, index) => {
          if (legend.display) {
            val[legend.name] = realData[index][legend.name]
          }
          else {
            val[legend.name] = null
          }
          return val
        })
      }
    })

    let options = cloneDeep(this.state.optionsCopy)
    options = options.filter(val => !selectedOption.map(option => option.value).includes(val.value))
    this.setState({
      selectedOption,
      copyData,
      legend,
      options
    })
  };

  chartDurationChangeHandler = (event) => {
    let chartDuration = event.target.value
    this.setState({
      chartDuration
    }, () => this.generateData(chartDuration))
  }

  dataFilterHandler = (event, legendObject) => {
    am4core.disposeAllCharts();
    let realData = cloneDeep(this.state.realData);
    let copyData = cloneDeep(this.state.copyData);
    copyData = copyData.map((val, index) => {
      if (!event.target.checked) {
        val[legendObject.name] = realData[index][legendObject.name]
      }
      else {
        val[legendObject.name] = null
      }
      return val
    })
    this.setState({
      copyData,
    })
  }

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

  legendValueHandler = (legendValue) => {

    let selectedOption = cloneDeep(this.state.selectedOption)
    selectedOption.map(val => {
      let attr = legendValue[val.value] ? val.value == 'power' ? reduceToUnitBases(Number(legendValue[val.value]).toFixed(1)) : Number(legendValue[val.value]).toFixed(1) : ""
      var x = document.getElementById(val.value)
      var unit = ''

      if (val.value != 'power') {
        this.state.legend.find(legendName => {
          if (legendName.name == val.value || legendName.info) {
            unit = legendName.unit
          }
        })
      }

      if (x.innerHTML == "") {
        if (val.value == 'outputState') {
          x.innerHTML = (attr == '1.0' ? 'On' : attr == '0.0' ? 'Off' : "")
        }
        else {
          x.innerHTML = attr + " " + (attr ? unit : "")
        }
      }
      else {
        if (val.value == 'outputState') {
          x.innerHTML = (attr == '1.0' ? 'On' : attr == '0.0' ? 'Off' : "")
        }
        else {
          x.innerHTML = attr + " " + (attr ? unit : "");
        }
      }
    })
  }

  render() {

    return (
      <div>
        <Helmet>
          <title>ManageTrends</title>
          <meta name="description" content="Description of ManageTrends" />
        </Helmet>
        <Header currentPage="manageTrends" />
        <div className="app-content">
          <CustomBreadCrumb
            backButtonPath='/home'
            backButtonText="Manage Trends"
            backButtonHeading="All Available Trends"
            totalCount={25}
            history={this.props.history}
            deviceDataHandler={this.deviceDataHandler}
          />
          {this.state.isLoader ?
            <SkeletonLoader type="trendsView" />
            :
            <div className="device-parameter-box">
              <div className="attribute-filter-wrapper">
                <div className="fx-b85 pd-r-10">
                  <div className="form-group">
                    <label className="form-label">
                      Select Attribute :
                      </label>
                    <Select
                      placeholder="Select Attribute"
                      isClearable={false}
                      value={this.state.selectedOption}
                      onChange={this.handleChange}
                      options={this.state.options}
                      noOptionsMessage={() => "Max limit achieved"}
                      isMulti
                    />
                  </div>
                </div>
                <div className="fx-b15 pd-l-10">
                  <div className="form-group">
                    <label className="form-label">Select Duration :</label>
                    <select onChange={this.chartDurationChangeHandler} value={this.state.chartDuration} className="form-control">
                      {chartDurationData().map(val => <option value={val.value}>{val.displayName}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <ul className="attribute-filter-list">
                {this.state.legend.map(legend => {
                  if (legend.info) {
                    return legend.info.map(info => {
                      if (info.display) {
                        return <li>
                          <label>
                            <input className="form-control" type="checkbox" onChange={(event) => this.dataFilterHandler(event, info)} />
                            <span className="checkmark-text">{info.displayName}</span>
                            <span id={info.name} className="data-value"></span>
                            <span style={{ backgroundColor: info.fill }} className="checkmark"></span>
                          </label>
                        </li>
                      }
                    })
                  }
                  else {
                    if (legend.display) {
                      return <li>
                        <label>
                          <input className="form-control" type="checkbox" onChange={(event) => this.dataFilterHandler(event, legend)} />
                          <span className="checkmark-text">{legend.displayName}</span>
                          <span id={legend.name} className="data-value"></span>
                          <span style={{ backgroundColor: legend.fill }} className="checkmark"></span>
                        </label>
                      </li>
                    }
                  }
                })
                }
              </ul>

              {this.state.deviceData.slice(this.state.deviceOffset, (this.state.deviceOffset + this.state.devicePerPage)).map((temp, i) => (
                <div className="trends-chart-wrapper">
                  <div className="fx-b15">
                    <h6>{temp.deviceTag}</h6>
                  </div>
                  <div className="fx-b85">
                    {this.state.copyData.length > 0 ?
                      <div className="chart-box">
                        <LineChart history={this.props.history} id={i} chartData={this.state.copyData} legend={this.state.legend} selectedOption={this.state.selectedOption} legendValueHandler={this.legendValueHandler} />
                      </div>
                      :
                      <NoDataFound skeleton="skeletonHistoryCharts" mode="fullView" dataName="data" dataImg="lineChart" />
                    }
                  </div>
                </div>
              ))}
            </div>
          }

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
                  <li value="2" onClick={this.devicePerPageHandler}>
                    2
                  </li>
                  <li value="5" onClick={this.devicePerPageHandler}>
                    5
                  </li>
                  <li value="10" onClick={this.devicePerPageHandler}>
                    10
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
                  of {Math.ceil(this.state.deviceData.length / this.state.devicePerPage,)}
                </h6>
              </div>
              <button
                onClick={() => this.onClickNext(false)}
                disabled={
                  this.state.currentPage ===
                  Math.ceil(
                    this.state.deviceData.length /
                    this.state.devicePerPage,
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
                    this.state.deviceData.length /
                    this.state.devicePerPage,
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
                  {this.state.deviceData.length}
                </button>
              </h6>
            </div>
          </footer>
        </div>
      </div>
    );
  }
}

ManageTrends.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  manageTrends: makeSelectManageTrends(),
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

const withReducer = injectReducer({ key: 'manageTrends', reducer });
const withSaga = injectSaga({ key: 'manageTrends', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ManageTrends);
