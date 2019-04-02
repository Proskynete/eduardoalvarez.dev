import React from 'react';
import Header from '../../components/header/';
import './index.scss';

const Home = () => (
    <div className="container-fluid">
        <div className="row justify-content-md-center">
            <div className="col-12">
                <Header />
            </div>
            <div className="col col-md-8">
                <div className="container">
                    <h1 className="container__title">Quien soy en 10 segundos</h1>
                    <p className="container__content">
                        Soy estudiante de ingeniería en informática en la <a className="container__content__link" href="https://www.unab.cl/es/">UNAB</a>,
                        desarrollador web (Web UI) en la empresa <a className="container__content__link" href="http://www.globant.com">Globant</a>.
                        Busco poder compartir mi conocimiento en este blog
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default Home;
