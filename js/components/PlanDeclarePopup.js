import React, {Component, PropTypes} from 'react';
import Firebase from 'firebase';
import Rebase from 're-base';

import {RaisedButton, FontIcon, Styles} from 'material-ui';
let { Colors, Spacing, Typography } = Styles;

var base = new Rebase.createClass('https://sageview.firebaseio.com');
var authData = base.getAuth();

export default class PlanDeclarePopup extends Component {
  constructor() {
    super();
    this.handleDeclareSignal = this.handleDeclareSignal.bind(this);
    this.handleDeclareSignalIF = this.handleDeclareSignalIF.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  render() {
    let renderPage;

    if (this.props.exploreType === 'Path') {
      //Declare required focus/industry containers & switches to indicate validity of declaring.
      let requiredFocus = this.props.selectedObj.crossFocus;
      let industryArray = [];
      let focusSwitch = false;
      let industrySwitch = false;

      //Scan through "crossList" to (1) unpack required focus & industries into arrays, and (2) check if user declared any of these, note via switches
      for (let key in this.props.userInfo.Focus) {
        if (key === this.props.selectedObj.crossFocus && this.props.userInfo.Focus[key].userTied === true) { focusSwitch = true; }
      }

      for (let key in this.props.selectedObj.crossIndustry) {
        let industryDeclared = false;
        for (let key2 in this.props.userInfo.Industry) {
          if (key === key2 && this.props.userInfo.Industry[key2].userTied === true) {
            industrySwitch = true;
            industryDeclared = true;
            break;
          }
        }
        industryArray.push(
          <div>
            <span style={ industryDeclared ? {color: Colors.cyan500} : null}>{key}</span>
            {industryDeclared ? <FontIcon style={{display: 'inline-block', margin: '2px'}} className="material-icons" color={Colors.cyan500}>done</FontIcon> : null}
          </div>
        );
      }

      if (focusSwitch && industrySwitch) {
        //Render declaring page content into variable
        renderPage = (
          <div className='planDecPopupDiv'>
            <h3 className='popupH3'>This would make &quot;{this.props.selecteditem}&quot; one of your target Careers.</h3>
            <p className='popupP'>Would you like to proceed?</p>
            <div className='planDecbutton'>
              <RaisedButton
                label="Never mind"
                onTouchTap={this.handleClose} />
            </div>
            <div className='planDecbutton'>
              <RaisedButton
                label="Add to my Career Plans!"
                primary={true}
                onTouchTap={this.handleDeclareSignal} />
            </div>
          </div>
        );
      } else {
        renderPage = (
          <div className='planDecPopupDiv'>
            <h3 className='popupH3'>Required Focus/Industry missing</h3>
            <p className='popupP'>You need to first declare the required Focus and Industry to declare this path!</p>
            <div style={{display: 'inline-block'}}><p>Required Focus: <span style={ focusSwitch ? {color: Colors.cyan500} : null}>{requiredFocus}</span></p></div>
            {focusSwitch ? <FontIcon style={{display: 'inline-block', margin: '2px'}} className="material-icons" color={Colors.cyan500}>done</FontIcon> : null}
            <p>Required Industries:</p>
            {industryArray}
            <div className='planDecbutton'>
              <RaisedButton
                label="Got it!"
                onTouchTap={this.handleClose} />
            </div>
          </div>
        )
      }
    } else if (this.props.exploreType === 'Focus' || this.props.exploreType === 'Industry') {
      //Render declaring page content into variable
      renderPage = (
        <div className='planDecPopupDiv'>
          <h3 className='popupH3'>This would make &quot;{this.props.selecteditem}&quot; one of your declared {this.props.exploreType}.</h3>
          <p className='popupP'>Would you like to proceed?</p>
          <div className='planDecbutton'>
            <RaisedButton
              label="Never mind"
              onTouchTap={this.handleClose} />
          </div>
          <div className='planDecbutton'>
            <RaisedButton
              label="Add to my Profile!"
              primary={true}
              onTouchTap={this.handleDeclareSignalIF} />
          </div>
        </div>
      );
    }

    return (
      <div>
        {renderPage}
      </div>
      );
  }

  //Appends information into "CareerPlans" Class, and also calls the 'declarefunction' function, which closes popup & turns on userLike in the "userPref" Class
  handleDeclareSignal() {
    this.props.declarefunction();
  }

  handleDeclareSignalIF() {
    this.props.declarefunction();
  }

  //Handler for the close button
  handleClose() {
    this.props.closePopup();
  }
}

PlanDeclarePopup.propTypes = {
  selecteditem: PropTypes.string,
  selectedObj: PropTypes.object,
  exploreType: PropTypes.string,
  userInfo: PropTypes.object,
  declarefunction: PropTypes.func,
  closePopup: PropTypes.func
}
