import React from 'react';
import { Link } from "react-router-dom";

import Header from 'Components/header/';
import Coffee from 'Components/coffee/';
import Footer from 'Components/footer/';
import LinkWeb from 'Components/linkweb/';
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
                        Hola!!! Mi nombre es <span className="container__content__highlighted">Eduardo Esteban Álvarez Castañeda</span> y soy
                        nivel 25 en este juego llamado vida. Nacido y criado en Santiago de Chile (lugar donde sigo viviendo). Hijo
                        mayor de <span className="container__content__highlighted">Eduardo Álvarez Dubles</span> (super original mi
                        papá) y <span className="container__content__highlighted">Janett Castañeda González</span>. Un día Viernes, cuando
                        recien partía el día 24 de Diciembre del año 1993 fue cuando dije mi
                        primer <span className="container__content__highlighted">Hola Mundo</span>.
                    </p>
                    <p className="container__content">
                        Actualmente me encuentro trabajando para <LinkWeb link="http://www.globant.com" title="Globant" /> como
                        <span className="container__content__highlighted">Desarrollador Web Ssr</span>. En las tardes
                        me voy a la universidad para estudiar <span className="container__content__highlighted">Ingeniería en computación
                        e informática</span> y los fines de semana (o cuando encuentro un tiempo libre) me dedico a hacer contenido para mi blog.
                    </p>
                    <p className="container__content">
                        Por si quieres saber más a detalle en lo que estoy actualmente,
                        visita <Link className="container__content__link" to="/now">éste link</Link>.
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
