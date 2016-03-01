//require('../css/pages/ExplorerDescription.sass');

import React, {Component, PropTypes} from 'react';
import Firebase from 'firebase';
import Rebase from 're-base';

import { Avatar,
  CircularProgress,
  Dialog,
  Divider,
  DropDownMenu,
  FlatButton,
  FloatingActionButton,
  FontIcon,
  MenuItem,
  Paper,
  RaisedButton,
  Styles,
  Snackbar,
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
  Tab,
  Tabs } from 'material-ui';

import SkillPopup from '../components/SkillPopup';
import PlanDeclarePopup from '../components/PlanDeclarePopup';
import BuildingPage from '../components/BuildingPage';
import RequiredIFDisplay from '../components/RequiredIFDisplay';
import EmptyContent from '../components/EmptyContent';

let { Colors, Typography } = Styles;

var base = new Rebase.createClass('https://sageview.firebaseio.com');
var authData = base.getAuth();

export default class ExplorerDescription extends Component {
  //Need to call in observe() with the "User Skills Joint Table" to update status (have/not have)
  constructor() {
    super();
    this.handleNeedLogin = this.handleNeedLogin.bind(this);
    this.handleFavorite = this.handleFavorite.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleDeclare = this.handleDeclare.bind(this);
    this.handleDeclareFinal = this.handleDeclareFinal.bind(this);
    this.declarePopupBack = this.declarePopupBack.bind(this);
    this.handleAlreadyMsg = this.handleAlreadyMsg.bind(this);
    this.handleSkillsPopup = this.handleSkillsPopup.bind(this);
    this._handleSkillDialogCancel = this._handleSkillDialogCancel.bind(this);
    this._handleSkillLike = this._handleSkillLike.bind(this);
    this._handleRequestClose = this._handleRequestClose.bind(this);
    this.handleSnackClose = this.handleSnackClose.bind(this);
    this.state = ({
      updateMsg: '',
      updateFullMsg: '',
      snackopen: false,
      fullsnackopen: false,
      refresh: false,
      selectedSkill: '',
      openSkillsPopup: false,
      openDeclarePopup: false,
      assetLike: false,
      userPref: null
    })
  }

  componentDidMount() {
    if (authData) {
      let userEndPoint = 'users/' + authData.uid + '/' + this.props.exploreType + '/' + this.props.selecteditem;
      this.ref = base.syncState(userEndPoint, {
        context: this,
        state: 'userPref'
      });
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

      //Input the userList object into a global variable + Count the # of Declared while at it.
      let declareCount = 0;
      if (this.state.userPref) {
        let counterEndPt = 'users/' + authData.uid + '/' + this.props.exploreType;
        base.fetch(counterEndPt, {
          context: this,
          then(data) {
            for (let key in data) {
              if (data[key].userTied) { declareCount++; }
            }
          }
        });

      //Prepare the likeDropDown and declareButton accordingly
      let likeDropDown;
      let declareButton;

      if (this.state.userPref && this.props.selectedObj) {
        likeDropDown = (
          <DropDownMenu value={this.state.userPref ? this.state.userPref.likeStatus : null} onChange={Parse.User.current() ? this.handleFavorite : this.handleNeedLogin}>
            <MenuItem value={null} primaryText='Not Sure...' />
            <MenuItem value={true} primaryText='Like!' />
            <MenuItem value={false} primaryText='Nope!' />
          </DropDownMenu>
        );

        if (this.state.userPref.likeStatus === true) {
          if (this.state.userPref.userTied === false) {
            declareButton = <RaisedButton label="Make Primary!" secondary={true} onTouchTap={this.handleDeclare.bind(null, declareCount)} />;
          } else if (this.state.userPref.userTied === true) {
            declareButton = <RaisedButton label="Already Primary" onTouchTap={this.handleAlreadyMsg} />;
          }
        }
      }

      //Section 1 Items
      let overview;
      let IFbullets1;
      let IFbullets2;
      let Pbullets;
      let workEnvDesc;
      //Section 2 Items
      let howToBDesc;
      let licensesDesc;
      //Section 3 Items
      let jobOutDesc;
      let jobProsp;

      //Unbundle Descriptions
      if (this.props.selectedObj) {
        for (let key in this.props.selectedObj.Description) {
          if (key === "Overview") {
            overview = this.props.selectedObj.Description[key];
          } else if (key === 'Concentrations' || key === 'Products & Services') {
            for (keyBull in this.props.selectedObj.Description[key]) {
              if (this.props.selectedObj.Description[key][keyBull]) {
                IFbullets2.push({keyBull: this.props.selectedObj.Description[key][keyBull]});
              } else {
                IFbullets1.push({keyBull: this.props.selectedObj.Description[key][keyBull]});
              }
            }
          } else if (key === 'Duties') {
            Pbullets = this.props.selectedObj.Description[key];
          } else if (key === 'Work Environment') {
            workEnvDesc = this.props.selectedObj.Description[key];
          } else if (key === 'How to Become') {
            howToBDesc = this.props.selectedObj.Description[key];
          } else if (key === 'Licenses') {
            licensesDesc = this.props.selectedObj.Description[key];
          } else if (key === 'Job Outlook') {
            jobOutDesc = this.props.selectedObj.Description[key];
          } else if (key === 'Job Prospects') {
            jobProsp = this.props.selectedObj.Description[key];
          }
        }
      }

      //Dummy data for Company List
      let companies = [
        { name: 'Company 1', country: 'England', url: 'http://www.google.com'},
        { name: 'Company 2', country: 'USA', url: 'http://www.yahoo.com'},
        { name: 'Company 3', country: 'England', url: 'http://www.cummins.com'},
        { name: 'Company 4', country: 'Korea', url: 'http://www.mckinsey.com'}
      ];

      //Unbundle Assets for Focus/Path
      let assets = [];

      if (this.props.exploreType !== 'Industry') {
        for (let key in this.props.selectedObj.Assets) {
          assets.push(
            <Paper
              className="skillBlock"
              zDepth={2}
              onTouchTap={this.handleSkillsPopup.bind(null, key)}>
              {key}
            </Paper>
          );
        }
      }

      //Structure Overview content to render in as object
      let tabOneContent;
      let tabOneOverview;
      for (key in overview) {
        tabOneOverview.push(<p>{overview[key]}</p>);
      }

      //Tab 1 Start
      let tabOneBullets = [];
      let tabOneWorkEnv = [];
      //Tab One Content (I/F)
      if (this.props.exploreType !== 'Path') {
        for (let key in IFbullets1) {
          let lvlTwoBullets = [];
          for (let key2 in IFbullets2) {
            if(key === IFbullets2[key2]) { lvlTwoBullets.push(<li>{key2}</li>); }
          }
          tabOneBullets.push(
            <li>{key}
              <ul>{lvlTwoBullets.length > 0 ? lvlTwoBullets : null }</ul>
            </li>
          );
        }
        //Determine Tab 1's bullet subsection heading
        let tabOneBulletHeading;
        if (this.props.exploreType === 'Industry') { tabOneBulletHeading = <h3>Products & Services</h3>;}
        else if (this.props.exploreType === 'Focus') { tabOneBulletHeading = <h3>Concentrations</h3>; }

        //Tab 1 Content (I/F) Compiler
        tabOneContent =
          <div className="tabcontent">
            {tabOneOverview.length > 0 ? tabOneOverview : null}
            {tabOneBullets.length > 0 ? tabOneBulletHeading : null}
            <div className='bulletAligner'>
              {tabOneBullets.length > 0 ? tabOneBullets : null}
            </div>
          </div>;

      //Tab 1 Content (Path)
      } else if (this.props.exploreType === 'Path') {
        for (let key in Pbullets) { tabOneBullets.push(<li>{Pbullets[key]}</li>); }
        for (let key in workEnvDesc) { tabOneWorkEnv.push(<p>{workEnvDesc[key]}</p>); }

        //Tab 1 Content (Path) Compiler
        tabOneContent =
          <div className="tabcontent">
            {tabOneOverview.length > 0 ? tabOneOverview : null}
            {tabOneBullets.length > 0 ? <h3>Duties</h3> : null}
            {tabOneBullets.length > 0 ? tabOneBullets : null}
            {tabOneWorkEnv.length > 0 ? <h3>Work Environment</h3> : null}
            {tabOneWorkEnv.length > 0 ? tabOneWorkEnv : null}
          </div>;
      }
      //Tab 1 End

      //Tab 2 & 3 Start
      let tabTwoContent;
      let labeltwo;
      let tabThreeContent;
      let tabComponents;

      //Tab 2 - Industry
      if(this.props.exploreType === 'Industry') {
        labeltwo = 'Companies';

        tabTwoContent = <BuildingPage />

//        let tabTwoRows = companies.map(function(company) {
//          return (
//            <TableRow>
//              <TableRowColumn>{company.name}</TableRowColumn>
//              <TableRowColumn>{company.country}</TableRowColumn>
//              <TableRowColumn>{company.url}</TableRowColumn>
//            </TableRow>
//          );
//        }, this);

//        tabTwoContent =
//          <Table
//            height='100%'
//            fixedHeader={true}>
//            <TableHeader displaySelectAll={false}>
//              <TableRow>
//                <TableHeaderColumn>Company Name</TableHeaderColumn>
//                <TableHeaderColumn>Country</TableHeaderColumn>
//                <TableHeaderColumn>Company Wiki</TableHeaderColumn>
//              </TableRow>
//            </TableHeader>
//            <TableBody displayRowCheckbox={false}>
//              {tabTwoRows}
//            </TableBody>
//          </Table>;

          tabThreeContent = null;
      }
      //Tab 2 - Focus
      else if (this.props.exploreType === 'Focus') {
        labeltwo = 'Skills';

        //Tab 2 (Focus) Compiler
        tabTwoContent =
          <div className="tabcontent">
            {assets.length > 0 ? assets : null}
          </div>;
        tabThreeContent = null;
      }
      //Tab 2 & 3 - Path
      else if (this.props.exploreType === 'Path') {
        labeltwo = 'How to Become';
        let tabTwoPartA;
        let tabTwoPartB;

        for (let key in howToBDesc) { tabTwoPartA.push(<p>{howToBDesc[key]}</p>); }
        for (let key in licensesDesc) { tabTwoPartB.push(<p>{licensesD[key]}</p>); }

        //Tab 2 (Path) Compiler
        tabTwoContent =
          <div className="tabcontent">
            {tabTwoPartA.length > 0 ? <h3>How to Become</h3> : null}
            {tabTwoPartA.length > 0 ? tabTwoPartA : null}
            {tabTwoPartB.length > 0 ? <h3>Licences & Certifications</h3> : null}
            {tabTwoPartB.length > 0 ? tabTwoPartB : null}
            <RequiredIFDisplay selecteditem={this.props.selecteditem} selectedindustries={this.props.selectedObj.crossIndustry} selectedfocus={this.props.selectedObj.crossFocus} />
            {assets.length > 0 ? <h3>Skills</h3> : null}
            <Divider />
            {assets}
          </div>;

          //Tab 3 Start
          let tabThreePartA;
          let tabThreePartB;

          for (let key in jobOutDesc) { tabThreePartA.push(<p>{jobOutDesc[key]}</p>); }
          for (let key in jobProsp) { tabThreePartB.push(<p>{jobProsp[key]}</p>); }

          //Tab 3 Compiler
          tabThreeContent =
            <Tab label="Job Prospects">
              <h3>Job Outlook</h3>
              {tabThreePartA.length > 0 ? tabThreePartA : null}
              {tabThreePartB.length > 0 ? <h3>Job Prospects</h3> : null}
              {tabThreePartB.length > 0 ? tabThreePartB : null}
              {tabThreePartA.length + tabThreePartB.length === 0 ? <EmptyContent /> : null}
            </Tab>
      }
      //Tab 3 End

      //Final Compiler
      if (this.props.exploreType === 'Industry' || this.props.exploreType === 'Focus') {
        tabComponents =
          <Tabs>
            <Tab label="Overview" >
              {tabOneContent}
            </Tab>
            <Tab label={labeltwo} >
              {tabTwoContent}
            </Tab>
          </Tabs>
      } else if (this.props.exploreType === 'Path') {
        tabComponents =
          <Tabs>
            <Tab label="Overview" >
              {tabOneContent}
            </Tab>
            <Tab label={labeltwo} >
              {tabTwoContent}
            </Tab>
              {tabThreeContent}
          </Tabs>
      }

      //Control buttons for Skills Popup
      let skillsPopupButton = [
          <FlatButton
            label="Close"
            onTouchTap={this._handleSkillDialogCancel} />,
          <FlatButton
            label={this.state.assetLike ? "Added" : "Add"}
            primary={this.state.assetLike ? false : true}
            onTouchTap={this._handleSkillLike} />
      ];

      return (
          <div className="ExplorerDescription">
            <Dialog
              title={this.state.selectedSkill}
              actions={skillsPopupButton}
              autoDetectWindowHeight={true}
              autoScrollBodyContent={true}
              open={this.state.openSkillsPopup}
              onRequestClose={this._handleRequestClose}>
              <SkillPopup
                description= {this.state.selectedSkill} />
            </Dialog>
            <Dialog
              title="Declare Career Path"
              autoDetectWindowHeight={true}
              autoScrollBodyContent={true}
              open={this.state.openDeclarePopup}
              onRequestClose={this._handleRequestClose}>
              <PlanDeclarePopup
                selecteditem= {this.props.selecteditem}
                exploreType= {this.props.exploreType}
                declarefunction= {this.handleDeclareFinal}
                selectedObj={this.props.selectedObj}
                closePopup= {this.declarePopupBack}/>
            </Dialog>
            <div className="Header">
              <div className="HeaderButtons">
                <div>
                  <FloatingActionButton onTouchTap={this.handleBack} mini={true}>
                    <FontIcon className="material-icons" color={Colors.pink50}>arrow_back</FontIcon>
                  </FloatingActionButton>
                </div>
                <div>
                  <div>{likeDropDown}</div>
                  <div>{declareButton}</div>
                </div>
              </div>
              <div className="Headerdetails">
                <table width="600px">
                  <tr>
                    <td width="30%">
                      <Avatar
                        color={Colors.deepOrange300}
                        backgroundColor={Colors.purple500}
                        size={120}>
                        AC
                      </Avatar>
                    </td>
                    <td width="70%">
                      <h2 className="descPTitle">{this.props.selecteditem}</h2>
                      <p className='descPSubtitle'>Type: {this.props.exploreType}</p>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
              <div className="body">
            {tabComponents}
            </div>

            <Snackbar
              open={this.state.snackopen}
              message={this.state.updateMsg}
              autoHideDuration={1500}
              onRequestClose={this.handleSnackClose} />

            <Snackbar
              open={this.state.fullsnackopen}
              message={this.state.updateFullMsg}
              autoHideDuration={5000}
              onRequestClose={this.handleSnackClose} />
          </div>
        );
    }

    handleNeedLogin() {
      this.setState({
        updateMsg: 'You must be logged in to use this function!',
        snackopen: true
      })
    }

    handleFavorite(e, index, value) {
      let self = this;
      if (authData) {
        if (value === null && this.state.userPref != null) {
          this.setState({userPref: null});

        } else if (value != null && this.state.userPref === null) {
          let listType;
          if (this.props.exploreType === 'Focus' || this.props.exploreType === 'Path') { listType = 'Path'; }

          let newEndPoint = authData.uid + '/' + listType + '/' + this.props.selecteditem;

          base.post(newEndPoint, {
            data: {
              name: this.props.selecteditem,
              likeStatus: value,
              userTied: false
            },
            then() {
              self.setState({
                updateMsg: 'Added to your preferences!',
                snackopen: true
              });
            }
          });
        } else if (value != null && this.state.userPref != null) {
          let newPref = React.addons.update(this.state.userPref, {likeStatus: {$set: value}});
          this.setState({userPref: newPref});
        }
      }

      this.refreshQueries();
      setTimeout(function(){
        this.setState({refresh: true});
      }.bind(this),500);
    }

    handleDeclare(declareCount) {
      if (declareCount < 3) {
        this.setState({ openDeclarePopup: true });
      } else {
        let message1 = 'Already declared 3 '
        let message2;
        if (this.props.exploreType === 'Focus') { message2 = 'Foci' }
        else if (this.props.exploreType === 'Industry') { message2 = 'Industries' }
        else if (this.props.exploreType === 'Path') { message2 = 'Career Paths' }
        let message3 = '! You need to undeclare at least one (from Profile) to declare this.';
        this.setState({
          updateFullMsg: message1.concat(message2,message3),
          fullsnackopen: true
        });
      }
    }

    declarePopupBack() {
      this.setState({ openDeclarePopup: false });
    }

    handleDeclareFinal() {
      let str1 = 'Declared ';
      let newPref = React.addons.update(this.state.userPref, {userTied: {$set: true}});
      this.setState({userPref: newPref});

      let message = str1.concat(this.props.exploreType,'!');
      this.setState({
        updateMsg: message,
        openDeclarePopup: false,
        snackopen: true
      });
    }

    handleAlreadyMsg() {
      this.setState({
        updateMsg: 'Already Declared! To undeclare, you must go to your Profile.',
        snackopen: true
      });
    }

    handleBack() {
      this.props.backFunction();
    }

    handleSkillsPopup(skillname) {
      let liked = false;
      for (let key in this.props.userInfo.Asset) {
        if (skillname === key) { liked = true; }
      }

      this.setState({
        selectedSkill: skillname,
        openSkillsPopup: true,
        assetLike: liked
      });
    }

    _handleSkillDialogCancel() {
      this.setState({
        openSkillsPopup: false
      });
    }

    _handleSkillLike() {
      if (!this.state.assetLike) {
        let newAssets = this.props.userInfo.Asset;
        newAssets[this.state.selectedSkill] = true;
        base.post('users/' + authData.uid + '/Asset', {
          data: newAssets,
          then() {
            this.setState({
              assetLike: true,
              openSkillsPopup: false,
              updateMsg: 'Skill Added!',
              snackopen: true
            });
          }
        });
      }
    }

    _handleRequestClose(buttonClicked) {
      if (!buttonClicked) return;
      this.setState({
        openSkillsPopup: false,
        openPlanPopup: false
      });
    }

    handleSnackClose() {
      this.setState({
        fullsnackopen: false,
        snackopen: false });
    }
}

ExplorerDescription.propTypes = {
  userInfo: PropTypes.object,
  selecteditem: PropTypes.string,
  exploreType: PropTypes.string,
  backFunction: PropTypes.func,
  selectedObj: PropTypes.object
};
