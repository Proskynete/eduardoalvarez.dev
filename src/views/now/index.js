import React from 'react';
import Header from '../../components/header/';
import Coffee from '../../components/coffee/';
import Footer from '../../components/footer/';
import LinkWeb from '../../components/linkweb/';
import Line from '../../components/line/';
import './index.scss';

const Now = () => (
    <div className="container-fluid">
        <div className="row justify-content-md-center">
            <div className="col-12">
                <Header />
            </div>
            <div className="col col-md-7">
                <div className="container">
                    <h1 className="container__title">Now</h1>
                    <p className="container__content">
                        Estoy viviendo en el centro de Santigo.
                    </p>
                    <p className="container__content">
                        Tengo 25 años.
                    </p>
                    <p className="container__content">
                        Me encuentro estudiando Ingeniería en Computación e Informática en la
                        universidad <LinkWeb link="https://www.unab.cl/" title="Andres Bello (UNAB)" />.
                    </p>
                    <p className="container__content">
                        Soy Web UI SSr en la empresa <LinkWeb link="http://www.globant.com" title="Globant" />.
                    </p>
                    <p className="container__content">
                        Silver III en el juego <LinkWeb link="http://www.leagueoflegends.com" title="League of legends" />, servidor de LAS. Nombre
                        de invocador <span className="container__content__destaked">Proskynete</span>.
                    </p>
                    <p className="container__content">
                        Dicté mi primera charla sobre las tecnologías <span className="container__content__destaked">React/Redux</span> para las chicas
                        de <LinkWeb link="http://www.laboratoria.com" title="Laboratoria Chile" />
                    </p>
                    <p className="container__content">
                        Estoy estudiando React-Native
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

export default Now;
