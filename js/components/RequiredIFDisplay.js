import React, { Component, PropTypes } from 'react';

export default class RequiredIFDisplay extends Component {

  render() {
    let industrylist = [];
    let focuslist = <li>{this.props.selectedfocus}</li>;

    for (let key in this.props.selectedindustries) {
      industrylist.push(<li>{key}</li>);
    }

    return (
      <div>
        <div className='requiredListBlock'>
          <h1>Required Industry</h1>
          <ul>{industrylist}</ul>
        </div>
        <div className='requiredListBlock'>
          <h1>Required Focus</h1>
          <ul>{focuslist}</ul>
        </div>
      </div>
    );
  }
}

RequiredIFDisplay.propTypes = {
  selecteditem: PropTypes.string,
  selectedindustries: PropTypes.object,
  selectedfocus: PropTypes.string
};
