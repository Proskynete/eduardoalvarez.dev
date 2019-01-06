import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './index.scss';

const App = (props) => {
    return (<div className="row">
        Hello World
    </div>);
};

const mapStateToProps = state => ({
  profile: state.profile.profile,
});

App.propTypes = {
  profile: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(App);
