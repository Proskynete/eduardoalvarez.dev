import React, { FC, SyntheticEvent, useState } from "react";
import { faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface InputsInterface {
  name: string;
  email: string;
}

const defaultValues: InputsInterface = {
  name: '',
  email: '',
}

interface TargetElementInterface {
  target: HTMLInputElement;
}


const Subscribe: FC = () => {
  const [values, setValues] = useState<InputsInterface>(defaultValues);
  const [messageResponse, setMessageResponse] = useState('');

  const handleChangeInput = (e: TargetElementInterface) => {
    setValues({
      ...values,
      [e.target.id]: e.target.value
    })
  };

  const handleSubscribe = async (e: SyntheticEvent) => {
    e.preventDefault();

    const res = await fetch('/api/subscribe', {
      body: JSON.stringify({
        email: values.email,
        name: values.name
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    });

    const { error, message } = await res.json();

    if (error) setMessageResponse(error);

    setMessageResponse(message);
  };


  return (
    <form className="subscribe" onSubmit={(e) => handleSubscribe(e)}>
      <div className="subscribe-container">
        <p className="subscribe-title">Suscríbete</p>
        <p className="subscribe-subtitle">Para novedades, cursos y ofertas</p>
        <div className="subscribe-input-container">
          <div className="subscribe-label">
            <label htmlFor="name" className="subscribe-input">
              <div className="icon">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <input
                id="name"
                type="text"
                className="with-icon"
                placeholder="Tu nombre"
                value={values.name}
                onChange={(e) => handleChangeInput(e)}
                required
              />
            </label>
          </div>
          <div className="subscribe-label">
            <label htmlFor="email" className="subscribe-input">
              <div className="icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <input
                id="email"
                type="email"
                className="with-icon"
                placeholder="Tu correo"
                value={values.email}
                onChange={(e) => handleChangeInput(e)}
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
        <div>{messageResponse}</div>
      </div>
    </form>
  );
};

export default Subscribe;
