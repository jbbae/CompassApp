'use strict';

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { RaisedButton, TextField, SelectField, Snackbar, MenuItem } from 'material-ui';

export default class LoginPopupComponent extends Component {
  constructor() {
    super();
    this._handleFloatingErrorInputChange1 = this._handleFloatingErrorInputChange1.bind(this);
    this._handleFloatingErrorInputChange2 = this._handleFloatingErrorInputChange2.bind(this);
    this._handleFloatingErrorInputChange3 = this._handleFloatingErrorInputChange3.bind(this);
    this._handleFloatingErrorInputChange4 = this._handleFloatingErrorInputChange4.bind(this);
    this._handleFloatingErrorInputChange6 = this._handleFloatingErrorInputChange6.bind(this);
    this._handleFloatingErrorInputChange7 = this._handleFloatingErrorInputChange7.bind(this);
    this.handleOccChange = this.handleOccChange.bind(this);
    this._handleCancel = this._handleCancel.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this.handleSnackClose = this.handleSnackClose.bind(this);
    this.state = {
      floatingErrorText1: 'This field is required.',
      floatingErrorText2: 'This field is required.',
      floatingErrorText3: 'This field is required.',
      floatingErrorText4: 'This field is required.',
      floatingErrorText6: 'This field is required.',
      floatingErrorText7: 'This field is required.',
      occValue: undefined,
      snackopen: false,
      error: ''
    };
  }

  render() {
    let form = (
      <div>
        <p className='popupText'>Thanks for joining us! You have a great journey ahead, and we're here to make sure it's a smooth ride.</p>
        <p className='popupText'>Please fill in the fields below (the information you provide will help us customize your experience!).</p>
        {this.props.errorMsg ? <p className='popupText'>{this.props.errorMsg}</p> : null}
        <div id="infoentry">
          <TextField
            ref='firstname'
            style={{margin:'0px 20px 0px 20px'}}
            hintText="What's your first name?"
            errorText={this.state.floatingErrorText1}
            floatingLabelText="First Name"
            onEnterKeyDown={this._handleSubmit}
            onChange={this._handleFloatingErrorInputChange1} />
          <TextField
            ref='lastname'
            style={{margin:'0px 20px 0px 20px'}}
            hintText="What's your last name?"
            errorText={this.state.floatingErrorText2}
            floatingLabelText="Last Name"
            onEnterKeyDown={this._handleSubmit}
            onChange={this._handleFloatingErrorInputChange2} />
          <TextField
            ref='org'
            style={{margin:'0px 20px 0px 20px'}}
            hintText='e.g. "University of Michigan"'
            errorText={this.state.floatingErrorText3}
            floatingLabelText="Organization Name"
            onEnterKeyDown={this._handleSubmit}
            onChange={this._handleFloatingErrorInputChange3} />
          <TextField
            ref='email'
            style={{margin:'0px 20px 0px 20px'}}
            hintText="What's your email?"
            errorText={this.state.floatingErrorText4}
            floatingLabelText="Email"
            onEnterKeyDown={this._handleSubmit}
            onChange={this._handleFloatingErrorInputChange4} />
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
            errorText={this.state.floatingErrorText6}
            floatingLabelText="ID"
            onEnterKeyDown={this._handleSubmit}
            onChange={this._handleFloatingErrorInputChange6} />
          <TextField
            ref='password'
            style={{margin:'0px 20px 0px 20px'}}
            hintText="Enter your password"
            errorText={this.state.floatingErrorText7}
            floatingLabelText="Password"
            type="password"
            onEnterKeyDown={this._handleSubmit}
            onChange={this._handleFloatingErrorInputChange7} />
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

    return (
      <div className="loginpopup-component">
        {form}
        <Snackbar
          open={this.state.snackopen}
          message={this.state.error}
          autoHideDuration={1500}
          onRequestClose={this.handleSnackClose} />
      </div>
    );
  }

  _handleFloatingErrorInputChange1(e) { this.setState({ floatingErrorText1: e.target.value ? '' : 'This field is required.' }); }
  _handleFloatingErrorInputChange2(e) { this.setState({ floatingErrorText2: e.target.value ? '' : 'This field is required.' }); }
  _handleFloatingErrorInputChange3(e) { this.setState({ floatingErrorText3: e.target.value ? '' : 'This field is required.' }); }
  _handleFloatingErrorInputChange4(e) { this.setState({ floatingErrorText4: e.target.value ? '' : 'This field is required.' }); }
  _handleFloatingErrorInputChange6(e) { this.setState({ floatingErrorText6: e.target.value ? '' : 'This field is required.' }); }
  _handleFloatingErrorInputChange7(e) { this.setState({ floatingErrorText7: e.target.value ? '' : 'This field is required.' }); }

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

    let self = this;
    if (firstname.length && lastname.length && org.length && email.length && occupation.length && id.length && password.length) {
      console.log('signup');

      base.createUser({
        email: email,
        password: password
      }, function(error, userData) {
        if (error) {
          switch (error.code) {
            case "EMAIL_TAKEN":
              console.log("The new user account cannot be created because the email is already in use.");
              self.setState({
                error: 'The new user account cannot be created because the email is already in use.',
                snackopen: true
              });
              break;
            case "INVALID_EMAIL":
              console.log("The specified email is not a valid email.");
              self.setState({
                error: 'The specified email is not a valid email.',
                snackopen: true
              });
              break;
            default:
              console.log("Error creating user:", error);
          }
        } else {
          console.log("Successfully created user account with uid:", userData.uid);
          let childEndPoint = 'users/' + userData.uid;
          base.post(childEndPoint, {
            data: {
              username: id,
              email: email,
              firstName: firstname,
              lastName: lastname,
              organization: org,
              occupation: occupation
            },
            then() {
              self.setState({ error: null });
              self.props.onClose();
            }
          });
        }
      });
    } else {
      this.setState({
        error: 'Please enter all fields!',
        snackopen: true
      });
    }
  }

  handleSnackClose() {
    this.setState({ snackopen: false });
  }
}

// Uncomment properties you need
// LoginPopupComponent.defaultProps = {};
 LoginPopupComponent.propTypes = {
   onClose: PropTypes.func,
   errorMsg: PropTypes.string
 };
