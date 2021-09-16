/**
 *
 * Header
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import history from '../../utils/history';

/* eslint-disable react/prefer-stateless-function */
class Header extends React.PureComponent {
  render() {
    return (
      <header className="appHeader">
        <nav className="navbar navbar-expand-lg">
          <div className="menu-icon">
            <button
              className="navbar-toggler "
              data-toggle="collapse"
              data-target="#navbar"
            >
              <i className="far fa-bars" />
            </button>
          </div>
          <a className="navbar-brand " href="">
            <img src={require('../../assets/images/nventlogo2.png')} />
          </a>
          <div className="brand-name">
            <h1 className="text-left text-white ">
              <strong className="text-theme">RAYCHEM </strong> Supervisor{' '}
            </h1>
          </div>
          <div
            className="navbar-collapse navbar-responsive collapse"
            id="navbar"
          >
            <ul className="navbar-nav ">
              <li
                className={`nav-item ${
                  this.props.currentPage === 'home' ? 'active' : null
                }`}
              >
                <div className="nav-link" onClick={() => history.push('/home')}>
                  <span>
                    <i className="far fa-home" />
                  </span>
                  Home
                </div>
              </li>
              <li
                className={`nav-item ${
                  this.props.currentPage === 'manageDevices' ? 'active' : null
                }`}
              >
                <div
                  className="nav-link"
                  onClick={() => history.push('/manageDevices')}
                >
                  <span>
                    <i className="far fa-server" />
                  </span>
                  Devices
                </div>
              </li>
              <li
                className={`nav-item ${
                  this.props.currentPage === 'manageAlarms' ? 'active' : null
                }`}
              >
                <div
                  className="nav-link"
                  onClick={() => history.push('/manageAlarms')}
                >
                  <span>
                    <i className="far fa-bell" />
                  </span>
                  Alarms
                </div>
              </li>
              <li
                className={`nav-item ${
                  this.props.currentPage === 'manageTrends' ? 'active' : null
                }`}
              >
                <div
                  className="nav-link"
                  onClick={() => history.push('/manageTrends')}
                >
                  <span>
                    <i className="far fa-chart-line" />
                  </span>
                  Trends
                </div>
              </li>
              <li
                className={`nav-item ${
                  this.props.currentPage === 'home' ? null : null
                }`}
              >
                <div className="nav-link">
                  <span>
                    <i className="far fa-file-invoice" />
                  </span>
                  Reports
                </div>
              </li>
            </ul>
          </div>
          <a className="navbar-brand " href="">
            <img src={require('../../assets/images/shelllogo.png')} />
          </a>
        </nav>
      </header>
    );
  }
}

Header.propTypes = {};

export default Header;
