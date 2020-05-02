/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { notificationCleanAction } from '@Actions/';
import './index.scss';

const Notifications = props => {
	const { show, type, text, notificationCleanMethod } = props;

	const [showState, setShowState] = useState('');
	const [typeState, setTypeState] = useState('');
	const [textState, setTextState] = useState('');

	useEffect(() => {
		setShowState(show);
		setTypeState(type);
		setTextState(text);
	}, [show]);

	useEffect(() => {
		setTimeout(() => {
			notificationCleanMethod();
		}, 5000);
	});

	return (
		<div
			id="notification"
			className={`notifications${showState ? ' show' : ''}${
				typeState ? ` ${typeState}` : ''
			}`}
		>
			{textState}
		</div>
	);
};

Notifications.propTypes = {
	show: PropTypes.bool.isRequired,
	type: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	notificationCleanMethod: PropTypes.func.isRequired,
};

export default connect(
	state => ({
		show: state.notification.show,
		type: state.notification.type,
		text: state.notification.text,
	}),
	dispatch => ({
		notificationCleanMethod: notificationCleanAction(dispatch),
	}),
)(Notifications);
