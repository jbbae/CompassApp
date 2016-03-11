import React, {Component, PropTypes } from 'react';
import Firebase from 'firebase';
import Rebase from 're-base';

import { Avatar, FontIcon, IconButton, MenuItem, Paper, TextField, RaisedButton, SelectField, Styles } from 'material-ui';
let { Spacing, Colors } = Styles;

var base = new Rebase.createClass('https://sageview.firebaseio.com');
var authData = base.getAuth();

export default class PersonalInfoPopup extends Component {
  constructor() {
    super();
    this.handleOccChange = this.handleOccChange.bind(this);
    this._handleFloatingErrorInputChange = this._handleFloatingErrorInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._onUpload = this._onUpload.bind(this);
    this.handleImageInput = this.handleImageInput.bind(this);
    this.handleremovePic = this.handleremovePic.bind(this);
    this.state = {
      floatingErrorText: 'This field is required.',
      occValue: undefined,
      file: '',
      imagePreviewUrl: null,
      removeSwitch: false
    };
  }

  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview =
      <Avatar color={Colors.indigo50} backgroundColor={Colors.indigo900} size={180} src={this.props.userInfo.profilePic ? this.props.userInfo.profilePic : null}>
        { this.props.userInfo.profilePic ? null : this.props.userInfo.firstName.substring(0,1).concat(this.props.userInfo.lastName.substring(0,1)) }
      </Avatar>;
    if (imagePreviewUrl) {
      $imagePreview = (<Avatar size={180} src={imagePreviewUrl} />);
    }

    return (
      <div>
        <div id='infoentry'>
          <div id='picChangeWrap'>
            <input type="file" id="profilePic" ref="profilePic" onChange={this._onUpload.bind(this)}></input>
            <div id='picPrevWrap'>
              <div id='picPrevFiller'></div>
              <Paper id='picPreviewHolder' zDepth={3} circle={true}>{$imagePreview}</Paper>
              <IconButton id='removePicButton' tooltip={this.props.userInfo.profilePic ? "Remove Profile Pic" : null} tooltipPosition="bottom-right" onTouchTap={this.handleremovePic}>
                <FontIcon className="material-icons" color={this.props.userInfo.profilePic ? Colors.redA700 : Colors.pink50}>clear</FontIcon>
              </IconButton>
            </div>
            <RaisedButton label="Change Image" secondary={true} onTouchTap={this.handleImageInput} />
          </div>
          <TextField
            ref='firstname'
            style={{margin:'0px 20px 0px 20px'}}
            hintText="Enter your First Name"
            floatingLabelText="First Name"
            defaultValue={this.props.userInfo.firstName}
            onEnterKeyDown={this._handleSubmit}
            onChange={this._handleFloatingInputChange} />
          <TextField
            ref='lastname'
            style={{margin:'0px 20px 0px 20px'}}
            hintText="Enter your Last Name"
            floatingLabelText="Last Name"
            defaultValue={this.props.userInfo.lastName}
            onEnterKeyDown={this._handleSubmit}
            onChange={this._handleFloatingInputChange} />
          <TextField
            ref='id'
            style={{margin:'0px 20px 0px 20px'}}
            hintText="Enter your ID"
            floatingLabelText="ID"
            defaultValue={this.props.userInfo.username}
            onEnterKeyDown={this._handleSubmit}
            onChange={this._handleFloatingInputChange} />
          <TextField
            ref='email'
            style={{margin:'0px 20px 0px 20px'}}
            hintText="Enter Email"
            floatingLabelText="Email"
            defaultValue={this.props.userInfo.email}
            onEnterKeyDown={this._handleSubmit}
            onChange={this._handleFloatingInputChange} />
          <SelectField
            style={{margin:'0px 20px 0px 20px'}}
            value={this.state.occValue === undefined ? this.props.userInfo.occupation : this.state.occValue}
            onChange={this.handleOccChange}
            floatingLabelText="Occupation">
            <MenuItem value='Student' primaryText='Student' />
            <MenuItem value='Employee' primaryText='Employee' />
            <MenuItem value='Teacher' primaryText='Teacher/Instructor' />
            <MenuItem value='None' primaryText='None (On my way to greatness!)' />
            <MenuItem value='Other' primaryText='Other' />
          </SelectField>
          <TextField
            ref='org'
            style={{margin:'0px 20px 0px 20px'}}
            hintText="Enter your Organization"
            floatingLabelText="Organization"
            defaultValue={this.props.userInfo.organization}
            onEnterKeyDown={this._handleSubmit}
            onChange={this._handleFloatingInputChange} />
        </div>
        <div className='buttonWrapper'>
          <RaisedButton
            label="Update my info"
            primary={true}
            onTouchTap={this._handleSubmit} />
        </div>
      </div>
    );
  }

  handleImageInput() {
    this.refs.profilePic.click();
  }

  _onUpload(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(file)
  }

  handleOccChange(e, index, value) {
    this.setState({occValue: value});
  }

  _handleFloatingErrorInputChange(e) {
    this.setState({
      floatingErrorText: e.target.value ? '' : 'This field is required.'
    });
  }

  _handleSubmit() {
    let self = this;

    let firstname = this.refs.firstname.getValue();
    let lastname = this.refs.lastname.getValue();
    let org = this.refs.org.getValue();
    let email = this.refs.email.getValue();
    let occupation;
    if (this.state.occValue === undefined) {
      this.setState({ occValue: this.props.userInfo.occupation });
      occupation = this.props.userInfo.occupation;
    } else {
      occupation = this.state.occValue;
    }
    let id = this.refs.id.getValue();

    let newUserInfo = this.props.userInfo;
    newUserInfo.username = id;
    newUserInfo.firstName = firstname;
    newUserInfo.lastName = lastname;
    newUserInfo.organization = org;
    newUserInfo.email = email;
    newUserInfo.occupation = occupation;
    if (this.state.imagePreviewUrl) {
      newUserInfo.profilePic = this.state.imagePreviewUrl;
    } else {
      if (!this.state.removeSwitch) {
        newUserInfo.profilePic = self.props.userInfo.profilePic;
      } else {
        newUserInfo.profilePic = null;
      }
    }

    let newuserEP = 'users/' + authData.uid;
    base.post(newuserEP, {
      data: newUserInfo,
      then() {
        self.props.closePopup();
      }
    });
  }

  handleremovePic() {
    let newuserEP = 'users/' + authData.uid + '/profilePic';
    base.post(newuserEP, {
      data: null,
      then() {
        this.props.closePopup();
      }
    });
    this.setState({ removeSwitch: true });
  }
}

PersonalInfoPopup.propTypes = {
  userInfo: PropTypes.object,
  closePopup: PropTypes.func
};
