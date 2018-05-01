/* eslint-disable react/no-unused-prop-types, react/require-default-props, jsx-a11y/label-has-for,
 react/forbid-prop-types, react/no-array-index-key, no-underscore-dangle */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showData } from '../../../actions/get_data';
import './contentpost.scss';

class ContentPost extends Component {
  componentWillMount() {
    this.props.showData();
  }

  render() {
    return (<h1>Hello World</h1>);
  }
}

const mapStateToProps = state => ({
  description: state.description.description,
});

ContentPost.propTypes = {
  showData: PropTypes.func.isRequired,
  description: PropTypes.object.isRequired,
};


export default connect(mapStateToProps, { showData })(ContentPost);
