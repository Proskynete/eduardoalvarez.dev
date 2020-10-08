import React, { FC, SyntheticEvent } from "react";
import { faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const handleSubscribe = async (e: SyntheticEvent) => {
  e.preventDefault();
};

const Subscribe: FC = () => {
  return (
    <form className="subscribe" onSubmit={(e) => handleSubscribe(e)}>
      <div className="subscribe-container">
        <p className="subscribe-title">Suscríbete</p>
        <p className="subscribe-subtitle">Para novedades, cursos y ofertas</p>
        <div className="subscribe-input-container">
          <div className="subscribe-label">
            <label htmlFor="name-subscribe" className="subscribe-input">
              <div className="icon">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <input
                id="name-subscribe"
                name="name-subscribe"
                type="text"
                className="with-icon"
                placeholder="Tu nombre"
                required
              />
            </label>
          </div>
          <div className="subscribe-label">
            <label htmlFor="email-subscribe" className="subscribe-input">
              <div className="icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <input
                id="email-subscribe"
                name="email-subscribe"
                type="email"
                className="with-icon"
                placeholder="Tu mail"
                required
              />
            </label>
          </div>
        </div>
        <div className="subscribe-button">
          <button type="submit" className="button secondary">
            Suscribirse
          </button>
        </div>
      </div>
    </form>
  );
};

export default Subscribe;
