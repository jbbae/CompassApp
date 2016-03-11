import React, {Component, PropTypes} from 'react';
//import { Popover, RaisedButton, Snackbar } from 'material-ui';

export default class VerifyUndeclare extends Component {
  render() {
    let pluralType;
    let message;

    if (this.props.targetType === 'Path') {
      pluralType = 'Paths';
    } else if (this.props.targetType === 'Focus') {
      pluralType = 'Foci';
    } else if (this.props.targetType === 'Industry') {
      pluralType = 'Industries';
    }

    if (this.props.targetType === 'Path' || this.props.targetType === 'Focus') {
      message = <p>Note: This will not remove your skills and knowledge in this {this.props.targetType}. You will still be able to see these in your profile</p>;
    }

    return (
      <div>
        <h3>This will undeclare {this.props.targetName} from your {pluralType}.</h3>
        {message}
        <p>If you change your mind, you can still decide to re-declare this {this.props.targetType}.</p>
        <h3>Are you sure you want to un-declare {this.props.targetName} from your {pluralType}?</h3>
      </div>
    );
  }
}

VerifyUndeclare.propTypes = {
  targetName: PropTypes.string,
  targetType: PropTypes.string
}
