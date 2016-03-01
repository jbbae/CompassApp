import React, {Component, PropTypes} from 'react';
import Firebase from 'firebase';
import Rebase from 're-base';

import { Dialog, FlatButton } from 'material-ui';

import VerifyUndeclare from './VerifyUndeclare';

var base = new Rebase.createClass('https://sageview.firebaseio.com');

export default class ProfileIndustryPop extends ParseComponent {
  constructor(props) {
    super(props);
    this._handleRequestClose = this._handleRequestClose.bind(this);
    this._handleVerifyCancel = this._handleVerifyCancel.bind(this);
    this._handleIndustryRemove = this._handleIndustryRemove.bind(this);

    this.state = {
      selectedSkill: ''
    };
  }

  componentDidMount() {
    this.ref = base.bindToState('Industry', {
      context: this,
      state: 'allIndustries'
    });
  }

  render() {
    let descContent;

    base.fetch('Industry', {
      context: this,
      then(data) {
        for (let key1 in data) {
          for (let key2 in data[key1].level2) {
            for (let key3 in data[key1].level2[key2].level3) {
              if (key3 === this.props.selectedindustry) {
                for (keyD in data[key1].level2[key2].level3[key3].description) {
                  descContent.push(<p>{paragraph}</p>);
                  break;
                }
              }
            }
          }
        }
      }
    });

    let verifyPopupButton = [
        <FlatButton
          label="Never mind!"
          onTouchTap={this._handleVerifyCancel} />,
        <FlatButton
          label="Undeclare"
          primary={true}
          onTouchTap={this._handleIndustryRemove} />
    ];

    return (
      <div style={{height: '350px'}}>
        <Dialog
          title='Undeclare Industry'
          actions={verifyPopupButton}
          autoDetectWindowHeight={true}
          open={this.props.openVerUndeclare}
          onRequestClose={this._handleRequestClose}>
          <VerifyUndeclare
            targetName={this.props.selectedindustry ? this.props.selectedindustry : ''}
            targetType='Industry' />
        </Dialog>
        {descContent}
      </div>
    );
  }

  _handleVerifyCancel() {
    this.props.cancelfunction();
  }

  _handleIndustryRemove() {
    this.props.vpUndeclareFunction();
  }

  _handleRequestClose(buttonClicked) {
    if (!buttonClicked) return;
    this.setState({
      openSkillsPopup: false,
      openPlanPopup: false,
      openProfileIndPop: false
    });
  }
}

ProfileIndustryPop.propTypes = {
  selectedindustry: PropTypes.string,
  cancelfunction: PropTypes.func,
  vpUndeclareFunction: PropTypes.func,
  openVerUndeclare: PropTypes.bool
};
