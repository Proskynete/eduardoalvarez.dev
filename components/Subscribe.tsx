import { faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AlertContext } from "context/alertContext";
import { validateEmail } from "helpers/validation";
import { CONSTANTS, event } from "lib/gtag";
import {
  InputsInterface,
  TargetElementInterface,
} from "models/subscribe.model";
import { FocusEvent, memo, SyntheticEvent, useContext, useState } from "react";

const defaultValues: InputsInterface = {
  name: "",
  email: "",
};

const Subscribe = () => {
  const [state, setState] = useState<InputsInterface>(defaultValues);
  const [buttonState, setButtonState] = useState({
    disabled: true,
    loading: false,
  });
  const { setAlert } = useContext(AlertContext);

  const handleChangeInput = (e: TargetElementInterface): void => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleValidateInputs = (e: FocusEvent<HTMLInputElement>): void => {
    if (
      state.name !== "" &&
      state.name.length >= 3 &&
      validateEmail(state.email)
    ) {
      setButtonState({ ...buttonState, disabled: false });
    } else {
      setButtonState({ ...buttonState, disabled: true });
    }
  };

  const handleSubscribe = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    setButtonState({ ...buttonState, loading: true });

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: state.email,
          name: state.name,
        }),
      });

      event({
        action: "SUBSCRIBE_ACTION",
        category: CONSTANTS.EVENT_ACTION.CATEGORY,
        label: "Track action - subscribe action",
        value: `Llamar a la función para suscribirse`,
      });

      const { code, error, message } = await res.json();

      setAlert({
        show: true,
        variant: code !== 200 ? "error" : "success",
        title: code !== 200 ? error : message,
      });

      if (code === 200) setState(defaultValues);

      setButtonState({ ...buttonState, loading: false });
    } catch (_) {
      setAlert({
        show: true,
        variant: "error",
        title:
          "Error de comunicación. Revisa la conexión de tu internet e intenta nuevamente.",
      });
      setButtonState({ ...buttonState, loading: false });
    }
  };

  return (
    <form className="subscribe" onSubmit={handleSubscribe}>
      <div className="subscribe-container">
        <p className="subscribe-title">Suscríbete</p>
        <p className="subscribe-subtitle">Para novedades, cursos y ofertas.</p>

        <div className="subscribe-inputs-container">
          <div className="subscribe-inputs-container_input">
            <div className="subscribe-inputs-container_input__icon_container">
              <FontAwesomeIcon
                icon={faUser}
                className="subscribe-inputs-container_input__icon_container__icon"
              />
            </div>

            <input
              id="name"
              name="name"
              type="text"
              className="subscribe-inputs-container_input__input"
              placeholder="Tu nombre"
              value={state.name}
              onChange={handleChangeInput}
              onBlur={handleValidateInputs}
              required
              autoComplete="off"
              autoCapitalize="off"
            />
          </div>

          <div className="subscribe-inputs-container_input">
            <div className="subscribe-inputs-container_input__icon_container">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="subscribe-inputs-container_input__icon_container__icon"
              />
            </div>

            <input
              id="email"
              name="email"
              type="email"
              className="subscribe-inputs-container_input__input"
              placeholder="Tu email"
              value={state.email}
              onChange={handleChangeInput}
              onBlur={handleValidateInputs}
              required
              autoComplete="off"
              autoCapitalize="off"
            />
          </div>
        </div>

        <div className="subscribe-button">
          <button
            type="submit"
            className="button secondary"
            disabled={buttonState.disabled}
          >
            {buttonState.loading ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              "Suscribirse"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default memo(Subscribe);
