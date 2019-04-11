import React from 'react';

import Author from 'Components/author';
import './index.scss';

const handleShowButtonBMAC = () => (
    <a className="coffee__inner__container__btn_bmc" target="_blank" href="https://www.buymeacoffee.com/eduardoalvarez">
        <img src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg" alt="invítame un café" />
        <span>Buy me a coffee</span>
    </a>
)

const Coffee = ({ children }) => (
    <section className="coffee">
        <div className="coffee__inner">
            {
                (children) ?
                    <div className="coffee__inner__container">
                        <Author />
                    </div>
                : ""
            }
            <div className="coffee__inner__container">
                <h1 className="coffee__inner__container__title">Te sirvió en algo este sitio?</h1>
                <p className="coffee__inner__container__content">
                    Podrías invítame un café? <i className="fas fa-coffee" />
                </p>
                { handleShowButtonBMAC() }
            </div>
        </div>
    </section>
);

export default Coffee;
