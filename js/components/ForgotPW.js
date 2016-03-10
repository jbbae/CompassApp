'use strict';

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Firebase from 'firebase';
import Rebase from 're-base';

import { Dialog, FlatButton, RaisedButton, TextField } from 'material-ui';

var base = new Rebase.createClass('https://sageview.firebaseio.com');

export default class ForgotPW extends Component {
  constructor() {
    super();
    this._handleFloatingErrorInputChange = this._handleFloatingErrorInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleCancel = this._handleCancel.bind(this);
    this._handleMsgDialogCancel = this._handleMsgDialogCancel.bind(this);

    this.state = {
      floatingErrorText: 'This field is required.',
      openDialogScrollable: false,
      dialogTitle: '',
      dialogMsg: ''
    };
  }

  render() {
    let popupButton = [
        <FlatButton
          label="Okay!"
          onTouchTap={this._handleMsgDialogCancel} />
    ];

    return (
      <div className="loginpopup-component">
        <Dialog
          title={this.state.dialogTitle}
          autoDetectWindowHeight={true}
          actions={popupButton}
          open={this.state.openDialogScrollable}
          onRequestClose={this._handleRequestClose}>
            <h3>{this.state.dialogMsg}</h3>
        </Dialog>

        <TextField
          ref='email'
          style={{margin:'0px 20px 0px 20px'}}
          hintText="What's your email?"
          errorText={this.state.floatingErrorText}
          floatingLabelText="Email"
          onEnterKeyDown={this._handleSubmit}
          onChange={this._handleFloatingErrorInputChange} />
        <div className='buttonWrapper'>
          <RaisedButton
            label="Send me my Reset Email!"
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

  _handleFloatingErrorInputChange(e) {
    this.setState({ floatingErrorText: e.target.value ? '' : 'This field is required.' });
  }

  _handleSubmit() {
    let self = this;
    let email = this.refs.email.getValue();

    base.resetPassword({
      email : email
    }, function(error) {
      if (error === null) {
        console.log("Password reset email sent successfully");
        self.setState({
          openDialogScrollable: true,
          dialogTitle: 'Reset email sent',
          dialogMsg: 'A password reset email has been sent to: ' + email
        });
      } else {
        console.log("Error sending password reset email:", error);
        self.setState({
          openDialogScrollable: true,
          dialogTitle: 'Email not found...',
          dialogMsg: 'No account exists with that email. Please try again.'
        });
      }
    });
  }

  _handleCancel() { this.props.onClose(); }

  _handleMsgDialogCancel() {
    this.setState({ openDialogScrollable: false });
    if (this.state.dialogTitle === 'Reset email sent') { this.props.onClose(); }
  }
}

 ForgotPW.propTypes = {
   onClose: PropTypes.func
 };
