/**
 *
 * CustomBreadCrumb
 *
 */

import React from 'react';
import { cloneDeep } from 'lodash';
import { filterJson, deviceAlarmData, filtersListWithValues } from '../../utils/sampleData'
import { Prompt } from 'react-router';
import { Parser } from 'json2csv';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';
const _ = require("underscore")
import { clearLocalStorage } from '../../utils/customUtils'

/* eslint-disable react/prefer-stateless-function */
class CustomBreadCrumb extends React.PureComponent {
  state = {
    isModalOpen: false,
    bookmarksList: [],
    filtersListWithFilteredValues: filtersListWithValues(),
    allFiltersData: filterJson(),
    bookmarkName: '',
    searchField: "",
    deviceAlarmData: deviceAlarmData(),
    showWarningMessage: false,
    selectedFilters: [],
    notificationAlarmData: [],
    isFilterMenuOpen: false
  };

  componentDidMount() {
    let bookmarksList = sessionStorage.getItem('bookmarksList') ? JSON.parse(sessionStorage.getItem('bookmarksList')) : cloneDeep(this.state.bookmarksList),
      deviceAlarmData = cloneDeep(this.state.deviceAlarmData),
      selectedFilters = sessionStorage.getItem('selectedFilters') ? JSON.parse(sessionStorage.getItem('selectedFilters')) : cloneDeep(this.state.selectedFilters),
      filtersListWithFilteredValues = sessionStorage.getItem('filtersListWithFilteredValues') ? JSON.parse(sessionStorage.getItem('filtersListWithFilteredValues')) : cloneDeep(this.state.filtersListWithFilteredValues),
      allFiltersData = sessionStorage.getItem('allFiltersData') ? JSON.parse(sessionStorage.getItem('allFiltersData')) : cloneDeep(this.state.allFiltersData),
      bookmarkName = sessionStorage.getItem('bookmarkName') ? JSON.parse(sessionStorage.getItem('bookmarkName')) : cloneDeep(this.state.bookmarkName),
      isFilterMenuOpen = sessionStorage.getItem('isFilterMenuOpen') ? JSON.parse(sessionStorage.getItem('isFilterMenuOpen')) : this.state.isFilterMenuOpen,
      notificationAlarmData = sessionStorage.getItem('notificationAlarmData') ? JSON.parse(sessionStorage.getItem('notificationAlarmData')) : cloneDeep(this.state.notificationAlarmData);

    allFiltersData = this.getFilterData(allFiltersData, filtersListWithFilteredValues);
    deviceAlarmData = this.getDeviceAlarmData(selectedFilters, deviceAlarmData);
    notificationAlarmData = this.getNotificationAlarmData(notificationAlarmData, deviceAlarmData);

    sessionStorage.setItem('bookmarksList', JSON.stringify(bookmarksList));
    sessionStorage.setItem('selectedFilters', JSON.stringify(selectedFilters));
    sessionStorage.setItem('filtersListWithFilteredValues', JSON.stringify(filtersListWithFilteredValues));
    sessionStorage.setItem('allFiltersData', JSON.stringify(allFiltersData));
    sessionStorage.setItem('bookmarkName', JSON.stringify(bookmarkName));
    sessionStorage.setItem('isFilterMenuOpen', JSON.stringify(isFilterMenuOpen));
    sessionStorage.setItem('notificationAlarmData', JSON.stringify(notificationAlarmData));

    this.props.deviceDataHandler(deviceAlarmData, selectedFilters);

    this.setState({
      notificationAlarmData
    })
  }

  getNotificationAlarmData = (notificationAlarmData, deviceAlarmData) => {
    if (notificationAlarmData.length == 0) {
      for (let i = 0; i < 10; i++) {
        deviceAlarmData[i].alarmDetails[0].state = true;
        deviceAlarmData[i].alarmDetails[0].timestamp = new Date().getTime() - (i * 600000);
        notificationAlarmData.push(deviceAlarmData[i].alarmDetails[0]);
      }
    }

    return notificationAlarmData;
  }

  getFilterData = (allFiltersData, filtersListWithFilteredValues) => {
    allFiltersData = allFiltersData.map(val => {
      if (val.display) {
        let filteredValues = filtersListWithFilteredValues.find(value => value.name === val.name).filteredValues;
        val.subFilters.map(sub => {
          if (filteredValues.includes(val.name === 'unit' ? sub.name : sub.displayName)) {
            sub.checked = true;
          } else {
            sub.checked = false;
          }
          return sub;
        });
      }
      return val;
    });

    return allFiltersData;
  }

  getDeviceAlarmData = (selectedFilters, deviceAlarmData) => {

    selectedFilters = selectedFilters.map(value => {
      deviceAlarmData = deviceAlarmData.filter(val => {
        if (val[value.filterId]) {
          return value.subfilternames.includes(val[value.filterId]);
        }
        else {
          if (val.alarmDetails.filter(alarm => value.subfilternames.includes(alarm[value.filterId])).length > 0) {
            return val;
          }
        }
      });
      return value
    });
    return deviceAlarmData;
  }

  bookmarkNameModalcloseHandler = () => {
    this.setState({
      isModalOpen: false
    });
  };


  downloadSample = () => {
    let deviceAlarmData = cloneDeep(this.state.deviceAlarmData),
      selectedFilters = sessionStorage.getItem('selectedFilters') ? JSON.parse(sessionStorage.getItem('selectedFilters')) : cloneDeep(this.state.selectedFilters),
      filtersListWithFilteredValues = sessionStorage.getItem('filtersListWithFilteredValues') ? JSON.parse(sessionStorage.getItem('filtersListWithFilteredValues')) : cloneDeep(this.state.filtersListWithFilteredValues),
      allFiltersData = sessionStorage.getItem('allFiltersData') ? JSON.parse(sessionStorage.getItem('allFiltersData')) : cloneDeep(this.state.allFiltersData),
      finalJson = [],
      alarmData = [],
      obj = {};

    allFiltersData = this.getFilterData(allFiltersData, filtersListWithFilteredValues);
    deviceAlarmData = this.getDeviceAlarmData(selectedFilters, deviceAlarmData);

    deviceAlarmData.map(val => val.alarmDetails.map(value => alarmData.push(value)));

    let jsonSequence =
      window.location.pathname === '/manageAlarms'
        ? [
          'devicePriority',
          'deviceTag',
          'description',
          'value',
          'setting',
          'status',
          'userName',
          'alarmPriority',
          'alarmType',
          'timestamp',
          'shelvedTimeRemaining',
        ]
        : [
          'customer',
          'deviceTag',
          'site',
          'plant',
          'area',
          'unit',
          'Unit Description',
          'systemNumber',
          'lineNumber',
          'panelBoard',
          'controlPanel',
          'deviceType',
          'Temperature source 1 (Celcius)',
          'Temperature source 2 (Celcius)',
          'Control Temperature (Celcius)',
          'Line current (A)',
          'Ground Fault Current (mA)',
          'Voltage (V)',
          'Power (W)',
          'outputState',
          'alarmState',
          'onlineStatus',
          'Last Updated at',
        ];

    if (window.location.pathname === '/manageAlarms') {
      alarmData.map(val => {
        obj = {};
        jsonSequence.map(key => {
          obj[key] = typeof key === 'string' ? val[key] : key;
        });
        finalJson.push(obj);
      });
    } else {
      deviceAlarmData.map(val => {
        obj = {};
        jsonSequence.map(key => {
          obj[key] = typeof key === 'string' ? val[key] : key;
        });
        finalJson.push(obj);
      });
    }

    const parser = new Parser(),
      csvData = parser.parse(finalJson);
    let data = 'text/csv;charset=utf-8,' + encodeURIComponent(csvData),
      anchorTag = document.createElement('a');

    anchorTag.href = 'data:' + data;
    anchorTag.download = window.location.pathname === '/manageAlarms'
      ? `Alarms Data ${moment(Date.now()).format('DD MMM YYYY HH:mm:ss')}.csv`
      : `Devices Data ${moment(Date.now()).format('DD MMM YYYY HH:mm:ss')}.csv`;
    document.body.appendChild(anchorTag);
    anchorTag.click();
    document.body.removeChild(anchorTag);
  };


  saveBookmarkHandler = () => {
    let filtersListWithFilteredValues = sessionStorage.getItem('filtersListWithFilteredValues') ? JSON.parse(sessionStorage.getItem('filtersListWithFilteredValues')) : cloneDeep(this.state.filtersListWithFilteredValues),
      bookmarkName = sessionStorage.getItem('bookmarkName') ? JSON.parse(sessionStorage.getItem('bookmarkName')) : this.state.bookmarkName,
      bookmarksList = sessionStorage.getItem('bookmarksList') ? JSON.parse(sessionStorage.getItem('bookmarksList')) : cloneDeep(this.state.bookmarksList),
      selectedFilters = sessionStorage.getItem('selectedFilters') ? JSON.parse(sessionStorage.getItem('selectedFilters')) : cloneDeep(this.state.selectedFilters);

    if (bookmarksList.findIndex(val => val.bookmarkName == bookmarkName) != -1) {
      bookmarksList[bookmarksList.findIndex(val => val.bookmarkName == bookmarkName)].bookmarkFilters = filtersListWithFilteredValues;
    } else {
      bookmarksList.push({
        bookmarkName,
        bookmarkFilters: filtersListWithFilteredValues,
        selectedFilters
      });
    }

    sessionStorage.setItem('bookmarksList', JSON.stringify(bookmarksList));
    sessionStorage.setItem('bookmarkName', JSON.stringify(bookmarkName));
    sessionStorage.setItem('selectedFilters', JSON.stringify(selectedFilters));

    this.setState({
      bookmarksList,
      isModalOpen: false,
      bookmarkName,
      showWarningMessage: false
    });
  };

  labelChangeHandler = event => {
    sessionStorage.setItem('bookmarkName', JSON.stringify(event.target.value));
    this.setState({
      bookmarkName: event.target.value
    });
  };

  selectedBookmark = event => {
    let value = event.target.id,
      allFiltersData = sessionStorage.getItem('allFiltersData') ? JSON.parse(sessionStorage.getItem('allFiltersData')) : cloneDeep(this.state.allFiltersData),
      deviceAlarmData = cloneDeep(this.state.deviceAlarmData),
      bookmarksList = sessionStorage.getItem('bookmarksList') ? JSON.parse(sessionStorage.getItem('bookmarksList')) : cloneDeep(this.state.bookmarksList),
      selectedFilters = value == 'Bookmarks' ? [] : bookmarksList.find(val => val.bookmarkName === value).selectedFilters,
      filtersListWithFilteredValues = value == 'Bookmarks' ? filtersListWithValues() : bookmarksList.find(val => val.bookmarkName === value).bookmarkFilters,
      bookmarkName = JSON.stringify(value == 'Bookmarks' ? '' : value);

    allFiltersData = this.getFilterData(allFiltersData, filtersListWithFilteredValues);
    deviceAlarmData = this.getDeviceAlarmData(selectedFilters, deviceAlarmData);

    this.props.deviceDataHandler(deviceAlarmData, selectedFilters);

    sessionStorage.setItem('allFiltersData', JSON.stringify(allFiltersData));
    sessionStorage.setItem('filtersListWithFilteredValues', JSON.stringify(filtersListWithFilteredValues));
    sessionStorage.setItem('selectedFilters', JSON.stringify(selectedFilters));
    sessionStorage.setItem('bookmarkName', bookmarkName);

    this.setState({
      bookmarkName,
      allFiltersData,
      filtersListWithFilteredValues,
      selectedFilters
    });

  };

  addExtraFilterHandler = event => {
    let name = event.target.name,
      checked = event.target.checked,
      allFiltersData = sessionStorage.getItem('allFiltersData') ? JSON.parse(sessionStorage.getItem('allFiltersData')) : cloneDeep(this.state.allFiltersData),
      filteredIndex = allFiltersData.findIndex(val => val.name == name);

    allFiltersData[filteredIndex].display = checked;

    sessionStorage.setItem('allFiltersData', JSON.stringify(allFiltersData));

    this.setState({
      allFiltersData
    });
  };

  applyFilter = (id, name, displayName, checked) => {
    let filtersListWithFilteredValues = sessionStorage.getItem('filtersListWithFilteredValues') ? JSON.parse(sessionStorage.getItem('filtersListWithFilteredValues')) : cloneDeep(this.state.filtersListWithFilteredValues),
      allFiltersData = sessionStorage.getItem('allFiltersData') ? JSON.parse(sessionStorage.getItem('allFiltersData')) : cloneDeep(this.state.allFiltersData),
      filteredIndex = allFiltersData.findIndex(val => val.name == id),
      deviceAlarmData = cloneDeep(this.state.deviceAlarmData),
      selectedFilters = sessionStorage.getItem('selectedFilters') ? JSON.parse(sessionStorage.getItem('selectedFilters')) : cloneDeep(this.state.selectedFilters);

    allFiltersData[filteredIndex].subFilters[allFiltersData[filteredIndex].subFilters.findIndex(value => value.name == name)].checked = checked;

    filtersListWithFilteredValues.map(val => {
      if (val.name === id) {
        if (val.filteredValues.includes(id === 'unit' ? name : displayName)) {
          val.filteredValues.splice(val.filteredValues.indexOf(id === 'unit' ? name : displayName), 1);
        } else {
          val.filteredValues.push(id === 'unit' ? name : displayName);
        }
      }
    });

    if (checked) {
      if (selectedFilters.findIndex(val => val.filterId === id) != -1) {
        let arr = selectedFilters.find(val => val.filterId === id);
        arr.subfilternames.splice(arr.subfilternames.findIndex(val => val === (id === 'unit' ? name : displayName)), 1);
      }
      selectedFilters = selectedFilters.filter(val => val.subfilternames.length != 0);
    } else {
      if (selectedFilters.findIndex(val => val.filterId === id) != -1) {
        selectedFilters[selectedFilters.findIndex(val => val.filterId === id)].subfilternames.push(id === 'unit' ? name : displayName);
      } else {
        selectedFilters.push({ filterId: id, subfilternames: [id === 'unit' ? name : displayName] });
      }
    }

    allFiltersData = this.getFilterData(allFiltersData, filtersListWithFilteredValues);
    deviceAlarmData = this.getDeviceAlarmData(selectedFilters, deviceAlarmData);

    sessionStorage.setItem('allFiltersData', JSON.stringify(allFiltersData));
    sessionStorage.setItem('filtersListWithFilteredValues', JSON.stringify(filtersListWithFilteredValues));
    sessionStorage.setItem('selectedFilters', JSON.stringify(selectedFilters));

    this.props.deviceDataHandler(deviceAlarmData, selectedFilters);

    this.setState({
      allFiltersData,
      filtersListWithFilteredValues,
      selectedFilters
    });
  };

  searchBoxFilter = (event, val) => {
    let filteredDataArray = filterJson(),
      allFiltersData = sessionStorage.getItem('allFiltersData') ? JSON.parse(sessionStorage.getItem('allFiltersData')) : cloneDeep(this.state.allFiltersData),
      filtersListWithFilteredValues = sessionStorage.getItem('filtersListWithFilteredValues') ? JSON.parse(sessionStorage.getItem('filtersListWithFilteredValues')) : cloneDeep(this.state.filtersListWithFilteredValues),
      value = event.target.value,
      filteredObjectIndex = allFiltersData.findIndex(value => val.displayName === value.displayName);

    filteredDataArray = this.getFilterData(filteredDataArray, filtersListWithFilteredValues);

    allFiltersData[filteredObjectIndex].subFilters = filteredDataArray[filteredObjectIndex].subFilters.filter(val => {
      return val.displayName.toLowerCase().includes(value.toLowerCase());
    });
    this.setState({
      searchField: value,
      allFiltersData
    });
  };

  bookmarkeditHandler = () => {
    let bookmarksList = sessionStorage.getItem('bookmarksList') ? JSON.parse(sessionStorage.getItem('bookmarksList')) : cloneDeep(this.state.bookmarksList),
      filtersListWithFilteredValues = sessionStorage.getItem('filtersListWithFilteredValues') ? JSON.parse(sessionStorage.getItem('filtersListWithFilteredValues')) : cloneDeep(this.state.filtersListWithFilteredValues),
      bookmarkName = sessionStorage.getItem('bookmarkName') ? JSON.parse(sessionStorage.getItem('bookmarkName')) : this.state.bookmarkName,
      findObj = bookmarksList.find(val => _.isEqual(val.bookmarkFilters, filtersListWithFilteredValues)),
      showWarningMessage = !(findObj && bookmarkName.length > 0) && bookmarkName != 'Bookmarks' && bookmarkName != '';

    this.setState({
      showWarningMessage
    });

    return (findObj && bookmarkName.length > 0 && bookmarkName != 'Bookmarks');
  };

  resetFilter = () => {
    let allFiltersData = sessionStorage.getItem('allFiltersData') ? JSON.parse(sessionStorage.getItem('allFiltersData')) : cloneDeep(this.state.allFiltersData),
      filtersListWithFilteredValues = sessionStorage.getItem('filtersListWithFilteredValues') ? JSON.parse(sessionStorage.getItem('filtersListWithFilteredValues')) : [cloneDeep(this.state.filtersListWithFilteredValues)];

    allFiltersData = this.getFilterData(allFiltersData, filtersListWithFilteredValues);

    sessionStorage.setItem('allFiltersData', JSON.stringify(allFiltersData));

    this.setState({
      searchField: '',
      allFiltersData,
    });
  };

  deleteSelectedBookmark = (event) => {
    let bookmarkName = sessionStorage.getItem('bookmarkName') ? JSON.parse(sessionStorage.getItem('bookmarkName')) : this.state.bookmarkName,
      bookmarksList = sessionStorage.getItem('bookmarksList') ? JSON.parse(sessionStorage.getItem('bookmarksList')) : cloneDeep(this.state.bookmarksList),
      value = event.target.id,
      index = bookmarksList.findIndex(val => val.bookmarkName === value);

    if (value !== bookmarkName) {
      bookmarksList.splice(index, 1);

      sessionStorage.setItem('bookmarksList', JSON.stringify(bookmarksList));

      this.setState({
        bookmarksList
      })
    }
  }

  alarmStateHandler = (event) => {
    let id = event.target.id,
      checked = event.target.checked,
      notificationAlarmData = sessionStorage.getItem('notificationAlarmData') ? JSON.parse(sessionStorage.getItem('notificationAlarmData')) : cloneDeep(this.state.notificationAlarmData);

    notificationAlarmData[id].state = checked;

    sessionStorage.setItem('notificationAlarmData', JSON.stringify(notificationAlarmData));

    this.setState({
      notificationAlarmData
    })
  }

  filterStateChangeHandler = () => {
    let isFilterMenuOpen = sessionStorage.getItem('isFilterMenuOpen') ? JSON.parse(sessionStorage.getItem('isFilterMenuOpen')) : this.state.isFilterMenuOpen

    isFilterMenuOpen = !this.state.isFilterMenuOpen;

    sessionStorage.setItem('isFilterMenuOpen', isFilterMenuOpen);

    this.setState({
      isFilterMenuOpen
    })
  }

  render() {
    window.onbeforeunload =
      this.state.showWarningMessage &&
      function () {
        return 'Data will be lost if you leave the page, are you sure?';
      };
    return (
      <React.Fragment>
        <div className="sub-header">
          <div className="filter-box fx-b21">
            <button
              type="button"
              className="btn filter-btn collapsed"
              data-toggle="collapse"
              data-target="#filterCollapsible"
              onClick={() => this.filterStateChangeHandler()}
            >
              <span>
                <i className="fas fa-filter" />
              </span>
              Filter
              <i className="far fa-angle-down filter-collapse" />
            </button>

            <button
              type="button"
              className="filter-icon"
              data-toggle="collapse"
              data-target="#filterCollapsible"
              onClick={() => this.filterStateChangeHandler()}
            >
              <i className="fas fa-filter" />
            </button>
            <div className="dropdown search-dropdown-filter">
              <button
                type="button"
                className="filter-icon dropdown-toggle m-0"
                data-toggle="dropdown"
              >
                <i className="far fa-search" />
              </button>
              <div className="dropdown-menu">
                <input
                  type="text"
                  className="dropdown-item form-control"
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>
          <form className="search-box flex">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
              />
              <div className="input-group-append">
                <i className="far fa-search" />
              </div>
            </div>
            <div className="bookmark-box input-group">
              <div className="dropdown custom-dropdown bookmark-dropdown">
                <h6 className="custom-dropdown-title dropdown-toggle" data-toggle="dropdown">{sessionStorage.getItem('bookmarkName') && JSON.parse(sessionStorage.getItem('bookmarkName')).length > 0 ? JSON.parse(sessionStorage.getItem('bookmarkName')) : "No Bookmarks Added"}</h6>
                <ul className={`dropdown-menu ${sessionStorage.getItem('bookmarksList') && JSON.parse(sessionStorage.getItem('bookmarksList')).length == 0 ? "d-none" : ""}`}>
                  <li>
                    <h6 id={"Bookmarks"} onClick={this.selectedBookmark}>
                      Saved Bookmarks
                    </h6>
                  </li>
                  {sessionStorage.getItem('bookmarksList') && JSON.parse(sessionStorage.getItem('bookmarksList')).map(
                    (val, index) => {
                      return (
                        <li key={index}>
                          <h6 id={val.bookmarkName} onClick={this.selectedBookmark}>
                            {val.bookmarkName}
                          </h6>
                          <i className={val.bookmarkName === JSON.parse(sessionStorage.getItem('bookmarkName')) ? "far fa-trash-alt disabled" : "far fa-trash-alt"} id={val.bookmarkName} onClick={this.deleteSelectedBookmark}></i>
                        </li>
                      );
                    },
                  )}
                </ul>
              </div>
              <div className="input-group-append">
                <ReactTooltip delayShow={400} />
                <button
                  type="button"
                  className="active"
                  data-tip={
                    this.bookmarkeditHandler()
                      ? 'Saved Bookmark'
                      : !this.bookmarkeditHandler() &&
                        sessionStorage.getItem('bookmarkName') && JSON.parse(sessionStorage.getItem('bookmarkName')).length > 0
                        ? 'Edited'
                        : 'Save Bookmark'
                  }
                  onClick={() => {
                    this.setState({ isModalOpen: true });
                  }}
                >
                  <i
                    className={
                      this.bookmarkeditHandler()
                        ? 'fas fa-star text-red'
                        : 'far fa-star'
                    }
                  />
                </button>
              </div>
            </div>
          </form>

          <div className="user-detail-box">
            <div className="flex">
              <div className="dropdown alarm-notification ">
                <button
                  type="button"
                  className="sub-header-btn dropdown-toggle"
                  data-toggle="dropdown"
                >
                  <i className={`far fa-bell ${sessionStorage.getItem('notificationAlarmData') && JSON.parse(sessionStorage.getItem('notificationAlarmData')).filter(val => val.state).length > 0 ? "active-badge" : "mr-r-0"}`} ></i>
                  <sup>
                    <span>{sessionStorage.getItem('notificationAlarmData') && JSON.parse(sessionStorage.getItem('notificationAlarmData')).length}</span>
                  </sup>
                </button>
                <ul className="dropdown-menu ">
                  <h5 className="alarm-notification-header">Alarm Notification</h5>
                  {sessionStorage.getItem('notificationAlarmData') && JSON.parse(sessionStorage.getItem('notificationAlarmData')).map((val, index) => {
                    return <li key={index}>
                      <div className="alarm-icon">
                        <img src={require('../../assets/images/alarmRaised.png')} />
                      </div>
                      <div className="alarm-notification-list-content">
                        <p>
                          <span className="title">Tag :</span>
                          <span className="content">{val.deviceTag}</span>
                          <span className="mx-2">|</span>
                          <span className="title">Type :</span>
                          <span className="content">{val.alarmType}</span>
                        </p>
                        <label className="custom-check-box">
                          <input type="checkbox" id={index} checked={val.state} onChange={this.alarmStateHandler} data-tip={val.state ? "Silence" : "Remove Silence"} />
                          <span className="checkmark"><i onClick={this.alarmStateHandler} className={val.state ? "fa fa-bell" : "fa fa-bell-slash"}></i></span>
                        </label>
                      </div>
                      <p className="mr-b-0">
                        <span className="title">Description :</span>
                        <span className="content">
                          {val.description}
                        </span>
                      </p>
                      <h5>{moment(val.timestamp).fromNow()}</h5>
                    </li>
                  })
                  }
                </ul>
              </div>

              <div className="dropdown export-dropdown">
                <button
                  type="button"
                  className="sub-header-btn header-btn-hidden dropdown-toggle"
                  data-toggle="dropdown"
                >
                  <i className="far fa-external-link" />
                Export
              </button>
                <ul className="dropdown-menu">
                  <li
                    onClick={this.downloadSample}
                  >
                    Export as CSV
                </li>
                  <li className="disabled">
                    Export as Excel
                </li>
                </ul>
              </div>

              <button
                type="button"
                className="sub-header-btn"
                onClick={() => clearLocalStorage()}
              >
                <i className="fal fa-sign-out fw600" />
                Logout
              </button>
            </div>

            <div>
              <h6>
                Hello!
                <strong className="fw600i"> nVent Demo</strong>
              </h6>
              <p>
                Welcome to <strong className="fw600i">Shell Scotford</strong>
              </p>
            </div>
          </div>
        </div>

        <div id="filterCollapsible" className={JSON.parse(sessionStorage.getItem('isFilterMenuOpen')) ? "collapse show" : "collapse"}>
          <div className="filter-inner">
            {sessionStorage.getItem('allFiltersData') && JSON.parse(sessionStorage.getItem('allFiltersData')).map(
              (val, index) =>
                val.display && (
                  <div key={index} className="filter-content">
                    <h6 className="filter-title">
                      {val.displayName} :
                      <div className="dropdown custom-dropdown">
                        <button type="button" className="btn btn-toggle dropdown-toggle" data-toggle="dropdown" >
                          <h6 onClick={this.resetFilter}>
                            {JSON.parse(sessionStorage.getItem('filtersListWithFilteredValues')).find(
                              value => value.name === val.name,
                            ).filteredValues.length == 0
                              ? 'ALL'
                              : JSON.parse(sessionStorage.getItem('filtersListWithFilteredValues'))
                                .find(value => value.name === val.name)
                                .filteredValues.join(', ')}
                          </h6>
                        </button>
                        <ul className="list-style-none dropdown-menu">
                          <div className="form-group mb-0">
                            <div className="search-wrapper">
                              <div className="search-wrapper-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Search..."
                                  onChange={event =>
                                    this.searchBoxFilter(event, val)
                                  }
                                  value={this.state.searchField}
                                />
                                <span className="search-wrapper-icon">
                                  <i className="far fa-search" />
                                </span>
                              </div>
                            </div>
                          </div>
                          {val.display && val.subFilters.length > 0 ?
                            val.subFilters.map((subfilter, index) => {
                              return (
                                <li key={index}>
                                  <label className="custom-check-box">
                                    <input
                                      type="checkbox"
                                      checked={subfilter.checked}
                                      onChange={() =>
                                        this.applyFilter(
                                          val.name,
                                          subfilter.name,
                                          subfilter.displayName,
                                          subfilter.checked,
                                        )
                                      }
                                    />
                                    <span className="checkmark" />
                                    {subfilter.displayName}
                                  </label>
                                </li>
                              );
                            })
                            :
                            <li>
                              No Filters Found
                        </li>
                          }
                        </ul>
                      </div>
                    </h6>
                  </div>
                ),
            )}

            {/* Add Filter Modal  */}
            <div className="modal" id="myModal">
              <div className="modal-dialog add-modal">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Add / Remove filter</h4>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="modal-body">
                    {sessionStorage.getItem('allFiltersData') && JSON.parse(sessionStorage.getItem('allFiltersData')).map((val, index) => (
                      <h6>
                        <label key={index} className="custom-check-box">
                          <input
                            type="checkbox"
                            checked={val.display}
                            onChange={this.addExtraFilterHandler}
                            name={val.name}
                          />
                          <span className="checkmark" />
                        </label>
                        {val.displayName}
                      </h6>
                    ))}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-danger"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Add Filter Modal  */}

            <div className="filter-btn-group">
              <button
                className=""
                data-tip="Reset Filters"
              >
                <i id={"Bookmarks"} onClick={this.selectedBookmark} className="far fa-undo" />
              </button>
              <button
                type="button"
                className=""
                data-tip="Add / Remove Filter"
                data-toggle="modal"
                data-target="#myModal"
              >
                <i className="far fa-cogs" />
              </button>
            </div>
          </div>
        </div>
        {/* allFiltersData label start */}
        {
          this.state.isModalOpen && (
            <div className="modal d-block add-label-modal" id="shelvePopup">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">
                      Add Label
                    <button
                        type="button"
                        className="close"
                        onClick={this.bookmarkNameModalcloseHandler}
                      >
                        <i className="far fa-times" />
                      </button>
                    </h4>
                  </div>
                  <div className="modal-body pd-30">
                    <div className="shelve-body">
                      <div className="form-group">
                        <label className="form-label">
                          <span className="mr-r-10">
                            <i className="far fa-tag" />
                          </span>
                        Label :
                      </label>
                        <input
                          type="text"
                          value={JSON.parse(sessionStorage.getItem('bookmarkName')).length > 0 ? JSON.parse(sessionStorage.getItem('bookmarkName')) : ""}
                          onChange={this.labelChangeHandler}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="flex justify-content-end mr-t-20">
                      <button
                        onClick={this.saveBookmarkHandler}
                        type="button"
                        className="btn-danger"
                        disabled={JSON.parse(sessionStorage.getItem('bookmarkName')).length == 0}
                      >
                        Save
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        {/* filter label end  */}
        <Prompt
          when={this.state.showWarningMessage}
          message="Leave site? Changes you made may not be saved."
        />
      </React.Fragment >
    );
  }
}

CustomBreadCrumb.propTypes = {};

export default CustomBreadCrumb;
