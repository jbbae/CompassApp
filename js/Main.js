import React, { Component, PropTypes } from 'react';
import Firebase from 'firebase';
import Rebase from 're-base';

import { AppBar, AppCanvas, Avatar, Divider, Dialog, IconButton, LeftNav, MenuItem, RaisedButton, Snackbar, Styles, TextField } from 'material-ui';

import FullWidthSection from './Full-width-section';
import LoginPopupComponent from './components/LoginPopupComponent';
import ForgotPW from './components/ForgotPW';

let { Colors, Spacing, Typography } = Styles;
//let ThemeManager = Styles.ThemeManager;

var base = new Rebase.createClass('https://sageview.firebaseio.com');
var authData = base.getAuth();

export default class AppComponent extends Component {
  constructor() {
    super();
    this.onLeftIconButtonTouchTap = this.onLeftIconButtonTouchTap.bind(this);
    this.onLeftNavChange = this.onLeftNavChange.bind(this);
    this.onHeaderClick = this.onHeaderClick.bind(this);
    this.onRegisterClick = this.onRegisterClick.bind(this);
    this._handleRegisterClose = this._handleRegisterClose.bind(this);
    this.onLoginClick = this.onLoginClick.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.onProfileClick = this.onProfileClick.bind(this);
    this.onForgotClick = this.onForgotClick.bind(this);
    this.onForgotCancel = this.onForgotCancel.bind(this);
    this.handleSnackClose = this.handleSnackClose.bind(this);
    this.state = ({
      navOpen: false,
      selectedPage: '',
      openDialogScrollable: false,
      openDialogForgot: false,
      loginError: null,
      snackopen: false,
      userInfo: null
    })
  }

  //Initial state-link to user information
  componentDidMount() {
    if (authData) {
      let userEndPoint = 'users/' + authData.uid;
      this.ref = base.bindToState(userEndPoint, {
        context: this,
        state: 'userInfo'
      });
    } else {
      this.setState({userInfo: null});
    }
  }

  getStyles() {
    let darkWhite = Colors.darkWhite;
    return {
      footer: {
        backgroundColor: Colors.grey900,
        textAlign: 'center'
      },
      a: {
        color: darkWhite
      },
      p: {
        margin: '0 auto',
        padding: '0',
        color: Colors.lightWhite,
        maxWidth: '380px'
      },
      iconButton: {
        color: darkWhite
      },
      div: {
        cursor: 'pointer',
        //.mui-font-style-headline
        fontSize: '24px',
        color: Typography.textFullWhite,
        lineHeight: Spacing.desktopKeylineIncrement + 'px',
        fontWeight: Typography.fontWeightLight,
        backgroundColor: Colors.cyan500,
        paddingLeft: Spacing.desktopGutter,
        paddingTop: '0px',
        marginBottom: '8px'
      }
    };
  }

  render() {
    let styles = this.getStyles();

// Original version - using temporary (buggy) solution for now
//    let title =
//    this.props.history.isActive('/') ? 'SagePath' :
//    this.props.history.isActive('dashboard') ? 'Dashboard' :
//    this.props.history.isActive('explorerwithnav') ? 'Explore' :
//    this.props.history.isActive('profile') ? 'Profile' : '';

    //Title rendering (according to active Page)
    let title =
    this.state.selectedPage === '/' ? 'SagePath' :
    this.state.selectedPage === 'howworks' ? 'How SagePath Works' :
    this.state.selectedPage === 'explorerwithnav' ? 'Explore' :
    this.state.selectedPage === 'profile' ? 'Profile' : 'SagePath';

    //Render in User's Focus list
    let focusList = [];
    if (this.state.userInfo) {
      if (this.state.userInfo.Focus) {
        for (let key in this.state.userInfo.Focus) {
          if (this.state.userInfo.Focus[key].userTied === true) {
            focusList.push(<p id="navProfileDetails">{key}</p>);
          }
        }
      }
    }

    //User-Login display (changes depending on login state)
    let userSection;
    if (this.state.userInfo !== null) {
      userSection = (
        <div style={{margin: 'auto 7% auto 7%'}}>
          <div id="loginAvatar">
            <Avatar
              color={Colors.deepOrange300}
              backgroundColor={Colors.purple500}
              size={70}
              src={this.state.userInfo.profilePic ? this.state.userInfo.profilePic : null }>
              { this.state.userInfo.profilePic ? null : this.state.userInfo.firstName.substring(0,1).concat(this.state.userInfo.lastName.substring(0,1)) }
            </Avatar>
          </div>
          <div id="loginDivs">
            <p id="navProfileName">{this.state.userInfo.firstName} {this.state.userInfo.lastName}</p>
            {focusList}
          </div>
          <div id="profileButton">
            <RaisedButton
              fullWidth={true}
              label="Profile"
              primary={true}
              onTouchTap={this.onProfileClick} />
          </div>
          <div id="logoutLink" onTouchTap={this.handleLogout}>Logout</div>
        </div>
      );
    } else {
      userSection = (
        <div style={{margin: 'auto auto auto 8%'}}>
          <TextField
            ref='emailLogin'
            hintText="Enter your Email"
            style={{width: '70%'}}
            onEnterKeyDown={this.onLoginClick} />
          <TextField
            ref='pwLogin'
            hintText="Enter your password"
            type="password"
            style={{width: '70%'}}
            onEnterKeyDown={this.onLoginClick} />
          <div id="loginDivs">
            <p id="navbarLinks" onTouchTap={this.onForgotClick}>Forgot Password?</p>
            <p id="navbarLinks" onTouchTap={this.onRegisterClick}>Register Now!</p>
          </div>
          <div id="loginButton">
            <RaisedButton
              label="Login"
              primary={true}
              onTouchTap={this.onLoginClick} />
          </div>
        </div>
      );
    }

//Dashboard item in navigation
//<MenuItem value='dashboard' primaryText='Dashboard' style={this.state.selectedPage === 'dashboard' ? {color: Colors.pink500} : null} onTouchTap={this.onLeftNavChange.bind(null, 'dashboard')} />

    return (
      <AppCanvas>
        <AppBar
          onLeftIconButtonTouchTap={this.onLeftIconButtonTouchTap}
          title={title}
          zDepth={0} />
        <Dialog
          title="Forgot Password"
          autoDetectWindowHeight={true}
          open={this.state.openDialogForgot}>
            <ForgotPW onClose={this.onForgotCancel} />
          </Dialog>
        <Dialog
          title="Register"
          autoDetectWindowHeight={true}
          open={this.state.openDialogScrollable}>
            <LoginPopupComponent onClose={this._handleRegisterClose} />
        </Dialog>

        <LeftNav
          docked={false}
          open={this.state.navOpen}
          onRequestChange={navOpen => this.setState({navOpen})}>
          <div style={styles.div} onTouchTap={this.onHeaderClick}>SagePath</div>
          {userSection}
          <Divider />
          <MenuItem value='/' primaryText='Landing' style={this.state.selectedPage === '/' ? {color: Colors.pink500} : null} onTouchTap={this.onLeftNavChange.bind(null, '/')} />
          <MenuItem value='howworks' primaryText='How SagePath Works' style={this.state.selectedPage === 'howworks' ? {color: Colors.pink500} : null} onTouchTap={this.onLeftNavChange.bind(null, 'howworks')} />
          <MenuItem value='explorerwithnav' primaryText='Explore' style={this.state.selectedPage === 'explorerwithnav' ? {color: Colors.pink500} : null} onTouchTap={this.onLeftNavChange.bind(null, 'explorerwithnav')} />
        </LeftNav>

      {React.cloneElement(this.props.children, {userInfo: this.state.userInfo})}

      <FullWidthSection style={styles.footer}>
        <p style={styles.p}>
          &copy; SagePath
        </p>
        <br />
        <p style={styles.p}>
          Working hard to maximize the human potential.
        </p>
      </FullWidthSection>
      <Snackbar
        open={this.state.snackopen}
        message={this.state.loginError}
        autoHideDuration={1500}
        onRequestClose={this.handleSnackClose} />
      </AppCanvas>
    );
  }

  onLeftIconButtonTouchTap() {
    this.setState({navOpen: !this.state.navOpen});
  }

  onLeftNavChange(route) {
    this.props.history.pushState(null, route);
    this.setState({
      selectedPage: route,
      navOpen: false
    });
  }

  onHeaderClick() {
    this.props.history.pushState(null, '/');
    this.setState({
      selectedPage: '/',
      navOpen: false
    });
  }

  onProfileClick() {
    this.props.history.pushState(null, 'profile');
    this.setState({
      selectedPage: 'profile',
      navOpen: false
    });
  }

  onLoginClick() {
    let self = this;
    let email = this.refs.emailLogin.getValue();
    let password = this.refs.pwLogin.getValue();
    if (email.length && password.length) {
      base.authWithPassword({
        email: email,
        password: password
      }, this.authHandler);
    } else {
      this.setState({
        loginError: 'Please enter all fields',
        snackopen: true
      });
    }
  }

  handleLogout() {
    base.unauth();
    base.removeBinding(this.ref);
    setTimeout(function(){
      this.setState({
        navOpen: false,
        userInfo: null
      });
    }.bind(this),500);
  }

  authHandler(error, authData) {
    // Create a callback to handle the result of the authentication
    if (error) {
      console.log("Login Failed!", error);
      this.setState({
        loginError: 'Login Failed!',
        snackopen: true
      });
    } else {
      console.log("Authenticated successfully with payload:", authData);
      let userEndPoint = 'users/' + authData.uid;
      this.ref = base.bindToState(userEndPoint, {
        context: this,
        state: 'userInfo'
      });
    }
  }

  onRegisterClick() {
    this.setState({ openDialogScrollable: true });
  }

  _handleRegisterClose() {
    this.setState({ openDialogScrollable: false });
  }

  onForgotClick() {
    this.setState({ openDialogForgot: true });
  }

  onForgotCancel() {
    this.setState({ openDialogForgot: false });
  }

  handleSnackClose() {
    this.setState({ snackopen: false });
  }
}

AppComponent.propTypes = {
};
