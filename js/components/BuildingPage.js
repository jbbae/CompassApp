import React, {Component, PropTypes } from 'react';
import Firebase from 'firebase';
import Rebase from 're-base';

import { FontIcon, Popover, RaisedButton, Snackbar, Styles, TextField } from 'material-ui';
let { Colors, Typography } = Styles;

var base = new Rebase.createClass('https://sageview.firebaseio.com');
var authData = base.getAuth();

export default class BuildingPage extends Component {
  constructor() {
    super();
    this.handleAddButton = this.handleAddButton.bind(this);
    this.handleAddtoList = this.handleAddtoList.bind(this);
    this.handleSnackClose = this.handleSnackClose.bind(this);

    this.state = {
      snackopen: false,
      activePopover: false,
      anchorEl: null,
      snackmsg: ''
    };
  }

  render() {
    let listStatusCheck = false;

    base.fetch('emailList', {
      context: this,
      then(data) {
        if (this.props.userInfo) {
          for (let key in data) {
            if (this.props.userInfo.email === data[key]) {
              listStatusCheck = true;
              break;
            }
          }
        }
      }
    });

    return (
      <div style={{textAlign: 'center'}}>
        <FontIcon style={{fontSize: '150px', margin: '15px auto auto auto'}} className="material-icons" color={Colors.cyan900}>build</FontIcon>
        <h2>We are so sorry! This feature is currently unavailable...</h2>
        <p>Our team is currently working very very hard to get this out to you as soon as possible.</p>
        <p>If you wish, we can let you know as soon as this is released.</p>
        <h3>Would you like to be notified once this feature becomes available?</h3>
        <RaisedButton
          label={ listStatusCheck ? 'Already in List!' : 'Yes, let me know!'}
          secondary={true}
          disabled={ listStatusCheck ? true : false }
          onTouchTap={ this.props.userInfo ? this.handleAddtoList.bind(null, this.props.userInfo.email) : this.handleAddButton.bind(this)} />

        <Popover
          open={this.state.activePopover}
          anchorEl={this.state.anchorEl}
          onRequestClose={this.closePopover.bind(this)} >
          <div style={{padding:20}}>
            <h2>Enter your email</h2>
            <p>We'll send a notification to this email once this feature is out!</p>
            <TextField
              ref='emailListEntry'
              hintText="Enter your Email"
              floatingLabelText="Email" />
            <RaisedButton label="Never mind" onTouchTap={this.closePopover.bind(this)} />
            <RaisedButton primary={true} label="Add me to feature emailing list!" onTouchTap={this.handleAddtoList.bind(null, 'seeRef')} />
          </div>
        </Popover>
        <Snackbar
          open={this.state.snackopen}
          message={this.state.snackmsg}
          autoHideDuration={1500}
          onRequestClose={this.handleSnackClose} />
      </div>
    );
  }

  handleAddButton(e) {
    this.setState({
      anchorEl: e.currentTarget,
      activePopover: true
    });
  }

  handleAddtoList(emailEntry) {
    let self = this;
    let notDuplicate = true;
    let emailFinal;
    if (emailEntry === 'seeRef') {
      emailFinal = this.refs.emailListEntry.getValue();
    } else {
      emailFinal = emailEntry;
    }

    base.fetch('emailList', {
      context: this,
      then(data) {
        for (let key in data) {
          if (emailFinal === data[key]) {
            notDuplicate = false;
            break;
          }
        }
        if (notDuplicate) {
          base.push('emailList/', {
            data: emailFinal,
            then() {
              self.setState({
                snackmsg: 'You have been added to the emailing list!',
                snackopen: true,
                activePopover: false
              });
            }
          });
        } else {
          self.setState({
            snackmsg: 'You are already in the emailing list!',
            snackopen: true,
            activePopover: false
          })
        }
      }
    });


  }

  handleSnackClose() {
    this.setState({ snackopen: false });
  }

  closePopover() {
    this.setState({ activePopover: false });
  }
}

BuildingPage.propTypes = {
  userInfo: PropTypes.object
};
