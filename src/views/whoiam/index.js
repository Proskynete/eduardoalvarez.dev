/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getWhoIAmDataAction } from '@Actions/';
import { createMarkup } from '@Helpers/print-html.helper';
import Footer from '@Components/footer/';
import './index.scss';

const handlePrintContent = data =>
	data.map(ele => {
		return (
			<div key={ele._id} className="container">
				<div className="container__header">
					<p className="container__header__title">{ele.title}</p>
					<p className="container__header__subtitle">{ele.subtitle}</p>
				</div>
				<div
					className="container__content"
					dangerouslySetInnerHTML={createMarkup(JSON.parse(ele.content))}
				/>
			</div>
		);
	});

const WhoIAm = props => {
	const { content, getWhoIAmDataMethod } = props;

	useEffect(() => {
		getWhoIAmDataMethod();
	}, []);

	return (
		<div className="container-fluid">
			<div className="row justify-content-md-center">
				<div className="col col-md-5">{handlePrintContent(content)}</div>
			</div>
			<div className="row">
				<Footer />
			</div>
		</div>
	);
};

WhoIAm.propTypes = {
	content: PropTypes.array.isRequired,
	getWhoIAmDataMethod: PropTypes.func.isRequired,
};

export default connect(
	state => ({
		content: state.whoIAmData.content,
	}),
	dispatch => ({
		getWhoIAmDataMethod: getWhoIAmDataAction(dispatch),
	}),
)(WhoIAm);
