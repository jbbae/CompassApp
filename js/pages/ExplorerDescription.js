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

let userLike = null;

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
      selectedDescription: '',
      openSkillsPopup: false,
      openDeclarePopup: false,
      assetLike: false,
      selectedAssObj: null
    })
  }

  observe() {
    var selectedType = this.props.exploreType;
    let crossQuery = new Parse.Query('assetCross').include('asset');
    if (selectedType !== 'Industry') {
      crossQuery.equalTo('crossType',selectedType);
    }
    return {
      assetCross: crossQuery,
      descList: new Parse.Query('Descriptions').equalTo('parent',this.props.selecteditem),
      userList: new Parse.Query('userPref').equalTo('type',selectedType),
      userAssetList: new Parse.Query('userAssets')
    };
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
      //Input the userList object into a global variable + Count the # of Declared while at it.
      let declareCount = 0;
      if (this.data.userList.length) {
        for (let w=0; w < this.data.userList.length; w++) {
          if (this.data.userList[w].name === this.props.selecteditem) {
            userLike = this.data.userList[w];
          }
          if (this.data.userList[w].userTied) {
            declareCount++;
          }
        }
      } else {
        userLike = null;
      }

      let styles = this.getStyles();

      //Prepare the likeDropDown and declareButton accordingly
      let likeDropDown;
      let declareButton;
      if (this.pendingQueries().length) {
        likeDropDown = <CircularProgress mode="indeterminate" value={60} size={0.5} />;
      } else {
        if (!this.props.childIndicate) {
          likeDropDown = (
            <DropDownMenu value={userLike ? userLike.likeStatus : null} onChange={Parse.User.current() ? this.handleFavorite : this.handleNeedLogin}>
              <MenuItem value={null} primaryText='Not Sure...' />
              <MenuItem value={true} primaryText='Like!' />
              <MenuItem value={false} primaryText='Nope!' />
            </DropDownMenu>
          );
        }
        if (userLike !== null && !this.props.childIndicate) {
          if (userLike.likeStatus === true && userLike.userTied === false) {
            declareButton = <RaisedButton label="Make Primary!" secondary={true} onTouchTap={this.handleDeclare.bind(null, declareCount)} />;
          } else if (userLike.likeStatus === true && userLike.userTied === true) {
            declareButton = <RaisedButton label="Already Primary" onTouchTap={this.handleAlreadyMsg} />;
          }
        }
      }

      //Section 1 Items
      let overview = [];
      let IFbullets1 = [];
      let IFbullets2 = [];
      let Pbullets = [];
      let workEnvDesc = [];

      //Section 2 Items
      let howToBDesc = [];
      let licensesDesc = [];

      //Section 3 Items
      let jobOutDesc = [];
      let jobProsp = [];

      //Unbundle Descriptions
      for (let j = 0; j < this.data.descList.length; j++) {
        if (this.data.descList[j].parent === this.props.selecteditem && this.data.descList[j].type === this.props.exploreType ) {
          if (this.data.descList[j].section === "Overview") {
            overview = this.data.descList[j].content;
          } else if (this.data.descList[j].section === 'Concentrations' || this.data.descList[j].section === 'Products & Services') {
            for (let b=0; b < this.data.descList[j].content.length; b++) {
              if (this.data.descList[j].content[b].parent === null) {
                IFbullets1.push(this.data.descList[j].content[b]);
              } else {
                IFbullets2.push(this.data.descList[j].content[b]);
              }
            }
          } else if (this.data.descList[j].section === 'Duties') {
            Pbullets = this.data.descList[j].content;
          } else if (this.data.descList[j].section === 'Work Environment') {
            workEnvDesc = this.data.descList[j].content;
          } else if (this.data.descList[j].section === 'How to Become') {
            howToBDesc = this.data.descList[j].content;
          } else if (this.data.descList[j].section === 'Licenses') {
            licensesDesc = this.data.descList[j].content;
          } else if (this.data.descList[j].section === 'Job Outlook') {
            jobOutDesc = this.data.descList[j].content;
          } else if (this.data.descList[j].section === 'Job Prospects') {
            jobProsp = this.data.descList[j].content;
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
      let assets;

      if (this.props.exploreType !== 'Industry') {
        assets = this.data.assetCross.map(function(crossHolder) {
          if (crossHolder.crossName === this.props.selecteditem) {
            return (
              <Paper
                className="skillBlock"
                zDepth={2}
                onTouchTap={this.handleSkillsPopup.bind(null, crossHolder.asset.name, 'Javascript is a Lang', crossHolder.asset)}>
                {crossHolder.asset.name}
              </Paper>
            );
          }
        }, this);
      }

      //Structure Overview content to render in as object
      let tabOneContent;
      let tabOneOverview = overview.map(function(description) {
        return (
            <p>{description}</p>
        );
      }, this);

      //Structurer for Concentrations/P&S (for Focus & Industry) VS Duties + Work Env (Paths)
      let tabOneBullets = [];
      let tabOneWorkEnv = [];
      if (this.props.exploreType !== 'Paths') {
        tabOneBullets = IFbullets1.map(function(lvlOneBullet) {
          let lvlTwoBullets = [];
          for (let t=0; t < IFbullets2.length; t++) {
            if (lvlOneBullet.content === IFbullets2[t].parent) {
              lvlTwoBullets.push(<li>{IFbullets2[t].content}</li>);
            }
          }
          return (
            <li>{lvlOneBullet.content}
              <ul>{lvlTwoBullets.length > 0 ? lvlTwoBullets : null }</ul>
            </li>
          );
        }, this);

        let tabOneBulletHeading;

        if (this.props.exploreType === 'Industry') {
          tabOneBulletHeading = <h3>Products & Services</h3>;
        } else if (this.props.exploreType === 'Focus') {
          tabOneBulletHeading = <h3>Concentrations</h3>;
        }

        tabOneContent =
          <div className="tabcontent">
            {tabOneOverview.length > 0 ? tabOneOverview : null}
            {tabOneBullets.length > 0 ? tabOneBulletHeading : null}
            <div className='bulletAligner'>
              {tabOneBullets.length > 0 ? tabOneBullets : null}
            </div>
          </div>;
      } else if (this.props.exploreType === 'Paths') {
        tabOneBullets = Pbullets.map(function(bullet) {
          return (<li>{bullet}</li>);
        }, this);
        tabOneWorkEnv = workEnvDesc.map(function(parg) {
          return (<p>{parg}</p>);
        }, this);

        tabOneContent =
          <div className="tabcontent">
            {tabOneOverview.length > 0 ? tabOneOverview : null}
            {tabOneBullets.length > 0 ? <h3>Duties</h3> : null}
            {tabOneBullets.length > 0 ? tabOneBullets : null}
            {tabOneWorkEnv.length > 0 ? <h3>Work Environment</h3> : null}
            {tabOneWorkEnv.length > 0 ? tabOneWorkEnv : null}
          </div>;
      }

      let tabTwoContent;
      let labeltwo;
      let tabThreeContent;
      let tabComponents;

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

      else if (this.props.exploreType === 'Focus') {
        labeltwo = 'Skills';

        tabTwoContent =
          <div className="tabcontent">
            {assets.length > 0 ? assets : null}
          </div>;
        tabThreeContent = null;
      }

      else if (this.props.exploreType === 'Paths') {
        labeltwo = 'How to Become';

        let tabTwoPartA = howToBDesc.map(function(howToD) {
          return (
              <p>{howToD}</p>
          );
        }, this);

        let tabTwoPartB = licensesDesc.map(function(licensesD) {
          return (
              <p>{licensesD}</p>
          );
        }, this);

        tabTwoContent =
          <div className="tabcontent">
            {tabTwoPartA.length > 0 ? <h3>How to Become</h3> : null}
            {tabTwoPartA.length > 0 ? tabTwoPartA : null}
            {tabTwoPartB.length > 0 ? <h3>Licences & Certifications</h3> : null}
            {tabTwoPartB.length > 0 ? tabTwoPartB : null}
            <RequiredIFDisplay selecteditem={this.props.selecteditem} />
            {assets.length > 0 ? <h3>Skills</h3> : null}
            <Divider />
            {assets}
          </div>;

          let tabThreePartA = jobOutDesc.map(function(outlookD) {
            return (
              <p>{outlookD}</p>
            );
          }, this);

          let tabThreePartB = jobProsp.map(function(prospD) {
            return (
              <p>{prospD}</p>
            );
          }, this);

          tabThreeContent =
            <Tab label="Job Prospects">
              <h3>Job Outlook</h3>
              {tabThreePartA.length > 0 ? tabThreePartA : null}
              {tabThreePartB.length > 0 ? <h3>Job Prospects</h3> : null}
              {tabThreePartB.length > 0 ? tabThreePartB : null}
              {tabThreePartA.length + tabThreePartB.length === 0 ? <EmptyContent /> : null}
            </Tab>
      }

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
      } else if (this.props.exploreType === 'Paths') {
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
                description= {this.state.selectedDescription} />
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
      //let msgFeed;
      if (value === null && userLike != null) {
        ParseReact.Mutation.Destroy(userLike).dispatch();
        userLike = null;
        this.setState({
          updateMsg: 'You no longer like/dislike this category!',
          snackopen: true
        });
      } else if (value != null && userLike === null) {
        let acl = new Parse.ACL(Parse.User.current());
        ParseReact.Mutation.Create('userPref', {
          name: this.props.selecteditem,
          type: this.props.exploreType,
          likeStatus: value,
          userTied: false,
          ACL: acl
        }).dispatch();
        this.setState({
          updateMsg: 'Added to your preferences!',
          snackopen: true
        });
      } else if (value != null && userLike != null) {
        ParseReact.Mutation.Set(userLike, { likeStatus: value }).dispatch();
        this.setState({
          updateMsg: 'Preferences changed!',
          snackopen: true
        });
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
        else if (this.props.exploreType === 'Paths') { message2 = 'Career Paths' }
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
      ParseReact.Mutation.Set(userLike, { userTied: true }).dispatch();
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

    handleSkillsPopup(skillname, skilldesc, assetobj) {
      let liked = false;
      for (let s=0; s < this.data.userAssetList.length; s++) {
        if (skillname === this.data.userAssetList[s].name) {
          liked = true;
        }
      }

      this.setState({
        selectedSkill: skillname,
        selectedDescription: skilldesc,
        openSkillsPopup: true,
        assetLike: liked,
        selectedAssObj: assetobj
      });
    }

    _handleSkillDialogCancel() {
      this.setState({
        openSkillsPopup: false
      });
    }

    _handleSkillLike() {
      if (!this.state.assetLike) {
        let acl = new Parse.ACL(Parse.User.current());
        ParseReact.Mutation.Create('userAssets', {
          name: this.state.selectedSkill,
          asset: this.state.selectedAssObj,
          level: 0,
          ACL: acl
        }).dispatch();
        this.setState({
          assetLike: true,
          openSkillsPopup: false,
          updateMsg: 'Skill Added!',
          snackopen: true
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
  selecteditem: PropTypes.string,
  exploreType: PropTypes.string,
  backFunction: PropTypes.func
};
