import React, {Component, PropTypes } from 'react';
import Firebase from 'firebase';
import Rebase from 're-base';

import { Avatar, Dialog, Divider, FlatButton, Paper, RaisedButton, Snackbar, Styles, Tab, Tabs } from 'material-ui';
let { Colors, Spacing, Typography } = Styles;

import SkillPopup from '../components/SkillPopup';
import CareerPlan from '../components/CareerPlan';
import PersonalInfoPopup from '../components/PersonalInfo';
import VerifyUndeclare from '../components/VerifyUndeclare';
import ProfileIndustryPop from '../components/ProfileIndustryPop';

var base = new Rebase.createClass('https://sageview.firebaseio.com');
var authData = base.getAuth();

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.handleSkillsPopup = this.handleSkillsPopup.bind(this);
    this._handleSkillDialogCancel = this._handleSkillDialogCancel.bind(this);
    this._handleSkillRemove = this._handleSkillRemove.bind(this);
    this.handlePlanPopup = this.handlePlanPopup.bind(this);
    this._handlePlanDialogClose = this._handlePlanDialogClose.bind(this);
    this._handlePlanRemove = this._handlePlanRemove.bind(this);
    this._handleRequestClose = this._handleRequestClose.bind(this);
    this.handleMoreInfoPop = this.handleMoreInfoPop.bind(this);
    this._handleMoreInfoDialogCancel = this._handleMoreInfoDialogCancel.bind(this);
    this._handleMoreInfoUpdater = this._handleMoreInfoUpdater.bind(this);
    this.handleUndTargetFoc = this.handleUndTargetFoc.bind(this);
    this._handleVerifyCancel = this._handleVerifyCancel.bind(this);
    this._handleFinalRemove = this._handleFinalRemove.bind(this);
    this.handleSnackClose = this.handleSnackClose.bind(this);
    this.handleProfileIndPop = this.handleProfileIndPop.bind(this);
    this._handleProfileIndCancel = this._handleProfileIndCancel.bind(this);
    this._handleProfileIndUndeclare = this._handleProfileIndUndeclare.bind(this);
    this.indVerifyPopCancel = this.indVerifyPopCancel.bind(this);

    this.state = {
      selectedSkill: '',
      selectedDescription: '',
      selectedAssObj: null,
      openSkillsPopup: false,
      openVerifyPopup: false,
      selectedPath: null,
      openPlanPopup: false,
      openIndVerifyPop: false,
      selectedInd: null,
      openProfileIndPop: false,
      openMoreInfoPop: false,
      targetUndFoc: null,
      snackopen: false,
      updateMsg: ''
    };
  }

  getStyles() {
    let padding = 400;

    let styles = {
      root: {
        paddingTop: Spacing.desktopKeylineIncrement + 'px'
      },
      rootWhenMedium: {
        paddingTop: Spacing.desktopKeylineIncrement + 'px',
        position: 'relative'
      },
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
      }
    };

  //  if (this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM) ||
  //      this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)) {
  //    styles.root = this.mergeStyles(styles.root, styles.rootWhenMedium);
  //  }

    return styles;
  }

  render() {
    let styles = this.getStyles();

    //Part I - Unbundle user preferences into their respective categories (Industry/Focus/Path)
    let industryList = [];
    let focusList= [];
    let pathHolder = [];
    let planlist;
    let tabsContent = [];

    if (this.props.userInfo) {
      for (let keyI in this.props.userInfo.Industry) {
        if (this.props.userInfo.Industry[keyI].userTied === true) {
          industryList.push( <Paper id="industryBlock" zDepth={1} onTouchTap={self.handleProfileIndPop.bind(null,keyI)}>{keyI}</Paper> );
        }
      }
      for (let keyF in this.props.userInfo.Focus) {
        if (this.props.userInfo.Focus[keyF].userTied === true) { focusList.push(keyF); }
      }
      for (let keyP in this.props.userInfo.Path) {
        if (this.props.userInfo.Path[keyP].userTied === true) { pathHolder.push(keyP); }
      }
    }

    //Part II - Unbundle selected paths into plan buttons
    if (pathHolder.length > 0) {
      let self = this;
      planlist = pathHolder.map(function(pathPref) {
          return (
            <div id="planWrapper">
              <Paper className="careerPlan" zDepth={1} onTouchTap={self.handlePlanPopup.bind(null,pathPref)}>
                <p>{pathPref}</p>
              </Paper>
            </div>
          );
      });
    } else if (pathHolder.length === 0) {
      planlist = (
        <div>
          <p>You still don't have any career plans...</p>
          <p>Go to the Explorer to add some now!</p>
        </div>
      );
    }

    //Part III - Unbundle skills into their respective Foci
    let takenSkills = [];
    let generalList = [];
    let generalSkills = [];
    let generalKnowledge = [];

    //First fetch the general Asset list (to extract Cross-information)
    base.fetch('Asset', {
      context: this,
      then(data) {
        //Loop through all Foci
        for (let i=0; i < 3; i++) {
          if (focusList[i]) {
            let focusSkills = [];
            let focusKnowledge = [];
            //Loop through user Assets
            for (let keyU in this.props.userInfo.Asset) {
              //Loop through general Asset
              for (let keyC in data) {
                if (keyC === keyU) {
                  let focusMatch = false;
                  //Check if it's within this loop's Focus
                  for (let keyF in data[keyC].crossFocus) {
                    if (keyF === focusList[i]) { focusMatch = true; }
                  }
                  //If yes, (1) push into takenSkills, (2) remove from generalList (if exists), (3) categorize into Skill/Knowledge
                  if (focusMatch) {
                    takenSkills.push(keyU);
                    for (var b=0; b < generalList.length; b++) {
                      if (keyU === generalList[b].name) { generalList.splice(b,1); }
                    }
                    if (data[keyC].type === 'Skill') {
                      focusSkills.push(
                        <Paper
                          className="skillBlock"
                          zDepth={2}
                          onTouchTap={this.handleSkillsPopup.bind(null, keyU)}>
                          {keyU}
                        </Paper>
                      );
                    } else if (data[keyC].type === 'Knowledge') {
                      focusKnowledge.push(
                        <Paper
                          className="skillBlock"
                          zDepth={2}
                          onTouchTap={this.handleSkillsPopup.bind(null, keyU)}>
                          {keyU}
                        </Paper>
                      );
                    }
                  } else {
                    let duplicateSwitch = false;
                    for (var c=0; c < takenSkills.length; c++) {
                      if (keyU === takenSkills[c]) { duplicateSwitch = true; }
                    }
                    for (let g=0; g < generalList.length; g++) {
                      if (keyU === generalList[g].name) { duplicateSwitch = true; }
                    }
                    if (!duplicateSwitch) {
                      generalList.push({ name: keyU, type: data[keyC].type });
                    }
                  }
                }
              }
            }

            //Message for when no skills/knowledge for a particular Focus
            if (focusSkills.length === 0) {
              focusSkills.push(
                <h3 id='emptySkillsMsg'>You have no skills in this focus. Time to start building!</h3>
              );
            }

            if (focusKnowledge.length === 0) {
              focusKnowledge.push(
                <h3 id='emptySkillsMsg'>You have no knowledge in this focus. Time to start building!</h3>
              );
            }

            //Push categorized assets under the current Focus (at the end of loop)
            tabsContent.push(
              <Tab label={focusList[i]}>
                <div className="tabcontent">
                  <h3>Skills</h3>
                  <Divider />
                  {focusSkills}
                  <Divider />
                  <h3>Knowledge</h3>
                  <Divider />
                  {focusKnowledge}
                  <div id='undeclareButton'>
                    <FlatButton label="Undeclare" primary={true} onTouchTap={this.handleUndTargetFoc.bind(null, focusList[i])} />
                  </div>
                </div>
              </Tab>
            );
            //Once all Focus have been scanned, render the general Assets (categorized)
          } else {
            generalSkills = generalList.map(function(skill) {
              if (skill.type === 'Skill') {
                return (
                  <Paper
                    className="skillBlock"
                    zDepth={2}
                    onTouchTap={this.handleSkillsPopup.bind(null, skill.name)}>
                    {skill.name}
                  </Paper>
                );
              }
            }, this);
            generalKnowledge = generalList.map(function(skill) {
              if (skill.type === 'Knowledge') {
                return (
                  <Paper
                    className="skillBlock"
                    zDepth={2}
                    onTouchTap={this.handleSkillsPopup.bind(null, skill.name)}>
                    {skill.name}
                  </Paper>
                );
              }
            }, this);
          }
        }
      }
    });

    //Message if general assets are empty
    if (generalSkills.length === 0) {
      generalSkills.push( <h3 id='emptySkillsMsg'>You have no general skills. Time to start building!</h3> );
    }
    if (generalKnowledge.length === 0) {
      generalKnowledge.push( <h3 id='emptySkillsMsg'>You have no general knowledge. Time to start building!</h3> );
    }

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
          onTouchTap={this._handleFinalRemove} />
    ];

    let profileIndPopButton = [
        <FlatButton
          label="Close"
          onTouchTap={this._handleProfileIndCancel} />,
        <FlatButton
          label="Undeclare"
          primary={true}
          onTouchTap={this._handleProfileIndUndeclare} />
    ];

    let moreInfoButtons = [
      <FlatButton
        label="Close"
        onTouchTap={this._handleMoreInfoDialogCancel} />
    ]

    let planDialogStyle = { width: '86%', maxWidth: 'none' };

    return (
      <div className="Profile" style={styles.rootWhenMedium}>
        <Dialog
          title={this.state.selectedSkill}
          actions={skillsPopupButton}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          open={this.state.openSkillsPopup}
          onRequestClose={this._handleRequestClose}>
          <SkillPopup
            description= {this.state.selectedDescription} />
        </Dialog>
        <Dialog
          contentStyle={planDialogStyle}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          open={this.state.openPlanPopup}
          onRequestClose={this._handleRequestClose}>
          <CareerPlan
            selectedpath={this.state.selectedPath}
            openStatus={this._handlePlanDialogClose}
            unTiePref={this._handlePlanRemove} />
        </Dialog>
        <Dialog
          title='More about me...'
          actions={moreInfoButtons}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          open={this.state.openMoreInfoPop}
          onRequestClose={this._handleRequestClose}>
          <PersonalInfoPopup
            userInfo={this.props.userInfo}
            closePopup={this._handleMoreInfoUpdater} />
        </Dialog>
        <Dialog
          title='Undeclare Focus'
          actions={verifyPopupButton}
          autoDetectWindowHeight={true}
          open={this.state.openVerifyPopup}
          onRequestClose={this._handleRequestClose}>
          <VerifyUndeclare
            targetName={this.state.targetUndFoc}
            targetType='Focus' />
        </Dialog>
        <Dialog
          title={this.state.selectedInd}
          actions={profileIndPopButton}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          open={this.state.openProfileIndPop}
          onRequestClose={this._handleRequestClose}>
          <ProfileIndustryPop
            selectedindustry={this.state.selectedInd}
            cancelfunction={this.indVerifyPopCancel}
            vpUndeclareFunction={this._handleFinalRemove}
            openVerUndeclare={this.state.openIndVerifyPop} />
        </Dialog>
        <div className="header">
          <div className="headerDetails">
            <div className="nameAndIcon">
              <h2 style={styles.headline}>{this.props.userInfo.firstName} {this.props.userInfo.lastName}</h2>
              <div id='nameAndIcon2'>
                <Avatar
                  id="profileAvatar"
                  color={Colors.deepOrange300}
                  backgroundColor={Colors.purple500}
                  size={150}
                  src={this.props.userInfo.profilePic ? this.props.userInfo.profilePic.url() : null }>
                  { this.props.userInfo.profilePic ? null : this.props.userInfo.firstName.substring(0,1).concat(this.props.userInfo.lastName.substring(0,1)) }
                </Avatar>
              </div>
              <div id='nameAndIcon2'><RaisedButton label="More Info" onTouchTap={this.handleMoreInfoPop} /></div>
            </div>
            <div className="profileDetails">
              <div className="detailsBlock">
                <div id="detailsFiller"></div>
                <p>{this.props.userInfo.occupation} at {this.props.userInfo.organization}</p>
                <p>Industries: </p>
                {industryList}
              </div>
              <div id="planBlock">
                <p id="planHeading"><strong>My Career Plans</strong></p>
                {planlist}
              </div>
            </div>
          </div>
        </div>
        <Tabs>
          <Tab label='General'>
            <div className="tabcontent">
              <h3>Skills</h3>
              <Divider />
              {generalSkills}
              <Divider />
              <h3>Knowledge</h3>
              <Divider />
              {generalKnowledge}
            </div>
          </Tab>
          {tabsContent}
        </Tabs>
        <Snackbar
          open={this.state.snackopen}
          message={this.state.updateMsg}
          autoHideDuration={1500}
          onRequestClose={this.handleSnackClose} />
      </div>
    );
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
    let skillPrefEP = 'users/' + authData.uid + '/Asset/' + this.state.selectedSkill;
    base.post(skillPrefEP, {
      data: null,
      then() {
        this.setState({
          openSkillsPopup: false
        });
      }
    });
  }

  handleProfileIndPop(indName) {
    this.setState({
      openProfileIndPop: true,
      selectedInd: indName
    });
  }

  _handleProfileIndCancel() {
    this.setState({
      openProfileIndPop: false,
      selectedInd: null
    });
  }

  indVerifyPopCancel() {
    this.setState({ openIndVerifyPop: false });
  }

  _handleProfileIndUndeclare() {
    this.setState({ openIndVerifyPop: true });
  }

  handlePlanPopup(pathPref) {
    this.setState({
      openPlanPopup: true,
      selectedPath: pathPref
    });
  }

  _handlePlanDialogClose() {
    this.setState({ openPlanPopup: false });
  }

  _handlePlanRemove() {
    let planPrefEP = 'users/' + authData.uid + '/Path/' + this.state.selectedPath + '/userTied';
    base.post(planPrefEP, {
      data: false,
      then() {
        this.setState({
          updateMsg: 'Plan was undeclared!',
          snackopen: true,
          openPlanPopup: false,
          selectedPath: null
        });
      }
    });
  }

  handleMoreInfoPop() {
    this.setState({ openMoreInfoPop: true });
  }

  _handleMoreInfoDialogCancel() {
    this.setState({ openMoreInfoPop: false });
  }

  _handleMoreInfoUpdater() {
    this.setState({ openMoreInfoPop: false });
  }

  handleUndTargetFoc(focusName) {
    this.setState({
      targetUndFoc: focusName,
      openVerifyPopup: true
    });
  }

  _handleVerifyCancel() {
    this.setState({ openVerifyPopup: false });
  }

  _handleFinalRemove() {
    if (this.state.targetUndFoc) {
      let focPrefEP = 'users/' + authData.uid + '/Focus/' + this.state.targetUndFoc + '/userTied';
      base.post(focPrefEP, {
        data: false,
        then() {
          this.setState({
            updateMsg: 'Focus was undeclared!',
            snackopen: true,
            openVerifyPopup: false,
            targetUndFoc: null
          });
        }
      });
    } else if (this.state.selectedInd) {
      let indPrefEP = 'users/' + authData.uid + '/Industry/' + this.state.selectedInd + '/userTied';
      base.post(indPrefEP, {
        data: false,
        then() {
          this.setState({
            updateMsg: 'Industry was undeclared!',
            snackopen: true,
            openProfileIndPop: false,
            openIndVerifyPop: false,
            selectedInd: null
          });
        }
      });
    }
  }

  _handleRequestClose(buttonClicked) {
    if (!buttonClicked) return;
    this.setState({
      openSkillsPopup: false,
      openPlanPopup: false,
      openProfileIndPop: false
    });
  }

  handleSnackClose() {
    this.setState({ snackopen: false });
  }
}

Profile.propTypes = {
  userInfo: PropTypes.object.isRequired
};
