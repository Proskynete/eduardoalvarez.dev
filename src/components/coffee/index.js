import React from 'react';
import './index.scss';

const handleShowButtonBMAC = () => (
    <a className="coffee__inner__container__btn_bmc" target="_blank" href="https://www.buymeacoffee.com/eduardoalvarez">
        <img src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg" alt="Buy me a coffee" />
        <span>Buy me a coffee</span>
    </a>
)

const Coffee = () => (
    <section className="coffee">
        <div className="coffee__inner">
            <div className="coffee__inner__container">
                <h1 className="coffee__inner__container__title">Te sirvió en algo este sitio?</h1>
                <p className="coffee__inner__container__content">Entonces... Podrías invítame un café?</p>
                { handleShowButtonBMAC() }
            </div>
        </div>
    </section>
);

export default Coffee;
