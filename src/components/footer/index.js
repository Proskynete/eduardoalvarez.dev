import React from 'react';
import config from 'Config/config';
import './index.scss';

const Footer = () => (
  <footer className="footer">
    <p className="footer__block">© 2017 - 2019 | eduardoalvarez.cl</p>
    <p className="footer__block">
      {config.createdWith.map(icon => <i key={icon} className={icon} />)}
    </p>
  </footer>
);

export default Footer;
