/**
 *
 * ManageDeviceDetail
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
import makeSelectManageDeviceDetail from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import Header from '../../components/Header';
import SkeletonLoader from '../../components/SkeletonLoader/Loadable';
import NoDataFound from '../../components/NoDataFound/Loadable';
import $ from 'jquery';
import LineChart from '../../components/LineChart';
import CustomBreadCrumb from '../../components/CustomBreadCrumb/Loadable';
import { deviceAlarmData, chartDurationData, legendData } from '../../utils/sampleData'
import moment from 'moment';
import { cloneDeep } from 'lodash';
import Select from 'react-select';
const _ = require("underscore")
import { reduceToUnitBases } from '../../utils/customUtils';

/* eslint-disable react/prefer-stateless-function */
export class ManageDeviceDetail extends React.PureComponent {
  state = {
    isSliderOpen: false,
    isLoader: true,
    deviceDetails: this.props.history.location.state ? this.props.history.location.state.temp : undefined,
    deviceData: deviceAlarmData(),
    devicePerPage: 1,
    deviceOffset: 0,
    currentPage: 1,
    shelvedData: [],
    alarmData: [],
    chartDuration: 10080,
    isAlarmHide: false,
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
  };

  shelveOpenHandler = () => {
    this.setState({
      isShelveOpen: false,
    });
  };

  componentWillMount() {
    this.generateData(this.state.chartDuration)
    this.setState({
      currentPage: this.state.deviceDetails ? this.state.deviceData.findIndex(val => val["deviceTag"] === this.state.deviceDetails["deviceTag"]) + 1 : 1,
      deviceOffset: this.state.deviceDetails ? this.state.deviceData.findIndex(val => val["deviceTag"] === this.state.deviceDetails["deviceTag"]) : 0,
    })
    this.stopLoadingHandler()
  }

  componentWillUnmount() {
    am4core.disposeAllCharts();
  }

  stopLoadingHandler = () => {
    setTimeout(() => {
      this.setState({
        isLoader: false,
      });
    }, 1000);
  }

  devicePerPageHandler = (event) => {
    am4core.disposeAllCharts();
    this.setState({
      devicePerPage: event.target.value,
      isLoader: true,
      deviceOffset: 0,
      currentPage: 1,
    }, () => this.stopLoadingHandler())
  }

  onClickNext = (fastForward) => {
    am4core.disposeAllCharts();
    let devicePerPage = this.state.devicePerPage
    let deviceOffset = this.state.deviceOffset
    deviceOffset = fastForward ? 5 * devicePerPage + deviceOffset : deviceOffset + devicePerPage
    let deviceDetails = this.state.deviceData[deviceOffset]
    let copyData = cloneDeep(this.state.copyData)

    copyData.map(val => {
      val.alarmIconUrl = deviceDetails["alarmState"] === "Yes" ? val.alarmIconUrl : ""
      return val
    })
    this.setState({
      copyData,
      deviceOffset,
      deviceDetails,
      currentPage: fastForward ? this.state.currentPage + 5 : this.state.currentPage + 1,
      isLoader: true,
    }, () => { this.stopLoadingHandler(), this.alarmDataHandler(), this.generateData(this.state.chartDuration) })
  }

  onClickPrevious = (fastBackward) => {
    am4core.disposeAllCharts();
    let devicePerPage = this.state.devicePerPage
    let deviceOffset = this.state.deviceOffset
    deviceOffset = fastBackward ? deviceOffset - (5 * devicePerPage) : deviceOffset - devicePerPage
    let deviceDetails = this.state.deviceData[deviceOffset]
    let copyData = cloneDeep(this.state.copyData)
    copyData.map(val => {
      val.alarmIconUrl = deviceDetails.alarmState === "Yes" ? val.alarmIconUrl : ""
      return val
    })
    this.setState({
      copyData,
      deviceOffset,
      deviceDetails,
      currentPage: fastBackward ? this.state.currentPage - 5 : this.state.currentPage - 1,
      isLoader: true,
    }, () => { this.stopLoadingHandler(), this.alarmDataHandler(), this.generateData(this.state.chartDuration) })
  }

  deviceDataHandler = (value) => {
    this.setState({
      deviceData: value
    }, () => this.alarmDataHandler())
  }

  alarmDataHandler = () => {
    am4core.disposeAllCharts();

    let data = this.state.deviceData.find(val => val.deviceTag === this.state.deviceDetails["deviceTag"])

    let alarmData = data ? data.alarmDetails : this.state.deviceData[0] ? this.state.deviceData[0].alarmDetails : []
    alarmData.map((val, index) => {
      val.date = Math.round(new Date().getTime()) - ((index + 1) * 21600000)
      return val
    })

    this.setState({
      alarmData,
    })
  }

  shelveHandler = (event, val) => {
    let checked = event.target.checked
    let shelvedData = cloneDeep(this.state.shelvedData)
    checked ? shelvedData.push(val) : shelvedData.splice(shelvedData.findIndex(value => _.isEqual(value, val)), 1)
    this.setState({
      shelvedData
    })
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
        "alarmIconUrl": this.state.deviceDetails.alarmState === "Yes" && (this.checkAlarmUrlHandler(minutes, i, 21600000) || this.checkAlarmUrlHandler(minutes, i, 43200000) || this.checkAlarmUrlHandler(minutes, i, 64800000) || this.checkAlarmUrlHandler(minutes, i, 86400000)) ? '../../assets/images/alarmRaised.png' : ""
      })
    }
    this.setState({
      realData: data,
      copyData: data,
    }, () => this.initialData())
  }

  initialData = () => {
    am4core.disposeAllCharts();
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
    am4core.disposeAllCharts();
    let realData = cloneDeep(this.state.realData);
    let copyData = cloneDeep(this.state.copyData);

    let legend = cloneDeep(this.state.legend)

    legend.map(legend => {
      if (legend.info) {
        legend.info.map(info => {
          console.log('selectedOption: ', selectedOption);
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
    am4core.disposeAllCharts();
    let chartDuration = event.target.value
    let data = this.state.deviceData.find(val => val.deviceTag === this.state.deviceDetails["deviceTag"])
    let alarmData = data ? data.alarmDetails : this.state.deviceData[0] ? this.state.deviceData[0].alarmDetails : []
    alarmData.map((val, index) => {
      val.date = Math.round(new Date().getTime()) - ((index + 1) * 21600000)
      return val
    })

    this.setState({
      chartDuration,
      alarmData
    }, () => this.generateData(chartDuration))
  }

  dataFilterHandler = (event, legendObject) => {
    am4core.disposeAllCharts();
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

  hideAlarmHandler = (event) => {
    let checked = event.target.checked
    let realData = cloneDeep(this.state.realData);
    let copyData = cloneDeep(this.state.copyData);

    if (checked) {
      copyData.map(val => {
        val.alarmIconUrl = ""
        val.alarmingAttr = ""
      })
    }
    else {
      copyData = realData
    }
    this.setState({
      isAlarmHide: checked,
      copyData
    })
  }

  highlightedAlarmHandler = date => {
    let time = this.msToTime(date)
    let alarmData = cloneDeep(this.state.alarmData)
    let highlightedAlarmIndex = alarmData.findIndex(val => this.msToTime(val.date) === time)

    let topValue = highlightedAlarmIndex === 0 ? 0 : highlightedAlarmIndex === alarmData.length - 1 ? 70 : 0

    document.getElementById('container').scrollTo({ top: topValue, behavior: 'smooth' });

    this.setState({
      alarmData,
      highlightedAlarmIndex
    })
  }

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
          x.innerHTML = attr + " " + (attr ? unit : "");
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
          <title>ManageDeviceDetail</title>
          <meta
            name="description"
            content="Description of ManageDeviceDetail"
          />
        </Helmet>
        <Header currentPage="manageDevices" />
        <div className="app-content">
          <CustomBreadCrumb
            backButtonPath="/manageDevices"
            backButtonText="Manage Devices"
            backButtonHeading="All Available Devices"
            totalCount={this.state.deviceData.length}
            history={this.props.history}
            deviceDataHandler={this.deviceDataHandler}
          />
          {this.state.isLoader ?
            <SkeletonLoader type="detailView" />
            :
            <React.Fragment>
              <div className="device-detail-outer">
                <div className="device-detail-wrapper">
                  <div className="device-card">

                    <div className={`card card-thumbnail ${this.state.deviceDetails['onlineStatus'] === "Yes" ? this.state.deviceDetails['alarmState'] === "Yes" ? "inActive" : "active" : "disabled"}`}>
                      <div className="card-header">
                        <h6>{this.state.deviceDetails["deviceTag"]}
                          <span className={this.state.deviceDetails['onlineStatus'] === "Yes" ? "active" : "inActive"}></span>
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
                                <p>{this.state.deviceDetails["Line current (A)"] + " A"}</p>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="flex align-items-center">
                              <div className="fx-b50 text-right">
                                <h6>G.F :</h6>
                              </div>
                              <div className="fx-b50">
                                <p>{this.state.deviceDetails["Ground Fault Current (mA)"] + " mA"}</p>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="flex align-items-center">
                              <div className="fx-b50 text-right">
                                <h6>Voltage :</h6>
                              </div>
                              <div className="fx-b50">
                                <p>{this.state.deviceDetails["Voltage (V)"] + " V"}</p>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="flex align-items-center">
                              <div className="fx-b50 text-right">
                                <h6>Power :</h6>
                              </div>
                              <div className="fx-b50">
                                <p>{reduceToUnitBases(this.state.deviceDetails["Power (W)"])}</p>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="alarm-detail-view">
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
                        <button type="button" className="btn-transparent" >

                          <i className="far fa-sync-alt text-primary" />
                          Reset
                    </button>
                      </div>
                      <div className="alarm-btn">
                        <button type="button" className="btn-transparent" onClick={() => {
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
                  {this.state.deviceDetails["alarmState"] === "Yes" ?
                    <React.Fragment>
                      <ul className="app-list-view list-style-none" id="container">
                        {this.state.alarmData.map((val, i) => (
                          <li key={i}>
                            <label className="custom-check-box">
                              <input type="checkbox" onChange={(event) => this.shelveHandler(event, val)} />
                              <span className="checkmark" />
                            </label>
                            <div className={this.state.highlightedAlarmIndex === i ? "app-list-item highlighted-alarm" : "app-list-item"}>
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
                                <h6>date</h6>
                                <p>{moment(val.date).format("DD MMM YYYY HH:mm:ss")}</p>
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
                                <h6>Shelve Time Remaining</h6>
                                <p>{val.shelvedTimeRemaining}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <ul className="mobile-list-view list-style-none" >
                        {this.state.alarmData.slice(this.state.alarmOffset, (this.state.alarmOffset + this.state.alarmPerPage)).map((val, index) =>
                          <li key={index}>
                            <span className="alarm-icon">
                              <img src={require('../../assets/images/alarmRaised.png')} />
                            </span>
                            <h6>{val.deviceTag}<span className="float-right">Generated : {moment(val.date).format("DD MMM YYYY HH:mm:ss")}</span></h6>
                            <p>{val.description}</p>
                            <h5>Last Renewed : {val.shelvedTimeRemaining}<span className="float-right text-theme">{val.status}</span></h5>
                          </li>
                        )}
                      </ul>
                    </React.Fragment>
                    :
                    <NoDataFound />
                  }
                  <div className="device-summary">
                    <h6 className="text-right fw600 mr-b-0"> Total Records :
                      <button className="btn-danger mr-l-5" onClick={() => this.props.history.push('/manageAlarms')}>{this.state.deviceDetails["alarmState"] === "Yes" ? this.state.alarmData.length : "0"}</button></h6>
                  </div>
                </div>
              </div>
              <div className="device-parameter-box">

                {this.state.copyData.length > 0 ?
                  <React.Fragment>
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
                      {
                        this.state.deviceDetails["alarmState"] === "Yes" &&
                        < label className="custom-check-box">
                          <input
                            type="checkbox"
                            checked={this.state.isAlarmHide}
                            onChange={this.hideAlarmHandler}
                          />
                          <span className="checkmark" />
                          <span className="check-box-text">Hide Alarms</span>
                        </label>
                      }
                    </ul>
                    <div className="chart-box">
                      <LineChart history={this.props.history} highlightedAlarmHandler={this.highlightedAlarmHandler} chartData={this.state.copyData} legend={this.state.legend} selectedOption={this.state.selectedOption} legendValueHandler={this.legendValueHandler} />
                    </div>
                  </React.Fragment>
                  :
                  <NoDataFound skeleton="skeletonHistoryCharts" mode="fullView" dataName="data" dataImg="lineChart" />
                }
              </div>
            </React.Fragment>
          }
          <footer className="app-footer">
            <div className="side-pagination">
              <h6>
                Devices Per Page:
                <button
                  className="btn-danger dropdown-toggle"
                  type="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  1
                </button>
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
                  of {Math.ceil(this.state.deviceData.length / this.state.devicePerPage)}
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
          {this.state.isShelveOpen && (
            <div className="modal d-block" id="shelvePopup">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">
                      Shelve Alarm
                      <button
                        className="close"
                        onClick={this.shelveOpenHandler}
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
        </div>
      </div >
    );
  }
}

ManageDeviceDetail.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  manageDeviceDetail: makeSelectManageDeviceDetail(),
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

const withReducer = injectReducer({ key: 'manageDeviceDetail', reducer });
const withSaga = injectSaga({ key: 'manageDeviceDetail', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ManageDeviceDetail);
