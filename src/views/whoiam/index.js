import React from 'react';
import Header from 'Components/header/';
import Coffee from 'Components/coffee/';
import Footer from 'Components/footer/';
import Line from 'Components/line/';
import './index.scss';

const WhoIAm = () => (
    <div className="container-fluid">
        <div className="row justify-content-md-center">
            <div className="col-12">
                <Header />
            </div>
            <div className="col col-md-7">
                <div className="container">
                    <h1 className="container__title">Quien soy</h1>
                    <p className="container__content">
                        Hola!!! Mi nombre es <span className="container__content__highlighted">Eduardo Álvarez</span> y soy nivel 25 en este juego
                        llamado vida. Nacido y criado en Santiago de Chile (lugar donde sigo viviendo). Hijo
                        mayor de <span className="container__content__highlighted">Eduardo Álvarez Dubles</span> (super original mi
                        papá) y <span className="container__content__highlighted">Janett Castañeda González</span>.
                    </p>
                </div>
                <Line />
            </div>
        </div>
        <div className="row justify-content-md-center">
            <div className="col-12">
                <Coffee />
            </div>
        </div>
        <div className="row">
            <Footer />
        </div>
    </div>
);

export default WhoIAm;
