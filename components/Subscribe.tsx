import React, { FC, SyntheticEvent } from "react";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const handleSubscribe = async (e: SyntheticEvent) => {
  e.preventDefault();
};

const Subscribe: FC = () => {
  return (
    <form className="subscribe" onSubmit={(e) => handleSubscribe(e)}>
      <div className="container">
        <p className="subscribe-title">Suscríbete</p>
        <p className="subscribe-subtitle">Para novedades, cursos y ofertas</p>
        <label className="subscribe-input">
          <div className="icon">
            <FontAwesomeIcon icon={faEnvelope} />
          </div>
          <input type="email" placeholder="Tu mail" required />
        </label>
        <div className="subscribe-button">
          <input
            type="submit"
            className="button secondary"
            value="Suscríbete"
          />
        </div>
      </div>
    </form>
  );
};

export default Subscribe;
