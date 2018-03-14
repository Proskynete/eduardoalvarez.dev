import React from 'react';
import './footer.scss';

const Footer = () => {
  return (
      <div className="d-flex flex-column justify-content-center">
        <div className="footer flex-row align-items-end">
          <div className="footer__copyright">Copyright 2016 - 2018</div>
          <div className="footer__tecnologies d-none d-sm-block">
            <i className="fab fa-html5"></i>
            <i className="fab fa-css3"></i>
            <i className="fab fa-js-square"></i>
            <i className="fab fa-react"></i>
            <i className="fab fa-node-js"></i>
            <i className="fab fa-sass"></i>
            <i className="fab fa-linode"></i>
          </div>
        </div>
      </div>
  );
};

export default Footer;
