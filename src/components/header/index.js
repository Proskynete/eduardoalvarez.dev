import React from 'react';
import Logo from '../logo/';
import config from '../../config/config';
import randomText from '../../helpers/random-text';
import './index.scss';

const handleShowIconSocials = socials => (
    socials.map(social => <a key={social.name} className="header__inner__container__socials__link" href={social.link}>
        <i className={social.icon} title={social.name} />
    </a>)
);

const Header = () => (
    <div className="header">
        <div className="header__inner">
            <div className="header__inner__container">
                <div className="header__inner__container__logo">
                    <Logo />
                </div>
                <div className="header__inner__container__slogan">
                    { randomText(config.philosophies) }
                </div>
                <div className="header__inner__container__socials">
                    { handleShowIconSocials(config.socials) }
                </div>
            </div>
        </div>
    </div>
);

export default Header;
