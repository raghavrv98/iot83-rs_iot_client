/**
 *
 * LoginPage
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
import { authConfigDetailsSuccess, authConfigDetailsFailure, getTokenDetailsSuccess, getTokenDetailsFailure, getUserDetailsSuccess, getUserDetailsFailure } from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { cloneDeep } from 'lodash';
import { getAuthConfigDetails, getTokenDetails, getUserDetails } from './actions';
import { client_id, scope, response_type, response_mode, state, redirect_uri, domain_url } from "../../utils/authConfig"

/* eslint-disable react/prefer-stateless-function */
export class LoginPage extends React.PureComponent {

    state = {
        payload: {
            username: "",
            password: ""
        },
    }

    componentDidMount() {
        this.props.getAuthConfigDetails();
    }

    authConfigHandler = () => {
        let url = `${domain_url}/authorize?client_id=${client_id}&scope=${scope}&response_type=${response_type}&response_mode=${response_mode}&state=${state}&redirect_uri=${redirect_uri}`;
        window.location.href = url
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.getUserDetailsSuccess && nextProps.getUserDetailsSuccess !== this.props.getUserDetailsSuccess) {
            sessionStorage.setItem("username", nextProps.getUserDetailsSuccess["https://auth0-info.com/email"]);
            this.props.history.push('/home');
        }

        if (nextProps.getTokenDetailsSuccess && nextProps.getTokenDetailsSuccess !== this.props.getTokenDetailsSuccess) {
            this.props.getUserDetails(this.state.authConfigDetails.userinfo_endpoint, nextProps.getTokenDetailsSuccess.access_token)
        }

        if (nextProps.authConfigDetailsSuccess && nextProps.authConfigDetailsSuccess !== this.props.authConfigDetailsSuccess) {
            const query = new URLSearchParams(this.props.location.search);

            this.setState({
                authConfigDetails: nextProps.authConfigDetailsSuccess,
                tokenEndpoint: nextProps.authConfigDetailsSuccess.token_endpoint
            }, () => query.get('code') && this.props.getTokenDetails(nextProps.authConfigDetailsSuccess.token_endpoint, query.get('code')))
        }
        ['authConfigDetailsFailure', 'getTokenDetailsFailure', 'getUserDetailsFailure'].map(val => {
            this.errorSetStateHandler(nextProps[val], this.props[val]);
        })
    }

    errorSetStateHandler(nextError, currentError) {
        if (nextError && nextError !== currentError) {
            this.setState({
                loading: false,
                error: nextError,
            });
        }
    }

    inputChangeHandler = (event) => {
        let value = event.target.value
        let payload = cloneDeep(this.state.payload)
        payload[event.target.id] = value
        this.setState({
            payload,
            loginError: undefined
        })
    }

    submitHandler = (event) => {
        event.preventDefault()
        sessionStorage.setItem('username', "hi");
        this.props.history.push('/home')
        // this.setState({
        //     loginError: "Invalid username and password"
        // })
    }

    render() {
        return (
            <div className="login-bg">
                <Helmet>
                    <title>Login Page</title>
                    <meta name="description" content="Description of LoginPage" />
                </Helmet>

                <div className="login-frame">
                    <div className="login-branding">
                        <div className="branding-logo">
                            <img src={require('../../assets/images/login.png')} />
                        </div>
                        <h6 className="branding-text">Raychem Supervisor</h6>
                    </div>

                    <div className="login-info">
                        <div className="welcome-text">
                            <h4><i className="fas fa-quote-left"></i>Welcome to the future of</h4>
                            <h3>Connection & Protection<i className="fas fa-quote-right"></i></h3>
                        </div>
                        <p className="error-msg">{this.state.loginError}</p>
                        <div className="login-form text-center">
                            <form onSubmit={this.submitHandler}>
                                <div className="form-content flex align-items-center">
                                </div>
                                <div className="form-content">
                                    <input type="email" id="username" onChange={this.inputChangeHandler} value={this.state.payload.username} name="email" className="form-control" placeholder="Username" required />
                                </div>
                                <div className="form-content">
                                    <input type="password" id="password" onChange={this.inputChangeHandler} value={this.state.payload.password} name="pswd" className="form-control" placeholder="Password" required />
                                </div>
                                <div className="form-content">
                                    <button className="btn-danger">
                                        Login
                                    </button>
                                </div>
                                <div className="form-content">
                                    <a href="#" className="link">
                                        Reset Password
                                    </a>
                                </div>
                                <div className="form-content"><h5>OR</h5></div>
                                <div className="form-content">
                                    <button type="button" className="btn-transparent" onClick={this.authConfigHandler}><img src={require('../../assets/images/loginauth.png')} />Login With Auth0</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

LoginPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
    authConfigDetailsSuccess: authConfigDetailsSuccess(),
    authConfigDetailsFailure: authConfigDetailsFailure(),
    getTokenDetailsSuccess: getTokenDetailsSuccess(),
    getTokenDetailsFailure: getTokenDetailsFailure(),
    getUserDetailsSuccess: getUserDetailsSuccess(),
    getUserDetailsFailure: getUserDetailsFailure()
});

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        getAuthConfigDetails: () => dispatch(getAuthConfigDetails()),
        getTokenDetails: (apiUrl, code) => dispatch(getTokenDetails(apiUrl, code)),
        getUserDetails: (apiUrl, token) => dispatch(getUserDetails(apiUrl, token))
    };
}

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'loginPage', reducer });
const withSaga = injectSaga({ key: 'loginPage', saga });

export default compose(
    withReducer,
    withSaga,
    withConnect,
)(LoginPage);
