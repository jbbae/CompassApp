//require('styles/pages/Profile.sass');

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
      selectedPathCross: [],
      targetUndFoc: null,
      snackopen: false,
      updateMsg: '',
      userInfo: null
    };
  }

  componentDidMount() {
    if (authData) {
      let userEndPoint = 'users/' + authData.uid;
      this.ref = base.bindToState(userEndPoint, {
        context: this,
        state: 'userInfo'
      });
    }
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

    let industryList = [];
    let focusList= [];
    let pathHolder = [];

    let planlist;
    let tabsContent = [];

    //Unbundle user preferences into their respective categories (Industry/Focus/Path)
    for (keyI for this.state.userInfo.Industry) {
      if (this.state.userInfo.Industry[keyI].userTied === true) {
        industryList.push(
          <Paper id="industryBlock" zDepth={1} onTouchTap={self.handleProfileIndPop.bind(null,item)}>{item.name}</Paper>
        );
      }
    }

    for (keyF for this.state.userInfo.Focus) {
      if (this.state.userInfo.Focus[keyF].userTied === true) {
        focusList.push(item);
      }
    }

    for (keyP for this.state.userInfo.Path) {
      if (this.state.userInfo.Path[keyP].userTied === true) {
        pathHolder.push(item);
      }
    }

    //Unbundle selected paths into plan buttons
    if (pathHolder.length > 0) {
      let self = this;
      planlist = (
        pathHolder.map(function(pathPref) {
          return (
            <div id="planWrapper">
              <Paper className="careerPlan" zDepth={1} onTouchTap={self.handlePlanPopup.bind(null,pathPref)}>
                <p>{pathPref.name}</p>
              </Paper>
            </div>
          );
      }));
    }
    else if (pathHolder.length === 0) {
      planlist = (
        <div>
          <p>You still don't have any career plans...</p>
          <p>Go to the Explorer to add some now!</p>
        </div>
      );
    }

//Unbundle skills into their respective Foci
let takenSkills = [];
let generalList = [];
let generalSkills = [];
let generalKnowledge = [];

    for (let i=0; i < 3; i++) {
      if (focusList[i]) {
        let focusSkills = [];
        let focusKnowledge = [];
        for (let k=0; k < this.data.userAssetList.length; k++) {
          for (let w=0; w < this.data.assetCross.length; w++) {
          //Insert under corresponding Focus, and dump into a general List if not.
          //Assets being separated into focusSkills and generalList.
            if (this.data.assetCross[w].name === this.data.userAssetList[k].name && this.data.assetCross[w].crossName === focusList[i].name && this.data.assetCross[w].crossType === 'Focus') {
              takenSkills.push(this.data.userAssetList[k].name);
              for (var b=0; b < generalList.length; b++) {
                if (this.data.userAssetList[k].name === generalList[b].name) {
                  generalList.splice(b,1);
                }
              }
              if (this.data.userAssetList[k].asset.type === 'Skill') {
                focusSkills.push(
                  <Paper
                    className="skillBlock"
                    zDepth={2}
                    onTouchTap={this.handleSkillsPopup.bind(null, this.data.userAssetList[k].name, 'Javascript is a Lang', this.data.userAssetList[k])}>
                    {this.data.userAssetList[k].name}
                  </Paper>
                );
              } else if (this.data.userAssetList[k].asset.type === 'Knowledge') {
                focusKnowledge.push(
                  <Paper
                    className="skillBlock"
                    zDepth={2}
                  onTouchTap={this.handleSkillsPopup.bind(null, this.data.userAssetList[k].name, 'Javascript is a Lang', this.data.userAssetList[k])}>
                  {this.data.userAssetList[k].name}
                  </Paper>
                );
              }
            } else if (this.data.assetCross[w].name === this.data.userAssetList[k].name && this.data.assetCross[w].crossName !== focusList[i].name && this.data.assetCross[w].crossType === 'Focus') {
              let duplicateSwitch = false;
              for (var c=0; c < takenSkills.length; c++) {
                if (this.data.userAssetList[k].name === takenSkills[c]) {
                  duplicateSwitch = true;
                }
              }
              for (let g=0; g < generalList.length; g++) {
                if (this.data.userAssetList[k].name === generalList[g].name) {
                  duplicateSwitch = true;
                }
              }
              if (!duplicateSwitch) {
                generalList.push(this.data.userAssetList[k]);
              }
            }
          }
        }

        //Message for when no skills for a particular Focus
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

        //Push categorized skills under the current Focus and General (at the end of loop)
        tabsContent.push(
          <Tab label={focusList[i].name}>
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
      } else {
        generalSkills = generalList.map(function(skill) {
          if (skill.asset.type === 'Skill') {
            return (
              <Paper
                className="skillBlock"
                zDepth={2}
                onTouchTap={this.handleSkillsPopup.bind(null, skill.name, 'Javascript is a Lang', skill)}>
                {skill.name}
              </Paper>
            );
          }
        }, this);
        generalKnowledge = generalList.map(function(skill) {
          if (skill.asset.type === 'Knowledge') {
            return (
              <Paper
                className="skillBlock"
                zDepth={2}
                onTouchTap={this.handleSkillsPopup.bind(null, skill.name, 'Javascript is a Lang', skill)}>
                {skill.name}
              </Paper>
            );
          }
        }, this);
      }
    }

    if (generalSkills.length === 0) {
      generalSkills.push(
        <h3 id='emptySkillsMsg'>You have no general skills. Time to start building!</h3>
      );
    }

    if (generalKnowledge.length === 0) {
      generalKnowledge.push(
        <h3 id='emptySkillsMsg'>You have no general knowledge. Time to start building!</h3>
      );
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

    let planDialogStyle = {
      width: '86%',
      maxWidth: 'none'
    };

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
              selectedCross={this.state.selectedPathCross}
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
              closePopup={this._handleMoreInfoUpdater} />
          </Dialog>
          <Dialog
            title='Undeclare Focus'
            actions={verifyPopupButton}
            autoDetectWindowHeight={true}
            open={this.state.openVerifyPopup}
            onRequestClose={this._handleRequestClose}>
            <VerifyUndeclare
              targetName={this.state.targetUndFoc ? this.state.targetUndFoc.name : ''}
              targetType='Focus' />
          </Dialog>
          <Dialog
            title={this.state.selectedInd ? this.state.selectedInd.name : ''}
            actions={profileIndPopButton}
            autoDetectWindowHeight={true}
            autoScrollBodyContent={true}
            open={this.state.openProfileIndPop}
            onRequestClose={this._handleRequestClose}>
            <ProfileIndustryPop
              selectedindustry={this.state.selectedInd ? this.state.selectedInd.name : ''}
              cancelfunction={this.indVerifyPopCancel}
              vpUndeclareFunction={this._handleFinalRemove}
              openVerUndeclare={this.state.openIndVerifyPop} />
          </Dialog>
          <div className="header">
            <div className="headerDetails">
              <div className="nameAndIcon">
                <h2 style={styles.headline}>{this.data.user.firstName} {this.data.user.lastName}</h2>
                <div id='nameAndIcon2'>
                  <Avatar
                    id="profileAvatar"
                    color={Colors.deepOrange300}
                    backgroundColor={Colors.purple500}
                    size={150}
                    src={this.data.user.profilePic ? this.data.user.profilePic.url() : null }>
                    { this.data.user.profilePic ? null : this.data.user.firstName.substring(0,1).concat(this.data.user.lastName.substring(0,1)) }
                  </Avatar>
                </div>
                <div id='nameAndIcon2'><RaisedButton label="More Info" onTouchTap={this.handleMoreInfoPop} /></div>
              </div>
              <div className="profileDetails">
                <div className="detailsBlock">
                  <div id="detailsFiller"></div>
                  <p>{this.data.user.occupation} at {this.data.user.organization}</p>
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

  handleSkillsPopup(skillname, skilldesc, skillObj) {
    this.setState({
      selectedSkill: skillname,
      selectedDescription: skilldesc,
      selectedAssObj: skillObj,
      openSkillsPopup: true
    });
  }

  _handleSkillDialogCancel() {
    this.setState({
      openSkillsPopup: false
    });
  }

  _handleSkillRemove() {
    ParseReact.Mutation.Destroy(this.state.selectedAssObj).dispatch();
    this.setState({
      openSkillsPopup: false
    });
  }

  handleProfileIndPop(indObj) {
    this.setState({
      openProfileIndPop: true,
      selectedInd: indObj
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
    let assetList = [];
    for (let s=0; s < this.data.assetCross.length; s++) {
      if (this.data.assetCross[s].crossName === pathPref.name && this.data.assetCross[s].crossType === 'Paths') {
        assetList.push(this.data.assetCross[s]);
      }
    }

    this.setState({
      openPlanPopup: true,
      selectedPath: pathPref,
      selectedPathCross: assetList
    });
  }

  _handlePlanDialogClose() {
    this.setState({
      openPlanPopup: false
    });
  }

  _handlePlanRemove() {
    ParseReact.Mutation.Set(this.state.selectedPath, { userTied: false }).dispatch();
    this.setState({
      updateMsg: 'Plan was undeclared!',
      snackopen: true,
      openPlanPopup: false,
      selectedPath: null
    });
  }

  handleMoreInfoPop() {
    this.setState({
      openMoreInfoPop: true
    })
  }

  _handleMoreInfoDialogCancel() {
    this.setState({
      openMoreInfoPop: false
    });
  }

  _handleMoreInfoUpdater() {
    this.setState({
      openMoreInfoPop: false
    });
  }

  handleUndTargetFoc(focusObj) {
    this.setState({
      targetUndFoc: focusObj,
      openVerifyPopup: true
    });
  }

  _handleVerifyCancel() {
    this.setState({
      openVerifyPopup: false
    });
  }

  _handleFinalRemove() {
    if (this.state.targetUndFoc) {
      ParseReact.Mutation.Set(this.state.targetUndFoc, { userTied: false }).dispatch();
      this.setState({
        updateMsg: 'Focus was undeclared!',
        snackopen: true,
        openVerifyPopup: false,
        targetUndFoc: null
      });
    } else if (this.state.selectedInd) {
      ParseReact.Mutation.Set(this.state.selectedInd, { userTied: false }).dispatch();
      this.setState({
        updateMsg: 'Industry was undeclared!',
        snackopen: true,
        openProfileIndPop: false,
        openIndVerifyPop: false,
        selectedInd: null
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
  history: PropTypes.object
};