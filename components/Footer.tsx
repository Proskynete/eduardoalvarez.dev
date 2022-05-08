import { faAngleUp, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import config from "data/config.json";
import { scrollToTop } from "helpers/scroll.helper";
import { CONSTANTS, event } from "lib/gtag";
import dynamic from "next/dynamic";
import { memo } from "react";

const SocialNetworks = dynamic(() => import("components/SocialNetworks"));
const Subscribe = dynamic(() => import("components/Subscribe"));

const handleScrollToTop = () => {
  scrollToTop();
  event({
    action: "SCROLL_TO_TOP",
    category: CONSTANTS.BUTTON_ACTION.CATEGORY,
    label: "Track button - scroll to top",
    value:
      "Función que permite hacer un scroll animado hasta el top de la vista",
  });
};

const Footer = () => {
  const currentYear: number = new Date().getFullYear();

  return (
    <section className="row">
      <section className="col-12">
        <Subscribe />
      </section>
      <SocialNetworks />
      <footer className="footer">
        <div className="footer-button">
          <button
            className="button outline"
            onClick={() => handleScrollToTop()}
          >
            <FontAwesomeIcon icon={faAngleUp} />
            <p className="footer-button-text">Subir</p>
          </button>
          <div className="footer-legals">
            <div className="footer-legals-links">
              {/*<span className='legal'>Términos</span>
							<span className='legal'>Políticas</span>*/}
            </div>
            <p className="made-by">
              Creado con <FontAwesomeIcon icon={faHeart} />
            </p>
          </div>
        </div>

        <div className="footer-info">
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
            <img
              decoding="async"
              data-sizes="auto"
              data-src="/images/logo/black.png"
              alt="logotipo"
              loading="lazy"
              className="small lazyload"
            />
            <img
              decoding="async"
              data-sizes="auto"
              data-src="/images/logo/black2.png"
              alt="logotipo"
              loading="lazy"
              className="medium lazyload"
            />
            <p>Copyright &copy; {currentYear}</p>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default memo(Footer);
