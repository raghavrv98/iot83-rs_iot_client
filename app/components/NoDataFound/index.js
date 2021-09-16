/**
 *
 * NoDataFound
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
class NoDataFound extends React.PureComponent {
  render() {
    return (
      <div className="no-data-outer">
        <ul className="list-view list-style-none">
          {[...Array(7).keys()].map((temp, i) => (
            <li key={temp}>
              <div className="list-logo">
                <div className="skeleton-content" />
              </div>
              {[...Array(4).keys()].map((temp, i) => (
              <div key={temp} className="list-detail">
                <h6 className="skeleton-content" />
                <p className="skeleton-content" />
              </div>
              ))}
            </li>
          ))}
        </ul>
        <div className="no-data-view">
        <div className="no-data-image">
        <img src={require('../../assets/images/notification.png')} />
        </div>
        <h3>No Data</h3>
        <h4>There is no active alarms to display.</h4>
      </div>
      </div>
    );
  }
}

NoDataFound.propTypes = {};

export default NoDataFound;
