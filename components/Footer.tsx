import React, { FC } from "react";
import { scrollToTop } from "helpers/scroll.helper";
import Subscribe from "./Subscribe";
import SocialNetworks from "./SocialNetworks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import config from "data/config.json";

const Footer: FC = () => {
  return (
    <section className="row">
      <section className="col-xs-12">
        <Subscribe />
      </section>
      <SocialNetworks />
      <footer className="footer">
        <div className="footer-button">
          <button className="button outline" onClick={() => scrollToTop()}>
            <FontAwesomeIcon icon={faAngleUp} />
            <p className="footer-button-text">Subir</p>
          </button>
        </div>
        <div className="footer-mail">
          <p className="footer-mail-title">Contacto</p>
          <a
            href={`mailto:${config.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-mail-link"
          >
            {config.email}
          </a>
        </div>

        <div className="copyright">
          <img src="/images/logo/white.png" alt="logotipo" />
          <p>Copyright &copy; 2017 - 2020</p>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
