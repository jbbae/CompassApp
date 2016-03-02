import React, { Component, PropTypes } from 'react';
import Firebase from 'firebase';
import Rebase from 're-base';

import { AppBar, AppCanvas, Avatar, Divider, Dialog, IconButton, LeftNav, MenuItem, RaisedButton, Styles, TextField } from 'material-ui';

import FullWidthSection from './Full-width-section';
import LoginPopupComponent from './components/LoginPopupComponent';

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
    this._handleRegisterCancel = this._handleRegisterCancel.bind(this);
    this._handleRegisterSubmit = this._handleRegisterSubmit.bind(this);
    this._handleRequestClose = this._handleRequestClose.bind(this);
    this.onLoginClick = this.onLoginClick.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.onProfileClick = this.onProfileClick.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.state = ({
      navOpen: false,
      selectedPage: '',
      openDialogScrollable: false,
      error: null,
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
//    this.props.history.isActive('/') ? 'Compass' :
//    this.props.history.isActive('dashboard') ? 'Dashboard' :
//    this.props.history.isActive('explorerwithnav') ? 'Explore' :
//    this.props.history.isActive('profile') ? 'Profile' : '';

    //Title rendering (according to active Page)
    let title =
    this.state.selectedPage === '/' ? 'Compass' :
    this.state.selectedPage === 'howworks' ? 'How Compass Works' :
    this.state.selectedPage === 'explorerwithnav' ? 'Explore' :
    this.state.selectedPage === 'profile' ? 'Profile' : 'Compass';

    //Render in User's Focus list
    let focusList;
    if (this.state.userInfo) {
      if (this.state.userInfo.Focus) {
        let focusListPre = Object.keys(this.state.userInfo.Focus)
        focusList = focusListPre.map(function(focus) {
          return (<p id="navProfileDetails">{focus}</p>);
        }, this);
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
              src={this.state.userInfo.profilePic ? this.state.userInfo.profilePic.url() : null }>
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
            style={{width: '70%'}} />
          <TextField
            ref='pwLogin'
            hintText="Enter your password"
            type="password"
            style={{width: '70%'}} />
          <div id="loginDivs">
            <p id="navbarLinks">Forgot Password?</p>
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
          ref="registerPopup"
          title="Register"
          autoDetectWindowHeight={true}
          open={this.state.openDialogScrollable}
          onRequestClose={this._handleRequestClose}>
            <LoginPopupComponent onClose={this._handleRegisterCancel} onRegister={this._handleRegisterSubmit} errorMsg={this.state.error} />
        </Dialog>

        <LeftNav
          docked={false}
          open={this.state.navOpen}
          onRequestChange={navOpen => this.setState({navOpen})}>
          <div style={styles.div} onTouchTap={this.onHeaderClick}>Compass</div>
          {userSection}
          <Divider />
          <MenuItem value='/' primaryText='Landing' style={this.state.selectedPage === '/' ? {color: Colors.pink500} : null} onTouchTap={this.onLeftNavChange.bind(null, '/')} />
          <MenuItem value='howworks' primaryText='How Compass Works' style={this.state.selectedPage === 'howworks' ? {color: Colors.pink500} : null} onTouchTap={this.onLeftNavChange.bind(null, 'howworks')} />
          <MenuItem value='explorerwithnav' primaryText='Explore' style={this.state.selectedPage === 'explorerwithnav' ? {color: Colors.pink500} : null} onTouchTap={this.onLeftNavChange.bind(null, 'explorerwithnav')} />
        </LeftNav>

      {React.cloneElement(this.props.children, {userInfo: this.state.userInfo})}

      <FullWidthSection style={styles.footer}>
        <p style={styles.p}>
          &copy; Compass
        </p>
        <br />
        <p style={styles.p}>
          Working hard to maximize the human potential.
        </p>
      </FullWidthSection>
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
      this.setState({ error: 'Please enter all fields' });
    }
    setTimeout(function(){
      this.setState({navOpen: false});
    }.bind(this),500);
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
      this.setState({ error: 'Login Failed!' });
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
    this.setState({
      openDialogScrollable: true
    });
  }

  _handleRegisterCancel() {
    this.setState({
      openDialogScrollable: false
    });
  }

  _handleRegisterSubmit(firstname, lastname, org, email, occupation, id, password) {
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
              self.setState({ error: 'The new user account cannot be created because the email is already in use.' });
              break;
            case "INVALID_EMAIL":
              console.log("The specified email is not a valid email.");
              self.setState({ error: 'The specified email is not a valid email.' });
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
              self.setState({
                error: null,
                openDialogScrollable: false
              });
            }
          });
        }
      });
    } else {
      this.setState({ error: 'Please enter all fields' });
    }
  }

  _handleRequestClose(buttonClicked) {
    if (!buttonClicked) return;
    this.setState({
      openDialogScrollable: false
    });
  }

  //Supposed to be "on click Enter, close navbar"
  keyDown(e) {
    if (e.keyCode === 13) {
      this.onLoginClick();
    }
  }
}

AppComponent.propTypes = {
  history: PropTypes.object
};
