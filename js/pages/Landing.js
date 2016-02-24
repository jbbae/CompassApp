import React, { Component, PropTypes } from 'react';
import { Dialog, FontIcon, RaisedButton, Styles } from 'material-ui';
import LandingFeature from './Landingfeature';
import FullWidthSection from '../Full-width-section';
import LoginPopupComponent from '../components/LoginPopupComponent';

let { Colors, Spacing, Typography } = Styles;
let DefaultRawTheme = Styles.LightRawTheme;

export default class LandingPage extends Component {
  constructor() {
    super();
    this.onDemoClick = this.onDemoClick.bind(this);
    this.onLoginClick = this.onLoginClick.bind(this);
    this._handleLoginCancel = this._handleLoginCancel.bind(this);
    this._handleLoginSubmit = this._handleLoginSubmit.bind(this);
    this._handleRequestClose = this._handleRequestClose.bind(this);

    this.state = {
      openDialogScrollable: false
    };
  }

  render() {
    let style = {
      paddingTop: Spacing.desktopKeylineIncrement
    };

    return (
      <div style={style}>
        <Dialog
          ref="loginPopup"
          title="Register"
          autoDetectWindowHeight={true}
          open={this.state.openDialogScrollable}
          onRequestClose={this._handleRequestClose}>
            <LoginPopupComponent onClose={this._handleLoginCancel} />
        </Dialog>
        {this._getHomePageHero()}
        {this._getHomePurpose()}
        {this._getHomeFeatures()}
        {this._getHomeContribute()}
      </div>
    );
  }

  _getHomePageHero() {
    let styles = {
      root: {
        backgroundColor: Colors.cyan500,
        overflow: 'hidden'
      },
      svgLogo: {
        marginLeft: (window.innerWidth * 0.5) - 130 + 'px',
        width: 420
      },
      tagline: {
        margin: '16px auto 0 auto',
        textAlign: 'center',
        maxWidth: 575
      },
      label: {
        color: DefaultRawTheme.palette.primary1Color
      },
      githubStyle: {
        margin: '16px 32px 0px 8px'
      },
      demoStyle: {
        margin: '16px 32px 0px 32px'
      },
      h1: {
        color: Colors.darkWhite,
        fontWeight: Typography.fontWeightLight
      },
      h2: {
        color: Colors.darkWhite,
        fontWeight: Typography.fontWeightLight,
        fontSize: 20,
        lineHeight: '28px',
        paddingTop: 19,
        marginBottom: 13,
        letterSpacing: 0
      },
      nowrap: {
        whiteSpace: 'nowrap'
      },
      taglineWhenLarge: {
        margin: '16px auto 0 auto',
        textAlign: 'center',
        maxWidth: 1100,
        marginTop: 32
      },
      h1WhenLarge: {
        color: Colors.darkWhite,
        fontWeight: Typography.fontWeightLight,
        fontSize: 56
      },
      h2WhenLarge: {
        color: Colors.darkWhite,
        fontWeight: Typography.fontWeightLight,
        fontSize: 24,
        lineHeight: '32px',
        paddingTop: 16,
        marginBottom: 12
      }
    };

//    if (this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)) {
//      styles.tagline = this.mergeStyles(styles.tagline, styles.taglineWhenLarge);
//      styles.h1 = this.mergeStyles(styles.h1, styles.h1WhenLarge);
//      styles.h2 = this.mergeStyles(styles.h2, styles.h2WhenLarge);
//    }

//<img style={styles.svgLogo} src="('../../images/material-ui-logo.svg" />

    return (
      <FullWidthSection style={styles.root}>
          <div style={styles.taglineWhenLarge}>
            <FontIcon style={{fontSize: '144px'}} className="material-icons" color={Colors.pink50}>explore</FontIcon>
            <h1 style={styles.h1WhenLarge}>Welcome, to your Career Navigation System.</h1>
            <h2 style={styles.h2WhenLarge}>
              Processing job market data to guide you to success...
            </h2>
            <RaisedButton
              label="Start my journey now!"
              onTouchTap={this.onLoginClick}
              style={styles.demoStyle}
              labelStyle={styles.label}/>
            <RaisedButton
              label="Go to explorer"
              onTouchTap={this.onDemoClick}
              style={styles.demoStyle}
              labelStyle={styles.label}/>
          </div>
      </FullWidthSection>
    );
  }

  _getHomePurpose() {
    let styles = {
      root: {
        backgroundColor: Colors.grey200,
        textAlign: 'center'
      },
      content: {
        maxWidth: 700,
        padding: 0,
        margin: '0 auto',
        fontWeight: Typography.fontWeightLight,
        fontSize: 20,
        lineHeight: '28px',
        paddingTop: 19,
        marginBottom: 13,
        letterSpacing: 0,
        color: Typography.textDarkBlack
      }
    };

    return (
      <FullWidthSection
        style={styles.root}
        useContent={true}
        contentStyle={styles.content}
        contentType="p"
        className="home-purpose">
        Mapping all existing career paths... done.
        <br />
        Analyzing skills required for paths... done.
        <br />
        Preparing personalized platform... done.
        <br />
        <br />
        Your career is too important to leave to luck. Let's take control.
      </FullWidthSection>
    );
  }

  _getHomeFeatures() {
    let styles = {maxWidth: '906px'};
    return (
      <FullWidthSection useContent={true} contentStyle={styles}>
        <LandingFeature
          heading="Your perfect match"
          message="Choose the fields and industries you're interested in - Compass will show what career paths are out there for you."
          route="/get-started"
          img="../../images/get-started.svg"
          firstChild={true}/>
        <LandingFeature
          heading="All you will need"
          message="Make smart career decisions using our analysis for each path, from skills to trends."
          route="/customization"
          img="../../images/css-framework.svg" />
        <LandingFeature
          heading="Plan and track"
          message="Plan your career development in your personalized dashboard, and keep track as you get closer to success!"
          route="/components"
          img="../../images/components.svg"
          lastChild={true}/>
      </FullWidthSection>
    );
  }

  _getHomeContribute() {
    let styles = {
      root: {
        backgroundColor: Colors.grey200,
        textAlign: 'center'
      },
      h3: {
        margin: 0,
        padding: 0,
        fontWeight: Typography.fontWeightLight,
        fontSize: 22,
        color: Typography.textDarkBlack
      },
      button: {
        marginTop: 32
      }
    };

    return (
      <FullWidthSection useContent={true} style={styles.root}>
        <h3 style={styles.h3}>
          Start taking control <span style={styles.nowrap}>of your career.</span>
        <span style={styles.nowrap}> Click to Begin!</span>
        </h3>
        <RaisedButton
          label="Start my journey now!"
          primary={true}
          onTouchTap={this.onLoginClick}
          style={styles.button} />
      </FullWidthSection>
    );
  }

  onDemoClick() {
    this.props.history.pushState(null, 'explorerwithnav');
  }

  onLoginClick() {
    this.setState({
      openDialogScrollable: true
    });
  }

  _handleLoginCancel() {
    this.setState({
      openDialogScrollable: false
    });
  }

  _handleLoginSubmit() {
    this.setState({
      openDialogScrollable: true
    });
  }

  _handleRequestClose(buttonClicked) {
    if (!buttonClicked) return;
    this.setState({
      openDialogScrollable: false
    });
  }
}

LandingPage.propTypes = {
  history: PropTypes.object
};
