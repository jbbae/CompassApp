'use strict';

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { RaisedButton, TextField, SelectField, MenuItem } from 'material-ui';

export default class LoginPopupComponent extends Component {
  constructor() {
    super();
    this._handleFloatingErrorInputChange = this._handleFloatingErrorInputChange.bind(this);
    this.handleOccChange = this.handleOccChange.bind(this);
    this._handleCancel = this._handleCancel.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this.state = {
      loginSelection: false,
      floatingErrorText: 'This field is required.',
      occValue: undefined
    };
  }

  render() {
    let form;

    if (this.state.loginSelection === true) {
      form = (
        <div>
          <div id="infoentry">
            <TextField
              hintText="Enter your ID"
              floatingLabelText="ID" />
            <TextField
              hintText="Enter your password"
              floatingLabelText="Password"
              type="password" />
          </div>
          <p>Don't have an Account yet? Register Now!</p>
          <p>Forgot Password?</p>
        </div>
      );
    } else {
      form = (
        <div>
          <p className='popupText'>Thanks for joining us! You have a great journey ahead, and we're here to make sure it's a smooth ride.</p>
          <p className='popupText'>Please fill in the fields below (the information you provide will help us customize your experience!).</p>
          {this.props.errorMsg ? <p className='popupText'>{this.props.errorMsg}</p> : null}
          <div id="infoentry">
            <TextField
              ref='firstname'
              style={{margin:'0px 20px 0px 20px'}}
              hintText="What's your first name?"
              errorText={this.state.floatingErrorText}
              floatingLabelText="First Name"
              onChange={this._handleFloatingErrorInputChange} />
            <TextField
              ref='lastname'
              style={{margin:'0px 20px 0px 20px'}}
              hintText="What's your last name?"
              errorText={this.state.floatingErrorText}
              floatingLabelText="Last Name"
              onChange={this._handleFloatingErrorInputChange} />
            <TextField
              ref='org'
              style={{margin:'0px 20px 0px 20px'}}
              hintText='e.g. "University of Michigan"'
              errorText={this.state.floatingErrorText}
              floatingLabelText="Organization Name"
              onChange={this._handleFloatingErrorInputChange} />
            <TextField
              ref='email'
              style={{margin:'0px 20px 0px 20px'}}
              hintText="What's your email?"
              errorText={this.state.floatingErrorText}
              floatingLabelText="Email"
              onChange={this._handleFloatingErrorInputChange} />
            <SelectField
              style={{margin:'0px 20px 0px 20px'}}
              value={this.state.occValue}
              onChange={this.handleOccChange}
              floatingLabelText="Occupation">
              <MenuItem value='Student' primaryText='Student' />
              <MenuItem value='Employee' primaryText='Employee' />
              <MenuItem value='Teacher' primaryText='Teacher/Instructor' />
              <MenuItem value='None' primaryText='None (On my way to greatness!)' />
              <MenuItem value='Other' primaryText='Other' />
            </SelectField>
            <TextField
              ref='id'
              style={{margin:'0px 20px 0px 20px'}}
              hintText="Enter your ID"
              errorText={this.state.floatingErrorText}
              floatingLabelText="ID"
              onChange={this._handleFloatingErrorInputChange} />
            <TextField
              ref='password'
              style={{margin:'0px 20px 0px 20px'}}
              hintText="Enter your password"
              errorText={this.state.floatingErrorText}
              floatingLabelText="Password"
              type="password"
              onChange={this._handleFloatingErrorInputChange} />
          </div>
          <div className='buttonWrapper'>
            <RaisedButton
              label="Let's do this!"
              primary={true}
              onTouchTap={this._handleSubmit} />
          </div>
          <div className='buttonWrapper'>
            <RaisedButton
              label="Cancel"
              primary={true}
              onTouchTap={this._handleCancel} />
          </div>
        </div>
      );
    }

    return (
      <div className="loginpopup-component">
        {form}
      </div>
    );
  }

  _handleFloatingErrorInputChange(e) {
    this.setState({
      floatingErrorText: e.target.value ? '' : 'This field is required.',
    });
  }

  handleOccChange(e, index, value) {
    this.setState({occValue: value});
  }

  _handleCancel() {
    this.props.onClose();
  }

  _handleSubmit() {
    let firstname = this.refs.firstname.getValue();
    let lastname = this.refs.lastname.getValue();
    let org = this.refs.org.getValue();
    let email = this.refs.email.getValue();
    let occupation = this.state.occValue;
    let id = this.refs.id.getValue();
    let password = this.refs.password.getValue();

    this.props.onRegister(firstname, lastname, org, email, occupation, id, password);
  }
}

// Uncomment properties you need
// LoginPopupComponent.defaultProps = {};
 LoginPopupComponent.propTypes = {
   onClose: PropTypes.func,
   onRegister: PropTypes.func,
   errorMsg: PropTypes.string
 };
