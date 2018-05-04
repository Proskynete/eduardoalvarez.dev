/* eslint-disable react/no-unused-prop-types, react/require-default-props, jsx-a11y/label-has-for,
 react/forbid-prop-types, react/no-array-index-key, no-underscore-dangle */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Article from '../../components/Article/';
import { showData } from '../../../actions/get_data';

import './index.scss';

class Articles extends Component {
  componentWillMount() {
    this.props.showDataMethod();
  }

  render() {
    if (this.props.articles.length < 1) {
      return (<p className="text-center" />);
    }
    const articleContent = this.props.articles.map(data => <Article content={data} key={data._id} />);
    return (<div className="posts">{articleContent}</div>);
  }
}

Articles.propTypes = {
  showDataMethod: PropTypes.func.isRequired,
  articles: PropTypes.array.isRequired,
};

export default connect(
  state => ({
    articles: state.articles.articles,
  }),
  dispatch => ({
    showDataMethod: showData(dispatch),
  }),
)(Articles);
