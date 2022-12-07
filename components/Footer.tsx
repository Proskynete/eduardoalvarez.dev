import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { scrollToTop } from "helpers/scroll.helper";
import { useWindowDimensions } from "hooks/useWindowDimensions";
import { CONSTANTS, event } from "lib/gtag";
import Image from "next/image";
import { memo } from "react";

const handleScrollToTop = () => {
  scrollToTop();
  event({
    action: "scroll_to_top",
    category: CONSTANTS.BUTTON_ACTION.CATEGORY,
    label: "Track button - scroll to top",
    value:
      "Función que permite hacer un scroll animado hasta el top de la vista",
  });
};

const Footer = () => {
  const currentYear: number = new Date().getFullYear();
  const { width } = useWindowDimensions();

  return (
    <section className="row">
      <footer className="footer">
        <div className="footer-button">
          <button className="button outline" onClick={handleScrollToTop}>
            <FontAwesomeIcon icon={faAngleUp} />
            <p className="footer-button-text">Subir</p>
          </button>
          <div className="footer-legals">
            <p className="made-by">
              Desarrollado con <FontAwesomeIcon icon={faHeart} /> desde 🇨🇱
            </p>
          </div>
        </div>

        <div className="footer-info">
          <div className="copyright">
            <Image
              src={`/images/logo/black${width >= 768 ? "2" : ""}.png`}
              alt="logotipo"
              width={width >= 768 ? 200 : 300}
              height={width >= 768 ? 88 : 135}
            />
            <p>Copyright &copy; 2021 - {currentYear}</p>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default memo(Footer);
