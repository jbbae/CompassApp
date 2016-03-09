//require('styles/components/SkillPopup.sass');

import React, {Component, PropTypes} from 'react';
import Firebase from 'firebase';
import Rebase from 're-base';

import { Tab, Tabs } from 'material-ui';

import BuildingPage from './BuildingPage';

var base = new Rebase.createClass('https://sageview.firebaseio.com/');
var authData = base.getAuth();

export default class SkillPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skillObj: {}
    };
  }

  componentDidMount() {
    this.ref = base.bindToState('Asset/' + this.props.selectedSkill, {
      context: this,
      state: 'skillObj'
    });
  }

  render() {
    let description = [];
    let assType;
    let assLevel;

    assType = this.state.skillObj.type;
    for (let key in this.state.skillObj.description) {
      description.push(this.state.skillObj.description[key]);
    }

    if(this.props.userInfo) {
      for (let key in this.props.userInfo.Asset) {
        if (this.props.selectedSkill === key) {
          assLevel = this.props.userInfo.Asset[key];
        }
      }
    }

    return (
      <div style={{height: '500px'}}>
        <div className="Header">
          <div className="Headerdetails">
            <p>Skill Level: None</p>
            <p>Skill Type: {assType}</p>
          </div>
        </div>
        <Tabs>
          <Tab label="Description">
            {description}
          </Tab>
          <Tab label="How to Improve">
            <BuildingPage userInfo={this.props.userInfo ? this.props.userInfo : null} />
          </Tab>
        </Tabs>
      </div>
    );
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }
}

SkillPopup.propTypes = {
  selectedSkill: PropTypes.string,
  userInfo: PropTypes.object
}
