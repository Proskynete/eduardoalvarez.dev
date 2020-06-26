/* eslint-disable import/no-unresolved */
import React from 'react';
import config from '@Contents/logo';
import './index.scss';

const Logo = () => <span className='logo'>{config.logo.text}</span>;

export default Logo;
