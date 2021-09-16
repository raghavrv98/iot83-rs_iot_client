/**
 *
 * ConfirmationModal
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
class ConfirmationModal extends React.PureComponent {
  render() {
    return (
      <div className="modal show d-block animated slideInDown">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body confirmation-modal-content">
              <button type="button" onClick={() => this.props.confirmModalHandler()} className="close">
                <i className="far fa-times"></i>
              </button>
              <h4>Changes to the selected Bookmark have been made, but not saved.</h4>
              <h6>Do you want to save these changes?</h6>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-dark">No</button>
              <button type="button" className="btn btn-dark">Yes</button>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

ConfirmationModal.propTypes = {};

export default ConfirmationModal;
