//require('styles/pages/Explorerwithnav.sass');

import React, { Component, PropTypes } from 'react';
import Firebase from 'firebase';
import Rebase from 're-base';

import { Checkbox, CircularProgress, Divider, DropDownMenu, FontIcon, FloatingActionButton, IconButton, List, ListItem, MenuItem, Styles } from 'material-ui';
let { Spacing, Colors } = Styles;

import ExplorerListFilter from '../components/ExplorerListFilter';
//import ExplorerDescription from './ExplorerDescription.js';

var base = new Rebase.createClass('https://sageview.firebaseio.com');
var authData = base.getAuth();

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
    this.handleFetchItems = this.handleFetchItems.bind(this);
    this.state = {
      selecteditem: '',
      selectedPref: {},
      exploreType: '',
      querySwitch: '',
      likeShow: true,
      neutralShow: true,
      dislikeShow: true,
      showDescPage: false,
      userInfo: null,
      currentList: null
    };
  }

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
        minHeight: '800px'
      }
    };
    return styles;
  }

  render() {
    let styles = this.getStyles();

    //Part I - Check if exploreType = Careers is an option (disable button?)
    let careerAllow = false;

    if (this.state.userInfo.Industry && this.state.userInfo.Focus) {
      let industryCheck = false;
      let focusCheck = false;
      for (var key in this.state.userInfo.Industry) {
        if (!this.state.userInfo.Industry.hasOwnProperty(key)) { continue; }
        if (this.state.userInfo.Industry[key].likeStatus === true) {
          industryCheck = true;
          break;
        }
      }

      for (var key in this.state.userInfo.Focus) {
        if (!this.state.userInfo.Focus.hasOwnProperty(key)) { continue; }
        if (this.state.userInfo.Focus[key].likeStatus === true) {
          focusCheck = true;
          break;
        }
      }

      if (industryCheck && focusCheck || this.state.exploreType === 'Path') { careerAllow = true; }
    }

    //Part II - Populate with ListItem Components
    let listitems= [];

    let lookup = this.state.exploreType;
    let pathSignal = false;

    if (this.state.currentList) {
      //Start Level 1 unbundle
      for (var key1 in this.state.currentList) {
        let lvl2items=[];

        //Start Level 2 unbundle
        for (var key2 in this.state.currentList[key1].level2) {
          let lvl2Switch = null;
          let filterResult2;
          let userPrefObject2;
          let lvl2Icon;
          let lvl3items=[];

          //Use Level 3 to determine render for Level 2 (if Path/Industry)
          if (lookup === 'Path' || lookup === 'Industry') {
            let totalPref3 = 1;
            //Start Level 3 unbundle
            for (var key3 in this.state.currentList[key1][key2]) {
              //Apply filter
              let filterResult3 = (
                <ExplorerListFilter
                  exploreType={lookup}
                  filtertarget={key3}
                  targetIndustries={this.state.currentList[key1][key2].Industries}
                  likeShow={this.state.likeShow}
                  neutralShow={this.state.neutralShow}
                  dislikeShow={this.state.dislikeShow}
                   />
               );

              //Unbundle if passes filter
              if (filterResult3) {
                pathSignal = true;

                let lvl3Switch = null;
                let userPrefObject3;
                let lvl3Icon;

                for (var keyU in this.state.userInfo[lookup]) {
                  if (!this.state.userInfo[lookup].hasOwnProperty(keyU)) { continue; }
                  if (key3 === keyU) {
                    userPrefObject3 = this.state.userInfo[lookup][keyU];
                    if (this.state.userInfo[lookup][keyU].likeStatus === true) {
                      lvl3Switch = true;
                      lvl2Switch = lvl2Switch + 1;
                      break;
                    } else {
                      lvl3Switch = false;
                      lvl2Switch = lvl2Switch - 1;
                      break;
                    }
                  }
                }

                if (lvl3Switch) {
                  lvl3Icon=<FontIcon className="material-icons" color={Colors.blue500}>star</FontIcon>;
                } else if (!lvl3Switch) {
                  lvl3Icon=<FontIcon className="material-icons" color={Colors.red500}>block</FontIcon>;
                }

                lvl3items.push(
                  <ListItem
                    primaryText={key3}
                    style={this.state.selecteditem === key3 ? {color: Colors.pink500} : null}
                    leftIcon={lvl3Icon}
                    onTouchTap={this.onListItemClick.bind(null, key3, userPrefObject3)} />
                );
              }
            }
            //End Level 3 unbundle

            if (lvl3items.length > 0) {
              filterResult2 = true;
              if (totalPref3 === lvl3items.length) { lvl2Switch = true }
              else if ((-1*totalPref3) === lvl3items.length) { lvl2Switch = false }

            } else { filterResult2 = false; }

            //Skip Level 3 and determine render for Level 2 with Focus preferences
          } else if (lookup === 'Focus') {
            filterResult2 = (
              <ExplorerListFilter
                exploreType={lookup}
                filtertarget={key2}
                likeShow={this.state.likeShow}
                neutralShow={this.state.neutralShow}
                dislikeShow={this.state.dislikeShow}
                 />
             );

             if (filterResult2) {
               for (var keyU in this.state.userInfo[lookup]) {
                 if (!this.state.userInfo[lookup].hasOwnProperty(keyU)) { continue; }
                 if (key2 === keyU) {
                   userPrefObject2 = this.state.userInfo[lookup][keyU];
                   if (this.state.userInfo[lookup][keyU].likeStatus === true) {
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

          if (filterResult2) {
            if (lvl2Switch) {
              lvl2Icon=<FontIcon className="material-icons" color={Colors.blue500}>star</FontIcon>;
            } else if (!lvl2Switch) {
              lvl2Icon=<FontIcon className="material-icons" color={Colors.red500}>block</FontIcon>;
            }

            lvl2items.push(
              <ListItem
                primaryText={key2}
                style={this.state.selecteditem === key2 ? {color: Colors.pink500} : null}
                leftIcon={lvl2Icon}
                onTouchTap={this.onListItemClick.bind(null, key2, userPrefObject2)}
                nestedItems={lvl3items} />
            );
          }
        }
        //End Level 2 unbundle

        listitems.push(
          <ListItem
            primaryText={key1}
            disabled={true}
            style={this.state.selecteditem === key1 ? {color: Colors.pink500} : null}
            nestedItems={lvl2items} />
        );
      }
      //End Level 1 unbundle
      //Loading screen if list is loading
    } else if (lookup === 'Path' && pathSignal) {
      listitems =
        <div>
          <p>Unfortunately, we haven't been able to analyze this combination yet =(</p>
          <p>We'll notify you once these paths become available.</p>
          <p>Meahwile, please try another combination.</p>
        </div>
    } else {
      listitems = <CircularProgress mode="indeterminate" value={60} size={1.5} />;
    }

    let itemDescription;

    //Just pass the entire item object instead of its pieces! (See "Description" page for processor)
    if (this.state.showDescPage) {
      itemDescription =
        <ExplorerDescription
        selecteditem={this.state.selecteditem}
        exploreType={this.state.exploreType}
        backFunction={this.handleDescPageExit} />
    }

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
          </List>
          <Divider />
          <List subheader="Show me my...">
            <div className='checkboxWrap'>
              <Checkbox
                label="Likes"
                defaultChecked={true}
                onTouchTap={this.handleLikeCheck} />
            </div>
            <div className='checkboxWrap'>
              <Checkbox
                label="Neutrals"
                defaultChecked={true}
                onTouchTap={this.handleNeutralCheck} />
            </div>
            <div className='checkboxWrap'>
              <Checkbox
                label="Dislikes"
                defaultChecked={true}
                onTouchTap={this.handleDislikeCheck} />
            </div>
          </List>
          <Divider />
          <div id='explorerScrollablePart'>
            <List subheader={'Explore '&this.state.exploreType&'s'}>
              {listitems}
            </List>
          </div>
        </div>
      </div>
    );
  }

  onListItemClick(name, pref) {
    this.setState({
      selecteditem: name,
      selectedPref: pref,
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
    this.handleFetchItems();
    setTimeout(function(){
      this.setState({querySwitch: 'selecting focus'});
    }.bind(this),300);
  }

  handleCareerExp() {
    this.setState({
      exploreType: 'Path',
      showDescPage: false
    });
    this.handleFetchItems();
    setTimeout(function(){
      this.setState({querySwitch: 'selecting paths'});
    }.bind(this),300);
  }

  handleFetchItems() {
    let ListEndPt;
    if (this.state.exploreType === 'Industry') {
      ListEndPt = 'Industry';
    } else if (this.state.exploreType === 'Focus' || this.state.exploreType === 'Path') {
      ListEndPt = 'Path';
    }
    base.fetch(ListEndPt, {
      context: this,
      then(data) {
        this.setState({currentList: data});
      }
    })
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
}
