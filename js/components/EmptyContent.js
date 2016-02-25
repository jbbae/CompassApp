import React, { Component, PropTypes } from 'react';

export default class EmptyContent extends Component {
  render() {
    return (
      <div className='planDecPopupDiv'>
        <h3 className='popupH3'>Sorry, this content is not ready yet!</h3>
        <p className='popupP'>We are working very hard to get the most accurate information to you as soon as possible!</p>
      </div>
    );
  }
}

EmptyContent.propTypes = {
};
