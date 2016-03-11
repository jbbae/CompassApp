//require('styles/App-left-nav.sass');

import React, { Component, PropTypes } from 'react';
import { Divider, LeftNav, Styles, TextField } from 'material-ui';
import MenuItem from 'material-ui/lib/menus/menu-item';
let { Colors, Spacing, Typography } = Styles;

export default class AppLeftNav extends Component {
  constructor() {
    super();
    this.onLeftNavChange = this.onLeftNavChange.bind(this);
    this.onHeaderClick = this.onHeaderClick.bind(this);
    this.state = ({
      selectedPage: ''
    });
  }

  getStyles() {
    return {
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
    };
  }

  render() {

    return (
      <LeftNav
        docked={false}
        open={this.props.open}>
        <div style={this.getStyles()} onTouchTap={this.onHeaderClick}>Compass</div>
        <div>
          <TextField
            hintText="Enter your ID"
            floatingLabelText="ID" />
          <TextField
            hintText="Enter your password"
            floatingLabelText="Password"
            type="password" />
          <p>Don't have an Account yet? Register Now!</p>
          <p>Forgot Password?</p>
        </div>
        <Divider />
        <MenuItem value='/' primaryText='Landing' style={this.state.selectedPage === '/' ? {color: Colors.pink500} : null} onTouchTap={this.onLeftNavChange.bind(null, '/')} />
        <MenuItem value='dashboard' primaryText='Dashboard' style={this.state.selectedPage === 'dashboard' ? {color: Colors.pink500} : null} onTouchTap={this.onLeftNavChange.bind(null, 'dashboard')} />
        <MenuItem value='profile' primaryText='My Profile' style={this.state.selectedPage === 'profile' ? {color: Colors.pink500} : null} onTouchTap={this.onLeftNavChange.bind(null, 'profile')} />
        <MenuItem value='explorerwithnav' primaryText='Explore' style={this.state.selectedPage === 'explorerwithnav' ? {color: Colors.pink500} : null} onTouchTap={this.onLeftNavChange.bind(null, 'explorerwithnav')} />
      </LeftNav>
      );
  }

//Modify this function to work with onTouchTap modifications
  onLeftNavChange(route) {
    this.context.router.push(route);
    this.setState({ selectedPage: route });
  }

  onHeaderClick() {
    this.context.router.push('/');
    this.setState({ selectedPage: '/' });
  }
}

AppLeftNav.contextTypes = {
  router: React.PropTypes.object.isRequired
};

AppLeftNav.propTypes = {
  open: PropTypes.bool
};
