import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAboutMeDataAction } from '@Actions/';
import { transformMarkdownToHtml } from '@Helpers/print-html.helper';
import { changeMetadataValue } from '@Helpers/add_metadata.helper';
import { Loader } from '@Components';
import './index.scss';

const handlePrintContent = (data) =>
	data.map((ele) => {
		return (
			<div key={ele._id} className='container'>
				<div className='container__header'>
					<p className='container__header__title'>{ele.title}</p>
					<p className='container__header__subtitle'>{ele.subtitle}</p>
				</div>
				<div className='container__content'>
					{transformMarkdownToHtml(ele.content)}
				</div>
			</div>
		);
	});

const AboutMeView = (props) => {
	const { content, getAboutMeDataMethod } = props;

	useEffect(() => {
		getAboutMeDataMethod();
	}, []);

	return content.length > 0 ? (
		<>
			{changeMetadataValue({ title: 'Sobre mi | eduardoalvarez.cl' })}
			<div className='container-fluid'>
				<div className='row justify-content-md-center'>
					<div className='col col-md-5'>{handlePrintContent(content)}</div>
				</div>
			</div>
		</>
	) : (
		<Loader />
	);
};

AboutMeView.propTypes = {
	content: PropTypes.array.isRequired,
	getAboutMeDataMethod: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		content: state.aboutMeData.content,
	}),
	(dispatch) => ({
		getAboutMeDataMethod: getAboutMeDataAction(dispatch),
	}),
)(memo(AboutMeView));
