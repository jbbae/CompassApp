//require('styles/pages/Explorerwithnav.sass');

import React, { Component, PropTypes } from 'react';
import Firebase from 'firebase';
import Rebase from 're-base';

import { Checkbox, CircularProgress, Divider, DropDownMenu, FontIcon, FloatingActionButton, IconButton, List, ListItem, MenuItem, Snackbar, Styles } from 'material-ui';
let { Spacing, Colors } = Styles;

import ExplorerListFilter from '../components/ExplorerListFilter';
import ExplorerDescription from './ExplorerDescription.js';

var base = new Rebase.createClass('https://sageview.firebaseio.com');

export default class ExplorerWithNav extends Component {
  //Note: querySwitch is only a placeholder to refresh queries
  constructor() {
    super();
    this.onListItemClick = this.onListItemClick.bind(this);
    this.handleDropChange = this.handleDropChange.bind(this);
    this.handleCareerExp = this.handleCareerExp.bind(this);
    this.handleLikeCheck = this.handleLikeCheck.bind(this);
    this.handleNeutralCheck = this.handleNeutralCheck.bind(this);
    this.handleDislikeCheck = this.handleDislikeCheck.bind(this);
    this.handleDescPageExit = this.handleDescPageExit.bind(this);
    this.handleSnackClose = this.handleSnackClose.bind(this);
    this.handleNeedLogin = this.handleNeedLogin.bind(this);
    this.state = {
      selecteditem: '',
      selectedObj: {},
      exploreType: '',
      querySwitch: '',
      likeShow: true,
      neutralShow: true,
      dislikeShow: true,
      showDescPage: false,
      industryList: {},
      pathList: {},
      snackopen: false,
      updateMsg: ''
    };
  }

  componentDidMount() {
    base.fetch('Industry', {
      context: this,
      then(data) {
        this.setState({industryList: data});
      }
    });

    base.fetch('Path', {
      context: this,
      then(data) {
        this.setState({pathList: data});
      }
    });
  }

  getStyles() {
    let subNavWidth = Spacing.desktopKeylineIncrement * 5 + 'px';
    let styles = {
      rootWhenMedium: {
        paddingTop: Spacing.desktopKeylineIncrement + 'px',
        position: 'relative'
      },
      secondaryNavWhenMedium: {
        borderTop: 'none',
        overflow: 'hidden',
        position: 'absolute',
        top: '64px',
        width: subNavWidth
      },
      contentWhenMedium: {
        boxSizing: 'border-box',
        padding: Spacing.desktopGutter + 'px',
        maxWidth: (Spacing.desktopKeylineIncrement * 25 ) + 'px',
        marginLeft: subNavWidth,
        borderLeft: 'solid 1px ' + Colors.grey300,
        minHeight: '700px',
        maxHeight: '700px'
      }
    };
    return styles;
  }

  listFilterAnalysis(filtertarget, targetIndustries) {
    let userPrefSwitch = true;

    if ( !this.state.likeShow || !this.state.neutralShow || !this.state.dislikeShow ) {
      if ( this.state.likeShow && this.state.neutralShow && !this.state.dislikeShow ) {
        for (var key in this.props.userInfo[this.state.exploreType]) {
          if (!this.props.userInfo[this.state.exploreType][key].likeStatus && filtertarget === key) {
            userPrefSwitch = false;
            break;
          }
        }

      } else if ( this.state.likeShow && !this.state.neutralShow && this.state.dislikeShow ) {
        userPrefSwitch = false;
        for (var key in this.props.userInfo[this.state.exploreType]) {
          if (filtertarget === key) {
            userPrefSwitch = true;
            break;
          }
        }

      } else if ( !this.state.likeShow && this.state.neutralShow && this.state.dislikeShow ) {
        for (var key in this.props.userInfo[this.state.exploreType]) {
          if (this.props.userInfo[this.state.exploreType][key].likeStatus && filtertarget === key) {
            userPrefSwitch = false;
            break;
          }
        }

      } else if ( this.state.likeShow && !this.state.neutralShow && !this.state.dislikeShow ) {
        userPrefSwitch = false;
        for (var key in this.props.userInfo[this.state.exploreType]) {
          if (this.props.userInfo[this.state.exploreType][key].likeStatus && filtertarget === key) {
            userPrefSwitch = true;
            break;
          }
        }

      } else if ( !this.state.likeShow && this.state.neutralShow && !this.state.dislikeShow ) {
        for (var key in this.props.userInfo[this.state.exploreType]) {
          if (filtertarget === key) {
            userPrefSwitch = false;
            break;
          }
        }

      } else if ( !this.state.likeShow && !this.state.neutralShow && this.state.dislikeShow ) {
        userPrefSwitch = false;
        for (var key in this.props.userInfo[this.state.exploreType]) {
          if (!this.props.userInfo[this.state.exploreType][key].likeStatus && filtertarget === key) {
            userPrefSwitch = true;
            break;
          }
        }
      }
    }

    if (this.state.exploreType === 'Path') {
      let crossSwitch = false;

      for (var key1 in targetIndustries) {
        for (var key2 in this.props.userInfo.Industry) {
          if ( key1 === key2 && this.props.userInfo.Industry[key2].likeStatus ) {
            crossSwitch = true;
            break;
          }
        }
        if (crossSwitch) { break; }
      }
      if (!crossSwitch) {
        userPrefSwitch = false;
      }
    }

    return userPrefSwitch;
  }

  render() {
    let styles = this.getStyles();

    //Part I - Check if exploreType = Careers is an option (disable button?)
    let careerAllow = false;
    if (this.props.userInfo) {
      if (this.props.userInfo.Industry && this.props.userInfo.Focus) {
        let industryCheck = false;
        let focusCheck = false;
        for (var key in this.props.userInfo.Industry) {
          if (!this.props.userInfo.Industry.hasOwnProperty(key)) { continue; }
          if (this.props.userInfo.Industry[key].likeStatus === true) {
            industryCheck = true;
            break;
          }
        }

        for (var key2 in this.props.userInfo.Focus) {
          if (!this.props.userInfo.Focus.hasOwnProperty(key2)) { continue; }
          if (this.props.userInfo.Focus[key2].likeStatus === true) {
            focusCheck = true;
            break;
          }
        }

        if ((industryCheck && focusCheck) || this.state.exploreType === 'Path') { careerAllow = true; }
      }
    }

    //Part II - Populate with ListItem Components
    let listitems= [];

    let lookup = this.state.exploreType;
    let pathSignal = false;

    let currentList = null;
    if (this.state.exploreType === 'Industry') { currentList = this.state.industryList; }
    else if (this.state.exploreType === 'Path' || this.state.exploreType === 'Focus' ) { currentList = this.state.pathList; }

    if (currentList) {
      //Start Level 1 unbundle
      for (var key1 in currentList) {
        let lvl2items=[];

        //Start Level 2 unbundle
        for (var key2 in currentList[key1].level2) {
          let lvl2Switch = null;
          let filterResult2;
          let listObject2;
          let lvl2Icon;
          let lvl3items=[];

          if (lookup === 'Focus') {
            listObject2 = currentList[key1].level2[key2];
          }

          //Use Level 3 to determine render for Level 2 (if Path/Industry)
          if (lookup === 'Path' || lookup === 'Industry') {
            let totalPref3 = 0;
            //Start Level 3 unbundle
            for (var key3 in currentList[key1].level2[key2].level3) {
              //Apply filter
              let filterResult3 = this.listFilterAnalysis(key3, currentList[key1].level2[key2].level3[key3].crossIndustry);

              //Unbundle if passes filter
              if (filterResult3) {
                pathSignal = true;

                let lvl3Switch = null;
                let listObject3 = currentList[key1].level2[key2].level3[key3];
                let lvl3Icon;

                if (this.props.userInfo) {
                  for (var keyU in this.props.userInfo[lookup]) {
                    if (!this.props.userInfo[lookup].hasOwnProperty(keyU)) { continue; }
                    if (key3 === keyU) {
                      if (this.props.userInfo[lookup][keyU].likeStatus === true) {
                        lvl3Switch = true;
                        totalPref3 = totalPref3 + 1;
                        break;
                      } else {
                        lvl3Switch = false;
                        totalPref3 = totalPref3 - 1;
                        break;
                      }
                    }
                  }
                }

                if (lvl3Switch) {
                  lvl3Icon=<FontIcon className="material-icons" color={Colors.blue500}>star</FontIcon>;
                } else if (lvl3Switch === false) {
                  lvl3Icon=<FontIcon className="material-icons" color={Colors.red500}>block</FontIcon>;
                }

                lvl3items.push(
                  <ListItem
                    primaryText={key3}
                    style={this.state.selecteditem === key3 ? {color: Colors.pink500} : null}
                    leftIcon={lvl3Icon}
                    onTouchTap={this.onListItemClick.bind(null, key3, listObject3)} />
                );
              }
            }
            //End Level 3 unbundle

            if (lvl3items.length > 0) {
              filterResult2 = true;
              if (totalPref3 === lvl3items.length) { lvl2Switch = true }
              else if ((-1*totalPref3) === lvl3items.length) { lvl2Switch = false }

            }

            //Skip Level 3 and determine render for Level 2 with Focus preferences
          } else if (lookup === 'Focus') {
            filterResult2 = this.listFilterAnalysis(key2);

            if (this.props.userInfo) {
              if (filterResult2) {
                for (var keyU in this.props.userInfo[lookup]) {
                  if (!this.props.userInfo[lookup].hasOwnProperty(keyU)) { continue; }
                  if (key2 === keyU) {
                    if (this.props.userInfo[lookup][keyU].likeStatus === true) {
                     lvl2Switch = true;
                     break;
                    } else {
                     lvl2Switch = false;
                     break;
                    }
                  }
                }
              }
            }
          }

          if (filterResult2) {
            if (lvl2Switch) {
              lvl2Icon=<FontIcon className="material-icons" color={Colors.blue500}>star</FontIcon>;
            } else if (lvl2Switch === false) {
              lvl2Icon=<FontIcon className="material-icons" color={Colors.red500}>block</FontIcon>;
            }

            lvl2items.push(
              <ListItem
                primaryText={key2}
                disabled={this.state.exploreType === 'Focus'? false : true}
                style={this.state.selecteditem === key2 ? {color: Colors.pink500} : null}
                leftIcon={lvl2Icon}
                onTouchTap={this.onListItemClick.bind(null, key2, listObject2)}
                nestedItems={lvl3items} />
            );
          }
        }
        //End Level 2 unbundle

        if (lvl2items.length) {
          listitems.push(
            <ListItem
              primaryText={key1}
              disabled={true}
              style={this.state.selecteditem === key1 ? {color: Colors.pink500} : null}
              nestedItems={lvl2items} />
          );
        }
      }
      //End Level 1 unbundle
      //Loading screen if list is loading
    } else if (lookup === 'Path' && pathSignal) {
      listitems =
        <div>
          <p>Unfortunately, we haven't been able to analyze this combination yet...</p>
          <p>We'll notify you once these paths become available.</p>
          <p>Meahwile, please try another combination.</p>
        </div>
    } else {
      listitems = <div style={{height:'150px'}}><CircularProgress mode="indeterminate" value={60} size={1.5} /></div>;
    }

    let itemDescription;

    //Part III - Show the Description Page (while passing in props)
    if (this.state.showDescPage) {
      itemDescription =
        <div id='descriptionScrollable'>
          <ExplorerDescription
            userInfo={this.props.userInfo}
            selecteditem={this.state.selecteditem}
            exploreType={this.state.exploreType}
            backFunction={this.handleDescPageExit}
            selectedObj={this.state.selectedObj} />
        </div>;
    }

    // Part IV - ExploreType Career enable/disable
    let careerButton;
    if (careerAllow) {
      careerButton = (
        <FloatingActionButton disabled={careerAllow ? false : true } disabledColor={Colors.pink50} onTouchTap={this.handleCareerExp} mini={true}>
          <FontIcon className="material-icons" color={Colors.pink50}>explore</FontIcon>
        </FloatingActionButton>
      );
    } else {
      careerButton = (
        <IconButton tooltip='Choose Industry & Focus first!' disabled={true}>
          <FontIcon className="material-icons" color={Colors.pink50}>explore</FontIcon>
        </IconButton>
      );
    }

    //Part V - Return components
    return (
      <div style={styles.rootWhenMedium}>
        <div style={styles.contentWhenMedium}>
          {itemDescription}
        </div>
        <div style={styles.secondaryNavWhenMedium}>
          <List subheader="Exploring...">
            <table width='310px'>
              <td width='65%'>
                <div id ='pathDropCont'>
                  <DropDownMenu id='pathDrop' autoWidth={false} value={this.state.exploreType} onChange={this.handleDropChange}>
                    <MenuItem value='' primaryText='I want to explore...' />
                    <MenuItem value='Industry' primaryText='Industry' />
                    <MenuItem value='Focus' primaryText='Focus' />
                  </DropDownMenu>
                </div>
              </td>
              <td width='30%'>
                <div id ='pathButtonCont'>
                  <p id='pathButtonCap'>Show me paths!</p>
                  <div id='pathButtonDiv'>
                    <div id='exploreCareerButton'>
                    {careerButton}
                    </div>
                  </div>
                </div>
              </td>
            </table>
            <div className='checkboxWrap'>
              <Checkbox
                label="Likes"
                disabled={this.props.userInfo ? false : true}
                defaultChecked={true}
                onTouchTap={this.props.userInfo ? this.handleLikeCheck : this.handleNeedLogin} />
            </div>
            <div className='checkboxWrap'>
              <Checkbox
                label="Neutrals"
                disabled={this.props.userInfo ? false : true}
                defaultChecked={true}
                onTouchTap={this.props.userInfo ? this.handleNeutralCheck: this.handleNeedLogin} />
            </div>
            <div className='checkboxWrap'>
              <Checkbox
                label="Dislikes"
                disabled={this.props.userInfo ? false : true}
                defaultChecked={true}
                onTouchTap={this.props.userInfo ? this.handleDislikeCheck : this.handleNeedLogin} />
            </div>
          </List>
          <Divider />
          <div id='explorerScrollablePart'>
            <List subheader={this.state.exploreType ? 'Currently List: ' + this.state.exploreType : '' }>
              {listitems}
            </List>
          </div>
        </div>

        <Snackbar
          open={this.state.snackopen}
          message={this.state.updateMsg}
          autoHideDuration={1500}
          onRequestClose={this.handleSnackClose} />
      </div>
    );
  }

  onListItemClick(name, obj) {
    this.setState({
      selecteditem: name,
      selectedObj: obj,
      showDescPage: false
    });
    setTimeout(function(){
      this.setState({showDescPage: true});
    }.bind(this),200);
  }

  handleDropChange(e, index, value) {
    this.setState({
      exploreType: value,
      showDescPage: false
    });
  }

  handleCareerExp() {
    this.setState({
      exploreType: 'Path',
      showDescPage: false
    });
  }

  handleLikeCheck() {
    let checked = !this.state.likeShow
    this.setState({ likeShow: checked });
    setTimeout(function(){
      this.setState({querySwitch: 'like loading...'});
    }.bind(this),500);
  }

  handleNeutralCheck() {
    let checked = !this.state.neutralShow
    this.setState({ neutralShow: checked });
    setTimeout(function(){
      this.setState({querySwitch: 'neutral loading...'});
    }.bind(this),500);
  }

  handleDislikeCheck() {
    let checked = !this.state.dislikeShow
    this.setState({ dislikeShow: checked });
    setTimeout(function(){
      this.setState({querySwitch: 'dislike loading...'});
    }.bind(this),500);
  }

  handleDescPageExit() {
    this.setState({
      showDescPage: false,
      selecteditem: ''
    });
  }

  handleNeedLogin() {
    this.setState({
      updateMsg: 'You must be logged in to use this function!',
      snackopen: true
    })
  }

  handleSnackClose() {
    this.setState({ snackopen: false });
  }
}

ExplorerWithNav.propTypes = {
  userInfo: PropTypes.object
};
