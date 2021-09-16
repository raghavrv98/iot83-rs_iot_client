/**
 *
 * Pagination
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
class Pagination extends React.PureComponent {
  render() {
    return (
      <footer className="app-footer">
        <button
          type="button"
          onClick={this.props.onClickBack}
          className="btn-danger"
          disabled={this.props.currentPage == 1}
        >
          <i className="fas fa-angle-left" />
        </button>
        <div className="center">
          <h6>
            Page
            <span>{this.props.currentPage}</span>
            of {this.props.pageCount}
          </h6>
        </div>
        <button
          type="button"
          onClick={this.props.onClickNext}
          className="btn-danger"
          disabled={this.props.pageCount === this.props.currentPage}
        >
          <i className="fas fa-angle-right" />
        </button>
      </footer>
    );
  }
}

Pagination.propTypes = {};

export default Pagination;
