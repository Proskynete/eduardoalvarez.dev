import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import config from '@Config/config-content';
import { getUserInfoAction } from '@Actions/';
import './index.scss';

const handleShowIconSocials = () =>
	config.socials.map((social) => (
		<a
			key={social.name}
			className='header__inner__socials__link'
			href={social.link}
			rel='noopener noreferrer'
			target='_blank'
		>
			<i className={social.icon} title={social.name} />
		</a>
	));

const Header = (props) => {
	const { content, getUserInfoMethod } = props;

	useEffect(() => {
		getUserInfoMethod();
	}, []);

	return (
		<>
			<div className='header'>
				<div className='header__inner'>
					<p className='header__inner__title'>
						Hola! Mi nombre es Eduardo Alvarez
					</p>
					<p className='header__inner__subtitle'>
						soy desarrollador web y éste es mi sitio web. Bienvenidx!!
					</p>
					<div className='header__inner__socials'>
						{handleShowIconSocials()}
					</div>
				</div>
			</div>
			<div className='header__me'>
				<img src={content.avatar} alt='Eduardo Esteban Álvarez Castañeda' />
			</div>
		</>
	);
};

Header.defaultProps = {
	content: {},
};

Header.propTypes = {
	content: PropTypes.object,
	getUserInfoMethod: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		content: state.userData.content,
	}),
	(dispatch) => ({
		getUserInfoMethod: getUserInfoAction(dispatch),
	}),
)(Header);
