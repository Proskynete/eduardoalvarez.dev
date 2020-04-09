import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAboutMeDataAction } from '@Actions/';
import { createMarkup } from '@Helpers/print-html.helper';
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

const AboutMeView = props => {
	const { content, getAboutMeDataMethod } = props;

	useEffect(() => {
		getAboutMeDataMethod();
	}, []);

	return (
		<div className="container-fluid">
			<div className="row justify-content-md-center">
				<div className="col col-md-5">{handlePrintContent(content)}</div>
			</div>
		</div>
	);
};

AboutMeView.propTypes = {
	content: PropTypes.array.isRequired,
	getAboutMeDataMethod: PropTypes.func.isRequired,
};

export default connect(
	state => ({
		content: state.aboutMeData.content,
	}),
	dispatch => ({
		getAboutMeDataMethod: getAboutMeDataAction(dispatch),
	}),
)(AboutMeView);
