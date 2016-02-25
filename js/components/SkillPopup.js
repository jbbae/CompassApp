//require('styles/components/SkillPopup.sass');

import React, {Component, PropTypes} from 'react';
import Firebase from 'firebase';
import Rebase from 're-base';

import { Tab, Tabs } from 'material-ui';

import BuildingPage from './BuildingPage';

var base = new Rebase.createClass('https://sageview.firebaseio.com/');
var authData = base.getAuth();

export default class SkillPopup extends Component {
  render() {
    let description = [];
    let assType;
    let assLevel;

    base.fetch('Asset/'+this.props.selectedSkill, {
      context: this,
      then(data) {
        assType = data.Type;
        for (let key in data.Description) {
          description.push(data.Description[key]);
        }
      }
    });

    if(authData) {
      base.fetch(authData.uid + '/Assets', {
        context: this,
        then(data) {
          for (let key in data) {
            if (this.props.selectedSkill === key) {
              assLevel = data[key];
            }
          }
        }
      });
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
            <BuildingPage />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

SkillPopup.propTypes = {
    selectedSkill: PropTypes.string
}
