import React, { Component, PropTypes } from 'react';
import { Styles } from 'material-ui';
let { Colors, Typography } = Styles;

export default class RequiredIFDisplay extends Component {

  getStyles() {
  //    let desktopGutter = Styles.Spacing.desktopGutter;
    let padding = 400;
    let styles = {
      headline: {
        fontSize: 24,
        lineHeight: '15px',
        paddingTop: 8,
        marginTop: 18,
        marginBottom: 12,
        letterSpacing: 0,
        fontWeight: Typography.fontWeightNormal,
        color: Typography.textDarkBlack
      }
    };
    return styles;
  }

  render() {
    let styles = this.getStyles();

    let industrylist = [];
    let industrylist2 = [];
    let industrylist3 = [];

    let focuslist = <li>{this.props.selectedfocus}</li>;

    let indCounter = 0;
    let indLengthThird = (Object.keys(this.props.selectedindustries).length/3) > 7 ? (Object.keys(this.props.selectedindustries).length/3) : 7 ;

    for (let key in this.props.selectedindustries) {
      if (indCounter < indLengthThird) { industrylist.push(<li>{key}</li>); }
      else if (indCounter > indLengthThird && indCounter < (indLengthThird*2)) { industrylist2.push(<li>{key}</li>); }
      else if (indCounter > (indLengthThird*2)) { industrylist3.push(<li>{key}</li>); }
      indCounter++;
    }

//    <div className='requiredListBlock'>
//      <h1>Required Focus</h1>
//      <ul>{focuslist}</ul>
//    </div>
    return (
      <div>
        <h1 style={styles.headline}>Required Industry</h1>
        <div className='requiredListBlock'><ul>{industrylist}</ul></div>
        <div className='requiredListBlock'><ul>{industrylist2}</ul></div>
        <div className='requiredListBlock'><ul>{industrylist3}</ul></div>
      </div>
    );
  }
}

RequiredIFDisplay.propTypes = {
  selecteditem: PropTypes.string,
  selectedindustries: PropTypes.object,
  selectedfocus: PropTypes.string
};
