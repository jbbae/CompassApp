import React, {Component, PropTypes} from 'react';
import Firebase from 'firebase';
import Rebase from 're-base';

var base = new Rebase.createClass('https://sageview.firebaseio.com');
var authData = base.getAuth();

export default class ExplorerListFilter extends Component {
  constructor() {
    super();
  }

  render() {
    let userPrefSwitch = true;

    if (authData) {
      let userEndPoint = 'users/' + authData.uid + '/' + this.props.exploreType;
      this.ref = base.fetch(userEndPoint, {
        context: this,
        then(data) {
          if ( !this.props.likeShow || !this.props.neutralShow || !this.props.dislikeShow ) {
            if ( this.props.likeShow && this.props.neutralShow && !this.props.dislikeShow ) {
              for (var key in data) {
                if (!data[key].likeStatus && this.props.filtertarget === key) {
                  userPrefSwitch = false;
                  break;
                }
              }

            } else if ( this.props.likeShow && !this.props.neutralShow && this.props.dislikeShow ) {
              userPrefSwitch = false;
              for (var key in data) {
                if (this.props.filtertarget === key) {
                  userPrefSwitch = true;
                  break;
                }
              }

            } else if ( !this.props.likeShow && this.props.neutralShow && this.props.dislikeShow ) {
              for (var key in data) {
                if (data[key].likeStatus && this.props.filtertarget === key) {
                  userPrefSwitch = false;
                  break;
                }
              }

            } else if ( this.props.likeShow && !this.props.neutralShow && !this.props.dislikeShow ) {
              userPrefSwitch = false;
              for (var key in data) {
                if (data[key].likeStatus && this.props.filtertarget === key) {
                  userPrefSwitch = true;
                  break;
                }
              }

            } else if ( !this.props.likeShow && this.props.neutralShow && !this.props.dislikeShow ) {
              for (var key in data) {
                if (this.props.filtertarget === key) {
                  userPrefSwitch = false;
                  break;
                }
              }

            } else if ( !this.props.likeShow && !this.props.neutralShow && this.props.dislikeShow ) {
              userPrefSwitch = false;
              for (var key in data) {
                if (!data[key].likeStatus && this.props.filtertarget === key) {
                  userPrefSwitch = true;
                  break;
                }
              }
            }
          }
        }
      });
    }

    if (this.props.exploreType === 'Path') {
      let crossSwitch = false;

      let indEndPoint = 'users/' + authData.uid + '/Industry';
      base.fetch(indEndPoint, {
        context: this,
        then(indList) {
          for (var key1 in this.props.targetIndustries) {
            for (var key2 in indList) {
              if ( key1 === key2 && indList[key2].likeStatus ) {
                crossSwitch = true;
                break; }
            }
            if (crossSwitch) { break; }
          }
          if (!crossSwitch) { userPrefSwitch = false; }
        }
      });
    }

    return (
      userPrefSwitch
    );
  }
}

ExplorerListFilter.propTypes = {
  exploreType: PropTypes.string,
  filtertarget: PropTypes.string,
  targetIndustries: PropTypes.object,
  likeShow: PropTypes.bool,
  neutralShow: PropTypes.bool,
  dislikeShow: PropTypes.bool
};
