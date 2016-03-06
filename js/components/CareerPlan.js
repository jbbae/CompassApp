import React, {Component, PropTypes} from 'react';
import Firebase from 'firebase';
import Rebase from 're-base';

var { Dialog, Divider, FlatButton, FloatingActionButton, FontIcon, Paper, RaisedButton, Styles, Tab, Tabs } = require('material-ui');

import SkillPopup from './SkillPopup';
import BuildingPage from './BuildingPage';
import VerifyUndeclare from './VerifyUndeclare';

var { Colors, Spacing, Typography } = Styles;

var base = new Rebase.createClass('https://sageview.firebaseio.com');
var authData = base.getAuth();

export default class CareerPlan extends Component {
  constructor(props) {
    super(props);
    this.goToProfile = this.goToProfile.bind(this);
    this.handleUndeclare = this.handleUndeclare.bind(this);
    this.handleSkillsPopup = this.handleSkillsPopup.bind(this);
    this._handleSkillDialogCancel = this._handleSkillDialogCancel.bind(this);
    this._handleSkillRemove = this._handleSkillRemove.bind(this);
    this._handleRequestClose = this._handleRequestClose.bind(this);
    this._handleVerifyCancel = this._handleVerifyCancel.bind(this);
    this._handlePlanRemove = this._handlePlanRemove.bind(this);
//    this.handleAddIndustry = this.handleAddIndustry.bind(this);
//    this.handleIndustryUpdate = this.handleIndustryUpdate.bind(this);
//    this.handleIndustryUpdaterClose = this.handleIndustryUpdaterClose.bind(this);

    this.state = {
      selectedSkill: '',
      openSkillsPopup: false,
      openIndustryPopup: false,
      openVerifyPopup: false
    }
  }

  getStyles() {
  //    let desktopGutter = Styles.Spacing.desktopGutter;
    let padding = 400;
    let styles = {
      contentContainerStyle: {
        marginLeft: -padding
      },
      div: {
        position: 'absolute',
        left: 48,
        backgroundColor: Colors.cyan500,
        width: padding,
        height: 48
      },
      headline: {
        fontSize: 24,
        lineHeight: '32px',
        paddingTop: 16,
        marginBottom: 12,
        letterSpacing: 0,
        fontWeight: Typography.fontWeightNormal,
        color: Typography.textDarkBlack
      },
      iconButton: {
        position: 'absolute',
        left: 0,
        backgroundColor: Colors.cyan500,
        color: 'white',
        marginRight: padding
      },
      iconStyle: {
        color: Colors.white
      },
      tabs: {
        position: 'relative'
      },
      tabsContainer: {
        position: 'relative',
        paddingLeft: padding
      },
      //Styles for Paper Component
  //      paperRoot: {
  //        transition: Transitions.easeOut(),
  //        maxWidth: '300px',
  //        margin: '0 auto ' + desktopGutter + ' auto'
  //      },
      paperRootWhenMedium: {
        float: 'left',
        width: '33%',
        marginRight: '4px',
        marginBottom: '0px'
      },
      image: {
        //Not sure why this is needed but it fixes a display
        //issue in chrome
        marginBottom: -6
      }
    };
    
    return styles;
  }

  render() {
    let styles = this.getStyles();

    let skillsContainer = [];

    base.fetch('Asset', {
      context: this,
      then(data) {
        for (let key1 in this.props.userInfo.Asset) {
          for (let key2 in data) {
            if (key1 === key2) {
              for (let key3 in key2.crossPath) {
                if (key3 === this.props.selectedpath) {
                  skillsContainer.push(
                    <Paper
                      className="skillBlock"
                      zDepth={2}
                      onTouchTap={this.handleSkillsPopup.bind(null, key1)}>
                      {key1}
                    </Paper>
                  );
                }
              }
            }
          }
        }
      }
    });

    let skillsPopupButton = [
        <FlatButton
          label="Close"
          onTouchTap={this._handleSkillDialogCancel} />,
        <FlatButton
          label="Remove"
          primary={true}
          onTouchTap={this._handleSkillRemove} />
    ];

    let verifyPopupButton = [
        <FlatButton
          label="Never mind!"
          onTouchTap={this._handleVerifyCancel} />,
        <FlatButton
          label="Undeclare"
          primary={true}
          onTouchTap={this._handlePlanRemove.bind(null)} />
    ];

    if (skillsContainer.length === 0) {
      skillsContainer.push(<h3 id='emptySkillsMsg'>You have no skills in this Career Plan. Time to start building!</h3>);
    }

    return (
        <div className="CareerPlan">
          <Dialog
            title={this.state.selectedSkill}
            actions={skillsPopupButton}
            autoDetectWindowHeight={true}
            autoScrollBodyContent={true}
            open={this.state.openSkillsPopup}
            onRequestClose={this._handleRequestClose}>
              <SkillPopup
                selectedSkill= {this.state.selectedSkill} />
          </Dialog>
          <Dialog
            title='Undeclare Career Path'
            actions={verifyPopupButton}
            autoDetectWindowHeight={true}
            open={this.state.openVerifyPopup}
            onRequestClose={this._handleRequestClose}>
              <VerifyUndeclare
                targetName={this.props.selectedpath}
                targetType='Path' />
          </Dialog>
          <div className="Header">
            <div className='backButton'>
              <FloatingActionButton mini={true} onTouchTap={this.goToProfile} >
                <FontIcon className="material-icons" color={Colors.pink50}>arrow_back</FontIcon>
              </FloatingActionButton>
            </div>
            <h1 id="planTitle">{this.props.selectedpath}</h1>
            <div className='backButton'>
              <FloatingActionButton mini={true} backgroundColor={Colors.red500} onTouchTap={this.handleUndeclare} >
                <FontIcon className="material-icons" color={Colors.red50}>close</FontIcon>
              </FloatingActionButton>
            </div>
          </div>
          <Tabs>
            <Tab label="Skills" >
              <div className="tabcontent">
                <h3>Skills</h3>
                <Divider />
                {skillsContainer}
                <Divider />
                <h3>Knowledge</h3>
                <Divider />
                <h3 id='emptySkillsMsg'>You have no general knowledge. Time to start building!</h3>
              </div>
            </Tab>
            <Tab label="How to Improve" >
              <div>
                <BuildingPage userInfo={this.props.userInfo} />
              </div>
            </Tab>
          </Tabs>
        </div>
      );
  }

  handleUndeclare() {
    this.setState ({ openVerifyPopup: true });
  }

  handleSkillsPopup(skillname) {
    this.setState({
      selectedSkill: skillname,
      openSkillsPopup: true
    });
  }

  _handleSkillDialogCancel() {
    this.setState({
      openSkillsPopup: false
    });
  }

  _handleSkillRemove() {
    let newUserAssets = this.props.userInfo.Asset;
    newUserAssets[this.state.selectedSkill] = null;

    this.setState({
      userAssets: newUserAssets,
      openSkillsPopup: false
    });
  }

  _handleVerifyCancel() {
    this.setState({
      openVerifyPopup: false
    });
  }

  _handlePlanRemove() {
    this.props.unTiePref();
    this.setState({
      openVerifyPopup: false
    });
  }

  _handleRequestClose(buttonClicked) {
    if (!buttonClicked) return;
    this.setState({
      openSkillsPopup: false
    });
  }

  goToProfile() {
    this.props.openStatus();
  }
}

CareerPlan.propTypes = {
  selectedpath: PropTypes.string,
  userInfo: PropTypes.object,
  openStatus: PropTypes.func,
  unTiePref: PropTypes.func,
  selectedCross: PropTypes.array
};
