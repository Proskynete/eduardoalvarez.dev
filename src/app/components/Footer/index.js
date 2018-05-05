import React from 'react';
import './index.scss';

const Footer = () =>
  (<div className="d-flex flex-column justify-content-center">
    <div className="footer flex-row align-items-end d-none d-sm-block">
      <div className="footer__copyright">Copyright 2016 - 2018</div>
      <div className="footer__tecnologies d-none d-sm-block">
        <i className="fab fa-html5" />
        <i className="fab fa-css3" />
        <i className="fab fa-js-square" />
        <i className="fab fa-react" />
        <i className="fab fa-node-js" />
        <i className="fab fa-sass" />
        <i className="fab fa-linode" />
      </div>
    </div>
  </div>);

export default Footer;
