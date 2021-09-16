/**
 *
 * Trends
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
import makeSelectTrends from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
export class Trends extends React.Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>Trends</title>
          <meta name="description" content="Description of Trends" />
        </Helmet>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

Trends.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  trends: makeSelectTrends(),
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

const withReducer = injectReducer({ key: 'trends', reducer });
const withSaga = injectSaga({ key: 'trends', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Trends);
